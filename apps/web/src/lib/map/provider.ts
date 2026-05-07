/**
 * Map Provider Abstraction Layer
 * 
 * This interface allows us to swap map implementations between
 * AMap (China) and Mapbox (International) without changing business logic.
 */

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface Address {
  formattedAddress: string;
  province?: string;
  city?: string;
  district?: string;
}

export type TravelMode = 'walking' | 'driving';

export interface MapOptions {
  center: Coordinates;
  zoom: number;
  viewMode?: '2D' | '3D';
}

export interface MapProvider {
  /** Initialize the map in a container element */
  initMap(container: HTMLElement, options: MapOptions): Promise<void>;

  /** Destroy the map instance and clean up resources */
  destroyMap(): void;

  /** Convert address text to coordinates */
  geocode(address: string): Promise<Coordinates | null>;

  /** Convert coordinates to a human-readable address */
  reverseGeocode(coords: Coordinates): Promise<Address | null>;

  /** Get the user's current location */
  getCurrentLocation(): Promise<Coordinates>;

  /**
   * Calculate an isochrone polygon for a given center point,
   * time limit, and travel mode.
   * Returns GeoJSON-compatible coordinates for rendering.
   */
  calculateIsochrone(
    center: Coordinates,
    minutes: number,
    mode: TravelMode
  ): Promise<number[][]>;

  /** Add a marker to the map */
  addMarker(
    coords: Coordinates,
    options?: {
      title?: string;
      content?: string;
      onClick?: () => void;
    }
  ): string; // returns marker ID

  /** Remove a marker by ID */
  removeMarker(id: string): void;

  /** Clear all markers */
  clearMarkers(): void;

  /** Render a polygon overlay on the map */
  renderPolygon(
    path: number[][],
    options?: {
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }
  ): void;

  /** Clear all polygon overlays */
  clearPolygons(): void;

  /** Pan the map to a specific location */
  panTo(coords: Coordinates): void;

  /** Set the map zoom level */
  setZoom(zoom: number): void;
}
