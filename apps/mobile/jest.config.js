const jestExpoPreset = require('jest-expo/jest-preset');

module.exports = {
  haste: jestExpoPreset.haste,
  resolver: jestExpoPreset.resolver,
  transform: jestExpoPreset.transform,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFiles: [
    require.resolve('./jest.setup.early.js'),
    ...jestExpoPreset.setupFiles,
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', './jest.setup.js'],
  testEnvironment: jestExpoPreset.testEnvironment,
  moduleNameMapper: {
    ...jestExpoPreset.moduleNameMapper,
    '^react$': '<rootDir>/../../node_modules/react',
    '^react-test-renderer$': '<rootDir>/../../node_modules/react-test-renderer',
    '^react-native$': '<rootDir>/../../node_modules/react-native',
    '^react-native/(.*)$': '<rootDir>/../../node_modules/react-native/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'store/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js',
  ],
};
