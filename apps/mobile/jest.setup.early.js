// Define dev global to prevent ReferenceError from React Native core modules
global.__DEV__ = true;

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


