import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { BorderRadius, Spacing } from '../../constants/Spacing';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ title, variant = 'primary', style, ...props }: ButtonProps) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return Colors.light.primary;
      case 'secondary': return Colors.light.secondary;
      case 'ghost': return 'transparent';
      default: return Colors.light.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return Colors.light.onPrimary;
      case 'secondary': return Colors.light.primary; // Fallback since onSecondary doesn't exist
      case 'ghost': return Colors.light.primary;
      default: return Colors.light.onPrimary;
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          { backgroundColor: getBackgroundColor() }
        ]}
        {...props}
      >
        <Text style={[styles.text, { color: getTextColor() }]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    ...Typography.labelMd,
    fontSize: 16, // Override for better readability
  },
});
