import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { BorderRadius, Spacing } from '../../constants/Spacing';

interface ChipProps extends ViewProps {
  label: string;
  color?: string;
}

export const Chip = ({ label, color = Colors.light.primary, style, ...props }: ChipProps) => {
  return (
    <View style={[styles.chip, { backgroundColor: color }, style]} {...props}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.labelMd,
    color: '#ffffff',
  },
});
