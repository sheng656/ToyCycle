// Define dev global to prevent ReferenceError from React Native core modules
global.__DEV__ = true;

// Mock react-native-worklets before reanimated loads to prevent NativeWorklets
// initialization crash (WorkletsError: Native part of Worklets doesn't seem to be initialized).
jest.mock('react-native-worklets', () => ({
  makeShareableCloneRecursive: jest.fn((v) => v),
  makeShareable: jest.fn((v) => v),
  runOnUI: jest.fn((fn) => fn),
  runOnJS: jest.fn((fn) => fn),
  useSharedValue: jest.fn((init) => ({ value: init })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((val) => val),
  withSpring: jest.fn((val) => val),
  useWorkletCallback: jest.fn((fn) => fn),
  createWorklet: jest.fn((fn) => fn),
}));



// Define minimal BatchedBridge config on global to prevent React Native NativeModules from throwing during early setup loading
global.__fbBatchedBridgeConfig = {
  remoteModuleConfig: [],
};

jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => {
  const NativeModules = jest.requireActual('react-native/jest/mocks/NativeModules').default;

  if (!NativeModules.UIManager) {
    NativeModules.UIManager = {};
  }

  NativeModules.UIManager.getConstants = jest.fn(() => ({}));
  NativeModules.UIManager.getViewManagerConfig = jest.fn(() => ({ Constants: {} }));
  NativeModules.UIManager.hasViewManagerConfig = jest.fn(() => false);
  NativeModules.UIManager.blur = jest.fn();
  NativeModules.UIManager.focus = jest.fn();
  NativeModules.UIManager.measure = jest.fn();


  if (!NativeModules.NativeUnimoduleProxy) {
    NativeModules.NativeUnimoduleProxy = {
      viewManagersMetadata: {},
    };
  }

  NativeModules.SourceCode = {
    scriptURL: 'http://localhost:8081/index.bundle',
    getConstants() {
      return {
        scriptURL: 'http://localhost:8081/index.bundle',
      };
    },
  };

  return {
    __esModule: true,
    default: NativeModules,
  };
});


