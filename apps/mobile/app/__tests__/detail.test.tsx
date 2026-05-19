import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react-native';
import { Alert, ActivityIndicator } from 'react-native';
import ToyDetailScreen from '../toys/[id]';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

// Mock Alert
const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock useRouter
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
  useLocalSearchParams: () => ({ id: 'toy-123' }),
}));

// Mock mock toy data
const mockToy = {
  id: 'toy-123',
  title: 'Awesome Lego Set',
  description: 'Complete set with instruction manual.',
  category: 'blocks',
  condition: 'like_new',
  age_range: '6-12',
  estimated_value: 15,
  status: 'available',
  owner_id: 'user-owner',
  owner: {
    id: 'user-owner',
    display_name: 'John Doe',
    avatar_url: 'https://avatar.com/john.jpg',
  },
  images: [
    { image_url: 'https://images.com/lego.jpg' }
  ]
};

describe('ToyDetailScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    alertSpy.mockClear();
    jest.clearAllMocks();
  });

  it('renders loading spinner initially', () => {
    // Keep loading true by not resolving fetchToyDetails immediately
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnValue(new Promise(() => {})), // never resolves
    } as any);

    const { UNSAFE_getByType } = render(<ToyDetailScreen />);
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders toy details correctly after fetching data', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockToy, error: null }),
    } as any);

    render(<ToyDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('Awesome Lego Set')).toBeTruthy();
      expect(screen.getByText('Complete set with instruction manual.')).toBeTruthy();
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('Estimated value: 15 Credits')).toBeTruthy();
    });
  });

  it('renders fallback screen if toy is not found', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: new Error('Not Found') }),
    } as any);

    render(<ToyDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('Toy not found.')).toBeTruthy();
      expect(screen.getByText('Go Back')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Go Back'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('prevents exchange requests if user is not signed in', async () => {
    useAuthStore.setState({ user: null });

    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockToy, error: null }),
    } as any);

    render(<ToyDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('Request Exchange')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Request Exchange'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Authentication required',
      'Please sign in to request an exchange.'
    );
  });

  it('prevents exchange requests if user is the toy owner', async () => {
    // Logged in as owner
    useAuthStore.setState({
      user: { id: 'user-owner', email: 'owner@example.com' } as any,
    });

    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockToy, error: null }),
    } as any);

    render(<ToyDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('Request Exchange')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Request Exchange'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Invalid action',
      'You cannot exchange your own toy.'
    );
  });

  it('submits exchange request successfully for non-owner users', async () => {
    // Logged in as requester
    useAuthStore.setState({
      user: { id: 'user-requester', email: 'requester@example.com' } as any,
    });

    const mockInsert = jest.fn().mockResolvedValue({ error: null });

    jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'toys') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockToy, error: null }),
        } as any;
      }
      if (table === 'exchange_requests') {
        return {
          insert: mockInsert,
        } as any;
      }
      return {} as any;
    });

    render(<ToyDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('Request Exchange')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Request Exchange'));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        requester_id: 'user-requester',
        toy_id: 'toy-123',
        owner_id: 'user-owner',
        status: 'pending',
        credits_amount: 15,
      });
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Exchange request sent successfully!');
      expect(mockBack).toHaveBeenCalled();
    });
  });
});
