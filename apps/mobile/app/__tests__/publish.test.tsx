import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import PublishScreen from '../(tabs)/publish';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';

// Mock Alert
const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock useRouter
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useLocalSearchParams: () => ({ id: 'toy-123' }),
}));

describe('PublishScreen', () => {
  beforeEach(() => {
    // Set a mock user in useAuthStore
    useAuthStore.setState({
      user: { id: 'user-123', email: 'test@example.com' } as any,
    });
    mockReplace.mockClear();
    alertSpy.mockClear();
    jest.clearAllMocks();
  });

  it('renders form fields and initial UI state', () => {
    render(<PublishScreen />);
    
    expect(screen.UNSAFE_getByProps({ placeholder: 'What is it?' })).toBeTruthy();
    expect(screen.UNSAFE_getByProps({ placeholder: 'Describe your toy (condition, special features, etc.)' })).toBeTruthy();
    expect(screen.getByText('Photos (Max 3)')).toBeTruthy();
    expect(screen.getByText('Publish Toy')).toBeTruthy();
  });

  it('shows validation error when publishing without inputs', async () => {
    render(<PublishScreen />);
    
    const publishBtn = screen.getByText('Publish Toy');
    fireEvent.press(publishBtn);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Please fill all fields and add at least one image.'
    );
  });

  it('publishes toy successfully when fields are filled and image is selected', async () => {
    // Mock image picker selection
    jest.spyOn(ImagePicker, 'launchImageLibraryAsync').mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file://path/to/my-awesome-toy.jpg' }],
    } as any);

    // Mock profiles select query
    const mockProfileData = { latitude: 39.9042, longitude: 116.4074 };
    const mockToyData = { id: 'toy-999', title: 'Plush Bear' };

    // Setup Supabase chain mocks
    const fromSpy = jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockProfileData, error: null }),
        } as any;
      }
      if (table === 'toys') {
        return {
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockToyData, error: null }),
            }),
          }),
        } as any;
      }
      if (table === 'toy_images') {
        return {
          insert: jest.fn().mockResolvedValue({ data: [], error: null }),
        } as any;
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      } as any;
    });

    render(<PublishScreen />);
    
    // Select image
    const addPhotoBtn = screen.getByText('+');
    fireEvent.press(addPhotoBtn);

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });

    // Fill inputs
    fireEvent.changeText(screen.UNSAFE_getByProps({ placeholder: 'What is it?' }), 'Plush Bear');
    fireEvent.changeText(
      screen.UNSAFE_getByProps({ placeholder: 'Describe your toy (condition, special features, etc.)' }),
      'Very clean and cute plush teddy bear.'
    );

    // Submit form
    const publishBtn = screen.getByText('Publish Toy');
    fireEvent.press(publishBtn);

    await waitFor(() => {
      expect(fromSpy).toHaveBeenCalledWith('profiles');
      expect(fromSpy).toHaveBeenCalledWith('toys');
      expect(fromSpy).toHaveBeenCalledWith('toy_images');
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Toy published successfully!');
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });
});
