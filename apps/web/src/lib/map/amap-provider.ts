/**
 * AMap (高德地图) Provider Implementation
 * 
 * Uses AMap JS API 2.0 with the following plugins:
 * - AMap.Geolocation: Browser/IP positioning
 * - AMap.Geocoder: Address <-> Coordinates conversion
 * - AMap.Driving: Driving route planning (for isochrone calculation)
 * - AMap.Walking: Walking route planning (for isochrone calculation)
 * - AMap.PlaceSearch: POI search
 * - AMap.Scale / AMap.ToolBar: Map controls
 */

import AMapLoader from '@amap/amap-jsapi-loader';
import type {
  MapProvider,
  Coordinates,
  Address,
  TravelMode,
  MapOptions,
} from './provider';

// Required AMap plugins for our use cases
const AMAP_PLUGINS = [
  'AMap.Geolocation',
  'AMap.Geocoder',
  'AMap.Driving',
  'AMap.Walking',
  'AMap.PlaceSearch',
  'AMap.Scale',
  'AMap.ToolBar',
];

export class AMapProvider implements MapProvider {
  private AMap: any = null;
  private map: any = null;
  private markers: Map<string, any> = new Map();
  private polygons: any[] = [];
  private markerIdCounter = 0;

  private async ensureLoaded(): Promise<any> {
    if (this.AMap) return this.AMap;

    // Security config must be set before loading
    if (typeof window !== 'undefined') {
      (window as any)._AMapSecurityConfig = {
        securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE || '',
      };
    }

    this.AMap = await AMapLoader.load({
      key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
      version: '2.0',
      plugins: AMAP_PLUGINS,
    });

    return this.AMap;
  }

  async initMap(container: HTMLElement, options: MapOptions): Promise<void> {
    const AMap = await this.ensureLoaded();

    this.map = new AMap.Map(container, {
      zoom: options.zoom,
      center: [options.center.lng, options.center.lat],
      viewMode: options.viewMode || '2D',
    });

    // Add basic controls
    this.map.addControl(new AMap.Scale());
    this.map.addControl(new AMap.ToolBar({ position: 'RB' }));
  }

  destroyMap(): void {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
    this.markers.clear();
    this.polygons = [];
  }

  async geocode(address: string): Promise<Coordinates | null> {
    const AMap = await this.ensureLoaded();

    return new Promise((resolve) => {
      const geocoder = new AMap.Geocoder();
      geocoder.getLocation(address, (status: string, result: any) => {
        if (status === 'complete' && result.geocodes?.length > 0) {
          const { lng, lat } = result.geocodes[0].location;
          resolve({ lng, lat });
        } else {
          resolve(null);
        }
      });
    });
  }

