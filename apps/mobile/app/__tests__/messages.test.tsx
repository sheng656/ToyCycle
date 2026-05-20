import React from 'react';
import { fireEvent, render, waitFor, screen, act } from '@testing-library/react-native';
import MessagesScreen from '../(tabs)/messages';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUser = { id: 'user-abc', email: 'me@example.com' };

const mockRequests = [
  {
    id: 'req-1',
    status: 'pending',
    credits_amount: 20,
    requester_id: 'user-other',
    owner_id: 'user-abc',
    toy: { title: 'LEGO Castle', images: [{ image_url: 'https://example.com/lego.jpg' }] },
    requester: { display_name: 'Alice', avatar_url: null },
    owner: { display_name: 'Me', avatar_url: null },
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'req-2',
    status: 'accepted',
    credits_amount: 10,
    requester_id: 'user-abc',
    owner_id: 'user-other-2',
    toy: { title: 'Toy Car', images: [] },
    requester: { display_name: 'Me', avatar_url: null },
    owner: { display_name: 'Bob', avatar_url: null },
    updated_at: '2026-01-02T00:00:00Z',
  },
];

describe('MessagesScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    jest.clearAllMocks();
    useAuthStore.setState({ user: mockUser as any });
  });

  it('renders the messages screen title', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    } as any);

    render(<MessagesScreen />);
    // i18n mock returns key as-is
    expect(screen.getByText('tabs.messages')).toBeTruthy();
  });

  it('shows empty state when there are no exchange requests', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    } as any);

    render(<MessagesScreen />);

    await waitFor(() => {
      expect(screen.getByText('No exchange requests yet.')).toBeTruthy();
    });
  });

  it('renders exchange request list items correctly', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockRequests, error: null }),
    } as any);

    render(<MessagesScreen />);

    await waitFor(() => {
      // First request: current user is the owner, other party is Alice (requester)
      expect(screen.getByText('Alice')).toBeTruthy();
      expect(screen.getByText(/Requested your:/)).toBeTruthy();
      expect(screen.getByText(/LEGO Castle/)).toBeTruthy();
      // Status chip
      expect(screen.getByText('pending')).toBeTruthy();
    });
  });

  it('renders the correct status chips for accepted and pending statuses', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockRequests, error: null }),
    } as any);

    render(<MessagesScreen />);

    await waitFor(() => {
      expect(screen.getByText('pending')).toBeTruthy();
      expect(screen.getByText('accepted')).toBeTruthy();
    });
  });

  it('navigates to chat screen when a request item is pressed', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockRequests, error: null }),
    } as any);

    render(<MessagesScreen />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Alice'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/messages/[id]',
      params: { id: 'req-1' },
    });
  });

  it('does not fetch requests when user is not logged in', () => {
    useAuthStore.setState({ user: null });

    const fromSpy = jest.spyOn(supabase, 'from');

    render(<MessagesScreen />);

    // fetchRequests guard clause: if (!user) return
    expect(fromSpy).not.toHaveBeenCalled();
  });

  it('shows "You requested" text for requests initiated by the current user', async () => {
    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [mockRequests[1]], error: null }),
    } as any);

    render(<MessagesScreen />);

    await waitFor(() => {
      // Current user is the requester for req-2
      expect(screen.getByText('Bob')).toBeTruthy();
      expect(screen.getByText(/You requested:/)).toBeTruthy();
    });
  });
});
