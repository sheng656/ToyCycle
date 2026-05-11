import React from 'react';
import { StyleSheet, View, Platform, ActivityIndicator } from 'react-native';
import MapView, { UrlTile, Marker, Callout, Region } from 'react-native-maps';
import { getTileUrl } from '../../lib/map-provider';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';

interface MapWrapperProps {
  initialRegion?: Region;
  showsUserLocation?: boolean;
  onRegionChangeComplete?: (region: Region) => void;
  children?: React.ReactNode;
}

export const MapWrapper = ({ 
  initialRegion, 
  showsUserLocation = true, 
  onRegionChangeComplete,
  children 
}: MapWrapperProps) => {
  const { i18n } = useTranslation();
  const tileUrl = getTileUrl(i18n.language);

  // Note: react-native-maps standard implementation relies on Apple Maps (iOS) and Google Maps (Android)
  // By using mapType="none" and UrlTile, we can replace the underlying map with AMap.
  
  if (!initialRegion) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={showsUserLocation}
        onRegionChangeComplete={onRegionChangeComplete}
        mapType={Platform.OS === 'android' ? 'none' : 'standard'} // iOS might need standard to avoid crash, Android needs none
      >
        <UrlTile
          urlTemplate={tileUrl}
          maximumZ={19}
          flipY={false}
        />
        {children}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
