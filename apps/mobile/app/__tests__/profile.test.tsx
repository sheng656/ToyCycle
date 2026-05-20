import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ProfileScreen from '../(tabs)/profile';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';

const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockUser = { id: 'user-abc', email: 'me@example.com' };

const mockProfileData = {
  display_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg',
  latitude: 39.9042,
  longitude: 116.4074,
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    alertSpy.mockClear();
    jest.clearAllMocks();
    useAuthStore.setState({
      user: mockUser as any,
      signOut: jest.fn(),
    } as any);
  });

  it('renders profile data after fetching from Supabase', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProfileData, error: null, status: 200 }),
    } as any);

    render(<ProfileScreen />);

    await waitFor(() => {
      // Display name is shown in Input field
      const displayNameInput = screen.UNSAFE_getByProps({ value: 'John Doe' });
      expect(displayNameInput).toBeTruthy();
    });
  });

  it('renders email as readonly from auth user', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProfileData, error: null, status: 200 }),
    } as any);

    render(<ProfileScreen />);

    await waitFor(() => {
      const emailInput = screen.UNSAFE_getByProps({ value: 'me@example.com' });
      expect(emailInput.props.editable).toBe(false);
    });
  });

  it('updates profile when Update Profile button is pressed', async () => {
    const upsertMock = jest.fn().mockResolvedValue({ error: null });

    jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockProfileData, error: null, status: 200 }),
          upsert: upsertMock,
        } as any;
      }
      return {} as any;
    });

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.UNSAFE_getByProps({ value: 'John Doe' })).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Update Profile'));

    await waitFor(() => {
      expect(upsertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-abc',
          display_name: 'John Doe',
        })
      );
      expect(alertSpy).toHaveBeenCalledWith('Success', 'Profile updated!');
    });
  });

  it('shows an alert when profile update fails', async () => {
    const upsertMock = jest.fn().mockResolvedValue({ error: new Error('Update failed') });

    jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockProfileData, error: null, status: 200 }),
          upsert: upsertMock,
        } as any;
      }
      return {} as any;
    });

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.UNSAFE_getByProps({ value: 'John Doe' })).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Update Profile'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Update failed');
    });
  });

  it('allows picking an avatar image via image picker', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProfileData, error: null, status: 200 }),
    } as any);

    const pickerSpy = jest.spyOn(ImagePicker, 'launchImageLibraryAsync').mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file://my-avatar.jpg', base64: 'abc123' }],
    } as any);

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText('Change Avatar')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Change Avatar'));

    await waitFor(() => {
      expect(pickerSpy).toHaveBeenCalled();
    });
  });

  it('calls signOut when Sign Out button is pressed', async () => {
    const signOutMock = jest.fn();
    useAuthStore.setState({ user: mockUser as any, signOut: signOutMock } as any);

    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProfileData, error: null, status: 200 }),
    } as any);

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Sign Out'));

    expect(signOutMock).toHaveBeenCalled();
  });
});
