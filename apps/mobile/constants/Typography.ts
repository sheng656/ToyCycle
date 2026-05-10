import { Platform } from 'react-native';

export const Typography = {
  headlineXl: {
    fontFamily: Platform.select({ ios: 'Quicksand-Bold', android: 'Quicksand_700Bold' }),
    fontSize: 36,
    lineHeight: 43,
  },
  headlineLg: {
    fontFamily: Platform.select({ ios: 'Quicksand-Bold', android: 'Quicksand_700Bold' }),
    fontSize: 28,
    lineHeight: 36,
  },
  headlineMd: {
    fontFamily: Platform.select({ ios: 'Quicksand-SemiBold', android: 'Quicksand_600SemiBold' }),
    fontSize: 22,
    lineHeight: 31,
  },
  bodyLg: {
    fontFamily: Platform.select({ ios: 'NunitoSans-Regular', android: 'NunitoSans_400Regular' }),
    fontSize: 17,
    lineHeight: 27,
  },
  bodyMd: {
    fontFamily: Platform.select({ ios: 'NunitoSans-Regular', android: 'NunitoSans_400Regular' }),
    fontSize: 15,
    lineHeight: 24,
  },
  labelMd: {
    fontFamily: Platform.select({ ios: 'NunitoSans-Bold', android: 'NunitoSans_700Bold' }),
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
};
