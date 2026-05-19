import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { Chip } from '../Chip';

describe('Chip component', () => {
  it('renders chip with correct label', () => {
    const { getByText } = render(<Chip label="Active" />);
    expect(getByText('Active')).toBeTruthy();
  });

  it('applies custom background color', () => {
    const customColor = '#ff5500';
    const { getByTestId } = render(<Chip label="Special" color={customColor} testID="chip" />);
    const chipContainer = getByTestId('chip');
    
    const flatStyle = StyleSheet.flatten(chipContainer.props.style);
    expect(flatStyle.backgroundColor).toBe(customColor);
  });
});
