// Mock expo bundle URL detection to prevent native module invocation in Jest
jest.mock('expo/src/utils/getBundleUrl.native', () => ({
  getBundleUrl: () => 'http://localhost:8081/',
}));

// Mock NativeModules for both react-native and jest-expo
jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => {
  const NativeModules = require('react-native/jest/mocks/NativeModules').default;

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

  return NativeModules;
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});



// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  class MockMapView extends React.Component {
    render() {
      return React.createElement('MapView', this.props, this.props.children);
    }
  }
  class MockMarker extends React.Component {
    render() {
      return React.createElement('Marker', this.props, this.props.children);
    }
  }
  class MockCallout extends React.Component {
    render() {
      return React.createElement('Callout', this.props, this.props.children);
    }
  }
  class MockUrlTile extends React.Component {
    render() {
      return React.createElement('UrlTile', this.props, this.props.children);
    }
  }
  MockMapView.Marker = MockMarker;
  MockMapView.Callout = MockCallout;
  MockMapView.UrlTile = MockUrlTile;
  return MockMapView;
});

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: 39.9042,
      longitude: 116.4074,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  })),
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true })),
  MediaTypeOptions: { Images: 'Images' },
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'mock-expo-push-token' })),
  AndroidImportance: { MAX: 4 },
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'mock-project-id',
      },
    },
  },
  easConfig: {
    projectId: 'mock-project-id',
  },
}));

// Mock expo-device
jest.mock('expo-device', () => ({
  isDevice: true,
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockSingle = jest.fn(() => Promise.resolve({ data: null, error: null }));
  
  const mockEq = jest.fn(() => ({
    single: mockSingle,
    order: jest.fn(() => Promise.resolve({ data: [], error: null })),
  }));

  const mockSelect = jest.fn(() => ({
    eq: mockEq,
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: mockSingle,
      })),
    })),
    or: jest.fn(() => ({
      order: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    not: jest.fn(() => ({
      not: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  }));

  const mockFrom = jest.fn(() => ({
    select: mockSelect,
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: mockSingle,
      })),
    })),
    upsert: jest.fn(() => Promise.resolve({ error: null })),
    update: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ error: null })),
    })),
  }));

  const mockAuth = {
    getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    onAuthStateChange: jest.fn(() => {
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    }),
    signOut: jest.fn(() => Promise.resolve()),
    // Auth methods required by LoginScreen and RegisterScreen tests
    signInWithPassword: jest.fn(() =>
      Promise.resolve({ data: { user: null, session: null }, error: null })
    ),
    signUp: jest.fn(() =>
      Promise.resolve({ data: { user: null, session: null }, error: null })
    ),
  };

  const mockStorage = {
    from: jest.fn(() => ({
      upload: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://mockurl.com/image.jpg' } })),
    })),
  };

  return {
    createClient: jest.fn(() => ({
      from: mockFrom,
      auth: mockAuth,
      storage: mockStorage,
      channel: jest.fn(() => ({
        on: jest.fn(() => ({
          subscribe: jest.fn(),
        })),
      })),
      removeChannel: jest.fn(),
    })),
  };
});
