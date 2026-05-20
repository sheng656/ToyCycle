import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react-native';
import LoginScreen from '../(auth)/login';
import { supabase } from '../../lib/supabase';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    jest.clearAllMocks();
  });

  it('renders initial UI elements', () => {
    render(<LoginScreen />);

    // Title and subtitle
    expect(screen.getByText('common.welcome')).toBeTruthy(); // i18n key returned as-is by mock
    expect(screen.getByText('Sign in to continue')).toBeTruthy();

    // Inputs and buttons
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Password')).toBeTruthy();
    expect(screen.getByText('Sign In')).toBeTruthy();
    expect(screen.getByText('Create an Account')).toBeTruthy();
  });

  it('allows typing in email and password fields', () => {
    render(<LoginScreen />);

    const emailInput = screen.UNSAFE_getByProps({ keyboardType: 'email-address' });
    const passwordInput = screen.UNSAFE_getByProps({ secureTextEntry: true });

    fireEvent.changeText(emailInput, 'user@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('user@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('shows error message when sign in fails', async () => {
    // Mock Supabase auth to return an error
    jest.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' } as any,
    });

    render(<LoginScreen />);

    const emailInput = screen.UNSAFE_getByProps({ keyboardType: 'email-address' });
    const passwordInput = screen.UNSAFE_getByProps({ secureTextEntry: true });

    fireEvent.changeText(emailInput, 'wrong@example.com');
    fireEvent.changeText(passwordInput, 'wrongpass');

    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      // Error propagates to the password Input's error prop
      expect(screen.getByText('Invalid login credentials')).toBeTruthy();
    });
  });

  it('shows loading state while sign-in is in progress', async () => {
    // Return a never-resolving promise to keep loading state active
    jest.spyOn(supabase.auth, 'signInWithPassword').mockReturnValueOnce(
      new Promise(() => {})
    );

    render(<LoginScreen />);

    const emailInput = screen.UNSAFE_getByProps({ keyboardType: 'email-address' });
    fireEvent.changeText(emailInput, 'user@example.com');
    fireEvent.press(screen.getByText('Sign In'));

    // During loading, the button title changes
    await waitFor(() => {
      expect(screen.getByText('common.loading')).toBeTruthy();
    });
  });

  it('calls supabase.auth.signInWithPassword with correct credentials on submit', async () => {
    const signInSpy = jest.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({
      data: { user: null, session: null },
      error: null,
    } as any);

    render(<LoginScreen />);

    fireEvent.changeText(
      screen.UNSAFE_getByProps({ keyboardType: 'email-address' }),
      'test@example.com'
    );
    fireEvent.changeText(
      screen.UNSAFE_getByProps({ secureTextEntry: true }),
      'secret123'
    );

    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(signInSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'secret123',
      });
    });
  });

  it('navigates to register screen when Create an Account is pressed', () => {
    render(<LoginScreen />);

    fireEvent.press(screen.getByText('Create an Account'));

    expect(mockPush).toHaveBeenCalledWith('/(auth)/register');
  });
});
