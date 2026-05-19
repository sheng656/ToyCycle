import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button component', () => {
  it('renders button with correct title', () => {
    const { getByText } = render(<Button title="Click me" />);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('triggers onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Click me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders primary variant by default', () => {
    const { getByText } = render(<Button title="Primary" />);
    const textElement = getByText('Primary');
    
    // Default variant is primary, check text color style
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({ color: expect.any(String) })
    );
  });
});
