import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import DiscoveryScreen from '../(tabs)/index';
import { supabase } from '../../lib/supabase';
import * as Location from 'expo-location';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const mockToys = [
  {
    id: 'toy-1',
    title: 'LEGO Set',
    description: 'Fun LEGO',
    condition: 'like_new',
    category: 'blocks',
    latitude: 39.91,
    longitude: 116.41,
    images: [{ image_url: 'https://example.com/lego.jpg' }],
  },
  {
    id: 'toy-2',
    title: 'Toy Car',
    description: 'Red car',
    condition: 'good',
    category: 'vehicles',
    latitude: 39.92,
    longitude: 116.42,
    images: [],
  },
];

/**
 * Build a Supabase 'from' spy that correctly handles the double .not().not() chain
 * used by DiscoveryScreen's fetchToys:
 *   .select('*, images:toy_images(*)')
 *   .eq('status', 'available')
 *   .not('latitude', 'is', null)
 *   .not('longitude', 'is', null)   <-- second .not() called on result of first .not()
 */
function buildToysFromMock(data: any[] = []) {
  const secondNotChain = jest.fn().mockResolvedValue({ data, error: null });
  const firstNotChain = jest.fn().mockReturnValue({ not: secondNotChain });
  const mockChain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    not: firstNotChain,
  };
  return jest.spyOn(supabase, 'from').mockReturnValue(mockChain as any);
}

/** Grant location permission by default for tests that don't care about it. */
function grantLocation() {
  jest.spyOn(Location, 'requestForegroundPermissionsAsync').mockResolvedValueOnce({
    status: 'granted',
    expires: 'never',
    granted: true,
    canAskAgain: true,
  } as any);
}

describe('DiscoveryScreen (Map Tab)', () => {
  beforeEach(() => {
    mockPush.mockClear();
    alertSpy.mockClear();
    jest.clearAllMocks();
  });

  it('renders map title from i18n key', async () => {
    grantLocation();
    buildToysFromMock();

    render(<DiscoveryScreen />);

    // i18n mock returns key as string: 'tabs.explore'
    await waitFor(() => {
      expect(screen.getByText('tabs.explore')).toBeTruthy();
    });
  });

  it('requests foreground location permission on mount', async () => {
    const permSpy = jest.spyOn(Location, 'requestForegroundPermissionsAsync').mockResolvedValueOnce({
      status: 'granted',
      expires: 'never',
      granted: true,
      canAskAgain: true,
    } as any);

    buildToysFromMock();
    render(<DiscoveryScreen />);

    await waitFor(() => {
      expect(permSpy).toHaveBeenCalled();
    });
  });

  it('falls back to default Beijing region and shows alert when location permission is denied', async () => {
    jest.spyOn(Location, 'requestForegroundPermissionsAsync').mockResolvedValueOnce({
      status: 'denied',
      expires: 'never',
      granted: false,
      canAskAgain: false,
    } as any);

    buildToysFromMock();
    render(<DiscoveryScreen />);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Permission to access location was denied');
    });
  });

  it('fetches available toys from Supabase on mount', async () => {
    grantLocation();
    const fromSpy = buildToysFromMock(mockToys);

    render(<DiscoveryScreen />);

    await waitFor(() => {
      expect(fromSpy).toHaveBeenCalledWith('toys');
    });
  });

  it('renders map markers for fetched toys', async () => {
    grantLocation();
    buildToysFromMock(mockToys);

    render(<DiscoveryScreen />);

    // Marker label texts are rendered as Text inside MapView children.
    // The react-native-maps mock in jest.setup.js renders children via MockMapView.
    await waitFor(() => {
      // LEGO Set is 8 chars — renders as-is in the marker bubble
      expect(screen.getAllByText('LEGO Set').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Toy Car').length).toBeGreaterThan(0);
    });
  });
});
