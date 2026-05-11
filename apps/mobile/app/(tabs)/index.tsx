import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Platform, Alert, Dimensions, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MapWrapper } from '../../components/map/MapWrapper';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';
import { Shadows } from '../../constants/Shadows';
import { Avatar } from '../../components/ui/Avatar';

// Define a Toy type loosely matching Supabase schema
interface Toy {
  id: string;
  title: string;
  description: string;
  condition: string;
  category: string;
  images: string[];
  location_lat: number;
  location_lng: number;
}

export default function DiscoveryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);

  const AUCKLAND_DEFAULT = {
    latitude: -36.8485,
    longitude: 174.7633,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        // Default to Auckland
        setLocation({
          coords: {
            latitude: AUCKLAND_DEFAULT.latitude,
            longitude: AUCKLAND_DEFAULT.longitude,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
      } else {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
      
      fetchToys();
    })();
  }, []);

  const fetchToys = async () => {
    try {
      const { data, error } = await supabase
        .from('toys')
        .select('*')
        .eq('status', 'available')
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null);

      if (error) {
        throw error;
      }

      if (data) {
        setToys(data as Toy[]);
      }
    } catch (error) {
      console.error('Error fetching toys:', error);
    } finally {
      setLoading(false);
    }
  };

  const initialRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : undefined;

  return (
    <View style={styles.container}>
      {/* Top Bar overlay */}
      <View style={[styles.topBar, Shadows.level1]}>
        <Text style={styles.title}>{t('tabs.explore')}</Text>
      </View>

      <MapWrapper initialRegion={initialRegion} showsUserLocation={true}>
        {toys.map((toy) => (
          <Marker
            key={toy.id}
            coordinate={{ latitude: toy.location_lat, longitude: toy.location_lng }}
          >
            {/* Custom Marker View */}
            <View style={styles.markerContainer}>
              <View style={styles.markerBubble}>
                <Text style={styles.markerText}>{toy.title.substring(0, 10)}</Text>
              </View>
              <View style={styles.markerArrow} />
            </View>

            {/* Callout on Press */}
            <Callout 
              tooltip 
              onPress={() => router.push({ pathname: '/toys/[id]', params: { id: toy.id } })} // Fixed Expo Router typing
            >
              <View style={styles.calloutContainer}>
                <Avatar 
                  size={60} 
                  url={toy.images && toy.images.length > 0 ? toy.images[0] : null} 
                  style={{ borderRadius: BorderRadius.md }}
                />
                <View style={styles.calloutInfo}>
                  <Text style={styles.calloutTitle} numberOfLines={1}>{toy.title}</Text>
                  <Text style={styles.calloutCategory}>{toy.category}</Text>
                  <Text style={styles.calloutCondition}>{toy.condition}</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    zIndex: 10,
    alignItems: 'center',
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.light.primary,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBubble: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    ...Shadows.level1,
  },
  markerText: {
    ...Typography.labelMd,
    color: Colors.light.onPrimary,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.light.primary,
    transform: [{ rotate: '180deg' }],
    marginTop: -1,
  },
  calloutContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    width: 200,
    ...Shadows.level2,
  },
  calloutInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
    justifyContent: 'space-between',
  },
  calloutTitle: {
    ...Typography.labelMd,
    fontSize: 14,
    color: Colors.light.onSurface,
  },
  calloutCategory: {
    ...Typography.bodyMd,
    fontSize: 12,
    color: Colors.light.secondary,
  },
  calloutCondition: {
    ...Typography.bodyMd,
    fontSize: 12,
    color: Colors.light.outline,
  },
});
