import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { BorderRadius, Spacing } from '../../constants/Spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={Colors.light.onSurfaceVariant}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.labelMd,
    color: Colors.light.onSurface,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 48,
    ...Typography.bodyMd,
    color: Colors.light.onSurface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: Colors.light.outline,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  errorText: {
    ...Typography.bodyMd,
    fontSize: 12,
    color: Colors.light.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});
