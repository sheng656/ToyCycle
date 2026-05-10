import React from 'react';
import { Image, StyleSheet, ImageProps, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface AvatarProps extends Omit<ImageProps, 'source'> {
  url?: string | null;
  size?: number;
}

export const Avatar = ({ url, size = 48, style, ...props }: AvatarProps) => {
  const defaultAvatar = require('../../assets/images/favicon.png'); // Placeholder
  const source = url ? { uri: url } : defaultAvatar;

  return (
    <View style={[
      styles.container,
      { width: size, height: size, borderRadius: size / 2 },
      style
    ]}>
      <Image
        source={source}
        style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: Colors.light.primaryContainer,
    overflow: 'hidden',
    backgroundColor: Colors.light.surfaceContainerHigh,
  },
});