  async reverseGeocode(coords: Coordinates): Promise<Address | null> {
    const AMap = await this.ensureLoaded();

    return new Promise((resolve) => {
      const geocoder = new AMap.Geocoder();
      geocoder.getAddress(
        [coords.lng, coords.lat],
        (status: string, result: any) => {
          if (status === 'complete' && result.regeocode) {
            const { formattedAddress, addressComponent } = result.regeocode;
            resolve({
              formattedAddress,
              province: addressComponent?.province,
              city: addressComponent?.city,
              district: addressComponent?.district,
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async getCurrentLocation(): Promise<Coordinates> {
    const AMap = await this.ensureLoaded();

    return new Promise((resolve, reject) => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        needAddress: false,
        timeout: 10000,
      });

      geolocation.getCurrentPosition((status: string, result: any) => {
        if (status === 'complete') {
          const { lng, lat } = result.position;
          resolve({ lng, lat });
        } else {
          reject(new Error('Geolocation failed'));
        }
      });
    });
  }

  /**
   * Calculate an isochrone by sampling points in multiple directions
   * and checking travel times via AMap.Driving or AMap.Walking.
   * 
   * This is necessary because AMap doesn't have a native driving/walking
   * isochrone API (only AMap.ArrivalRange for public transit).
   */
  async calculateIsochrone(
    center: Coordinates,
    minutes: number,
    mode: TravelMode
  ): Promise<number[][]> {
    const AMap = await this.ensureLoaded();

    const DIRECTIONS = 12; // Sample in 12 directions (every 30°)
    const MAX_RADIUS_KM = mode === 'driving' ? 15 : 3; // max search radius
    const STEP_KM = mode === 'driving' ? 1.5 : 0.3;

    const samplePoints: Array<{ angle: number; coords: Coordinates }> = [];

    // Generate sample points at various distances in each direction
    for (let i = 0; i < DIRECTIONS; i++) {
      const angle = (360 / DIRECTIONS) * i;
      const radians = (angle * Math.PI) / 180;

      // Binary search: find the farthest reachable point within time limit
      let bestCoords = center;

      for (
        let dist = STEP_KM;
        dist <= MAX_RADIUS_KM;
        dist += STEP_KM
      ) {
        const targetLat =
          center.lat + (dist / 111) * Math.cos(radians);
        const targetLng =
          center.lng +
          (dist / (111 * Math.cos((center.lat * Math.PI) / 180))) *
            Math.sin(radians);

        const target = { lng: targetLng, lat: targetLat };

        const travelTime = await this.getTravelTime(
          AMap,
          center,
          target,
          mode
        );

        if (travelTime !== null && travelTime <= minutes * 60) {
          bestCoords = target;
        } else {
          break; // This direction has reached its limit
        }
      }

      samplePoints.push({ angle, coords: bestCoords });
    }

    // Convert to polygon path: [lng, lat] pairs
    const path = samplePoints.map((p) => [p.coords.lng, p.coords.lat]);

    // Close the polygon
    if (path.length > 0) {
      path.push(path[0]);
    }

    return path;
  }

  private async getTravelTime(
    AMap: any,
    origin: Coordinates,
    destination: Coordinates,
    mode: TravelMode
  ): Promise<number | null> {
    return new Promise((resolve) => {
      const planner =
        mode === 'driving'
          ? new AMap.Driving({ policy: 0 }) // fastest route
          : new AMap.Walking();

      planner.search(
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
        (status: string, result: any) => {
          if (status === 'complete' && result.routes?.length > 0) {
            resolve(result.routes[0].time); // time in seconds
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  addMarker(
    coords: Coordinates,
    options?: {
      title?: string;
      content?: string;
      onClick?: () => void;
    }
  ): string {
    if (!this.map || !this.AMap) return '';

    const id = `marker-${this.markerIdCounter++}`;
    const AMap = this.AMap;

    const marker = new AMap.Marker({
      position: [coords.lng, coords.lat],
      title: options?.title,
      content: options?.content,
    });

    if (options?.onClick) {
      marker.on('click', options.onClick);
    }

    this.map.add(marker);
    this.markers.set(id, marker);
    return id;
  }

  removeMarker(id: string): void {
    const marker = this.markers.get(id);
    if (marker && this.map) {
      this.map.remove(marker);
      this.markers.delete(id);
    }
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => {
      if (this.map) this.map.remove(marker);
    });
    this.markers.clear();
  }

  renderPolygon(
    path: number[][],
    options?: {
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }
  ): void {
    if (!this.map || !this.AMap) return;

    const polygon = new this.AMap.Polygon({
      path,
      fillColor: options?.fillColor || '#10b981',
      fillOpacity: options?.fillOpacity || 0.15,
      strokeColor: options?.strokeColor || '#10b981',
      strokeWeight: options?.strokeWeight || 2,
      strokeOpacity: 0.6,
    });

    this.map.add(polygon);
    this.polygons.push(polygon);
  }

  clearPolygons(): void {
    this.polygons.forEach((polygon) => {
      if (this.map) this.map.remove(polygon);
    });
    this.polygons = [];
  }

  panTo(coords: Coordinates): void {
    if (this.map) {
      this.map.panTo([coords.lng, coords.lat]);
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }
}
