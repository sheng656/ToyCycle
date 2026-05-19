import { act } from 'react';
import { useAuthStore } from '../useAuthStore';
import { supabase } from '../../lib/supabase';

// Mock session and user
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
} as any;

const mockSession = {
  access_token: 'token-123',
  user: mockUser,
} as any;

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    act(() => {
      useAuthStore.setState({
        session: null,
        user: null,
        initialized: false,
      });
    });
    jest.clearAllMocks();
  });

  it('starts with default initial state', () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.initialized).toBe(false);
  });

  it('sets session and user correctly via setSession', () => {
    act(() => {
      useAuthStore.getState().setSession(mockSession);
    });

    const state = useAuthStore.getState();
    expect(state.session).toEqual(mockSession);
    expect(state.user).toEqual(mockUser);
  });

  it('clears session and user correctly via setSession(null)', () => {
    // Populate session first
    act(() => {
      useAuthStore.getState().setSession(mockSession);
    });

    // Clear session
    act(() => {
      useAuthStore.getState().setSession(null);
    });

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
  });

  it('signs out and updates state appropriately', async () => {
    // Populate first
    act(() => {
      useAuthStore.setState({
        session: mockSession,
        user: mockUser,
      });
    });

    await act(async () => {
      await useAuthStore.getState().signOut();
    });

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it('initializes session and sets up auth state listener', async () => {
    // Mock getSession return
    const getSessionSpy = jest.spyOn(supabase.auth, 'getSession').mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    } as any);

    await act(async () => {
      await useAuthStore.getState().initialize();
    });

    const state = useAuthStore.getState();
    expect(getSessionSpy).toHaveBeenCalledTimes(1);
    expect(state.initialized).toBe(true);
    expect(state.session).toEqual(mockSession);
    expect(state.user).toEqual(mockUser);
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledTimes(1);
  });
});
