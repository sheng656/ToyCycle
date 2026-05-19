import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input component', () => {
  it('renders input with label and placeholder', () => {
    const { getByText, UNSAFE_getByProps } = render(
      <Input label="Email Address" placeholder="Enter your email" />
    );
    expect(getByText('Email Address')).toBeTruthy();
    expect(UNSAFE_getByProps({ placeholder: 'Enter your email' })).toBeTruthy();
  });

  it('renders error message when error prop is provided', () => {
    const { getByText } = render(
      <Input label="Email" error="Invalid email address" />
    );
    expect(getByText('Invalid email address')).toBeTruthy();
  });

  it('triggers onChangeText when user types', () => {
    const onChangeTextMock = jest.fn();
    const { UNSAFE_getByProps } = render(
      <Input placeholder="Type here" onChangeText={onChangeTextMock} />
    );
    
    fireEvent.changeText(UNSAFE_getByProps({ placeholder: 'Type here' }), 'hello');
    expect(onChangeTextMock).toHaveBeenCalledWith('hello');
  });

  it('handles focus and blur events', () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();
    const { UNSAFE_getByProps } = render(
      <Input placeholder="Type here" onFocus={onFocusMock} onBlur={onBlurMock} />
    );
    
    const input = UNSAFE_getByProps({ placeholder: 'Type here' });
    fireEvent(input, 'focus');
    expect(onFocusMock).toHaveBeenCalled();
    
    fireEvent(input, 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });
});
