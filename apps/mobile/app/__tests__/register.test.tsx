import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react-native';
import RegisterScreen from '../(auth)/register';
import { supabase } from '../../lib/supabase';

// Mock expo-router
const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
  }),
}));

describe('RegisterScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockBack.mockClear();
    jest.clearAllMocks();
  });

  it('renders initial UI elements', () => {
    render(<RegisterScreen />);

    expect(screen.getByText('Create Account')).toBeTruthy();
    expect(screen.getByText('Join ToyCycle community')).toBeTruthy();
    expect(screen.getByText('Full Name')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Password')).toBeTruthy();
    expect(screen.getByText('Sign Up')).toBeTruthy();
    expect(screen.getByText('Already have an account? Sign In')).toBeTruthy();
  });

  it('allows typing in all form fields', () => {
    render(<RegisterScreen />);

    const nameInput = screen.UNSAFE_getByProps({ autoCapitalize: 'words' });
    const emailInput = screen.UNSAFE_getByProps({ keyboardType: 'email-address' });
    const passwordInput = screen.UNSAFE_getByProps({ secureTextEntry: true });

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(passwordInput, 'securepassword');

    expect(nameInput.props.value).toBe('John Doe');
    expect(emailInput.props.value).toBe('john@example.com');
    expect(passwordInput.props.value).toBe('securepassword');
  });

  it('shows error message when sign up fails', async () => {
    jest.spyOn(supabase.auth, 'signUp').mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Email already registered' } as any,
    });

    render(<RegisterScreen />);

    fireEvent.changeText(
      screen.UNSAFE_getByProps({ autoCapitalize: 'words' }),
      'Jane Doe'
    );
    fireEvent.changeText(
      screen.UNSAFE_getByProps({ keyboardType: 'email-address' }),
      'existing@example.com'
    );
    fireEvent.changeText(
      screen.UNSAFE_getByProps({ secureTextEntry: true }),
      'password'
    );

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeTruthy();
    });
  });

  it('calls supabase.auth.signUp with correct payload', async () => {
    const signUpSpy = jest.spyOn(supabase.auth, 'signUp').mockResolvedValueOnce({
      data: { user: null, session: null },
      error: null,
    } as any);

    render(<RegisterScreen />);

    fireEvent.changeText(
      screen.UNSAFE_getByProps({ autoCapitalize: 'words' }),
      'Jane Doe'
    );
    fireEvent.changeText(
      screen.UNSAFE_getByProps({ keyboardType: 'email-address' }),
      'jane@example.com'
    );
    fireEvent.changeText(
      screen.UNSAFE_getByProps({ secureTextEntry: true }),
      'mypassword'
    );

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(signUpSpy).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'mypassword',
        options: {
          data: { full_name: 'Jane Doe' },
        },
      });
    });
  });

  it('redirects to login screen on successful sign up', async () => {
    jest.spyOn(supabase.auth, 'signUp').mockResolvedValueOnce({
      data: { user: null, session: null },
      error: null,
    } as any);

    render(<RegisterScreen />);

    fireEvent.changeText(
      screen.UNSAFE_getByProps({ autoCapitalize: 'words' }),
      'Jane Doe'
    );
    fireEvent.changeText(
      screen.UNSAFE_getByProps({ keyboardType: 'email-address' }),
      'jane@example.com'
    );
    fireEvent.changeText(
      screen.UNSAFE_getByProps({ secureTextEntry: true }),
      'mypassword'
    );

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
    });
  });

  it('shows loading state while registration is in progress', async () => {
    jest.spyOn(supabase.auth, 'signUp').mockReturnValueOnce(
      new Promise(() => {})
    );

    render(<RegisterScreen />);

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeTruthy();
    });
  });

  it('navigates back when "Already have an account?" is pressed', () => {
    render(<RegisterScreen />);

    fireEvent.press(screen.getByText('Already have an account? Sign In'));

    expect(mockBack).toHaveBeenCalled();
  });
});
