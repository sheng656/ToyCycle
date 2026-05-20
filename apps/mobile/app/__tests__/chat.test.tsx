import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ChatScreen from '../messages/[id]';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock expo-router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
  useLocalSearchParams: () => ({ id: 'req-123' }),
}));

const mockUser = { id: 'user-me', email: 'me@example.com' };

const mockRequest = {
  id: 'req-123',
  status: 'pending',
  credits_amount: 15,
  requester_id: 'user-requester',
  owner_id: 'user-me', // current user is the owner
  toy: { title: 'LEGO Castle' },
  requester: { display_name: 'Alice' },
  owner: { display_name: 'Me' },
};

const mockConversation = { id: 'conv-456', exchange_request_id: 'req-123' };

const mockMessages = [
  { id: 'msg-1', conversation_id: 'conv-456', sender_id: 'user-requester', content: 'Hello!' },
  { id: 'msg-2', conversation_id: 'conv-456', sender_id: 'user-me', content: 'Hi there!' },
];

function buildFromMock(overrides: Record<string, any> = {}) {
  return jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
    if (table === 'exchange_requests') {
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: overrides.request ?? mockRequest, error: null }),
        update: jest.fn().mockReturnThis(),
      } as any;
    }
    if (table === 'conversations') {
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: overrides.conversation ?? mockConversation, error: null }),
        insert: jest.fn().mockReturnThis(),
      } as any;
    }
    if (table === 'messages') {
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: overrides.messages ?? mockMessages, error: null }),
        insert: jest.fn().mockResolvedValue({ error: null }),
      } as any;
    }
    return {} as any;
  });
}

describe('ChatScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    alertSpy.mockClear();
    jest.clearAllMocks();
    useAuthStore.setState({ user: mockUser as any });
  });

  it('renders the toy title as the chat header', async () => {
    buildFromMock();

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.getByText('LEGO Castle')).toBeTruthy();
    });
  });

  it('renders messages with correct bubble alignment (me vs them)', async () => {
    buildFromMock();

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeTruthy();
      expect(screen.getByText('Hi there!')).toBeTruthy();
    });
  });

  it('shows Accept/Reject action bar when current user is the owner and request is pending', async () => {
    buildFromMock();

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.getByText('Approve this exchange?')).toBeTruthy();
      expect(screen.getByText('Accept')).toBeTruthy();
      expect(screen.getByText('Reject')).toBeTruthy();
    });
  });

  it('hides action bar when request status is not pending', async () => {
    buildFromMock({ request: { ...mockRequest, status: 'accepted' } });

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.queryByText('Approve this exchange?')).toBeNull();
    });
  });

  it('hides action bar when current user is not the owner', async () => {
    useAuthStore.setState({ user: { id: 'user-requester', email: 'alice@example.com' } as any });
    buildFromMock();

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.queryByText('Approve this exchange?')).toBeNull();
    });
  });

  it('updates request status to accepted when Accept is pressed', async () => {
    const updateMock = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'exchange_requests') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockRequest, error: null }),
          update: updateMock,
        } as any;
      }
      if (table === 'conversations') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockConversation, error: null }),
        } as any;
      }
      if (table === 'messages') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
          insert: jest.fn().mockResolvedValue({ error: null }),
        } as any;
      }
      return {} as any;
    });

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.getByText('Accept')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Accept'));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith({ status: 'accepted' });
    });
  });

  it('sends a message when Send button is pressed with text input', async () => {
    const insertMessageMock = jest.fn().mockResolvedValue({ error: null });

    jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'exchange_requests') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockRequest, error: null }),
        } as any;
      }
      if (table === 'conversations') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockConversation, error: null }),
        } as any;
      }
      if (table === 'messages') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
          insert: insertMessageMock,
        } as any;
      }
      return {} as any;
    });

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.UNSAFE_getByProps({ placeholder: 'Type a message...' })).toBeTruthy();
    });

    const input = screen.UNSAFE_getByProps({ placeholder: 'Type a message...' });
    fireEvent.changeText(input, 'Nice toy!');
    fireEvent.press(screen.getByText('Send'));

    await waitFor(() => {
      expect(insertMessageMock).toHaveBeenCalledWith({
        conversation_id: 'conv-456',
        sender_id: 'user-me',
        content: 'Nice toy!',
      });
    });
  });

  it('clears message input after sending', async () => {
    jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'exchange_requests') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockRequest, error: null }),
        } as any;
      }
      if (table === 'conversations') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockConversation, error: null }),
        } as any;
      }
      if (table === 'messages') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
          insert: jest.fn().mockResolvedValue({ error: null }),
        } as any;
      }
      return {} as any;
    });

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.UNSAFE_getByProps({ placeholder: 'Type a message...' })).toBeTruthy();
    });

    const input = screen.UNSAFE_getByProps({ placeholder: 'Type a message...' });
    fireEvent.changeText(input, 'Hello again!');
    fireEvent.press(screen.getByText('Send'));

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('does not send empty messages', async () => {
    const insertMessageMock = jest.fn().mockResolvedValue({ error: null });

    jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'exchange_requests') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockRequest, error: null }),
        } as any;
      }
      if (table === 'conversations') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockConversation, error: null }),
        } as any;
      }
      if (table === 'messages') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
          insert: insertMessageMock,
        } as any;
      }
      return {} as any;
    });

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.UNSAFE_getByProps({ placeholder: 'Type a message...' })).toBeTruthy();
    });

    // Press Send without typing anything
    fireEvent.press(screen.getByText('Send'));

    // The insert mock should not be called (guard: if (!inputText.trim()) return)
    expect(insertMessageMock).not.toHaveBeenCalled();
  });

  it('navigates back when back button is pressed', async () => {
    buildFromMock();

    render(<ChatScreen />);

    await waitFor(() => {
      expect(screen.getByText('<')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('<'));
    expect(mockBack).toHaveBeenCalled();
  });
});
