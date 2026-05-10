import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Spacing } from '../../constants/Spacing';
import { Shadows } from '../../constants/Shadows';

interface CardProps extends ViewProps {
  elevation?: 'level1' | 'level2' | 'none';
}

export const Card = ({ children, style, elevation = 'level1', ...props }: CardProps) => {
  const shadowStyle = elevation !== 'none' ? Shadows[elevation] : {};

  return (
    <View
      style={[
        styles.card,
        shadowStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)', // Very light gray border as requested
  },
});
