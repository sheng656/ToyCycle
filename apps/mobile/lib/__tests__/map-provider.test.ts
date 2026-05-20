import {
  getTileUrl,
  AMAP_TILE_URL,
  OPENSTREETMAP_TILE_URL,
} from '../map-provider';

/**
 * Unit tests for the getTileUrl() utility.
 * 
 * Business logic: The app targets China (AMap) as the primary market.
 * Mapbox for international regions (e.g., New Zealand) is not yet implemented,
 * so non-English locales should always default to AMap.
 */
describe('getTileUrl', () => {
  it('returns AMAP_TILE_URL for Chinese locale (zh)', () => {
    expect(getTileUrl('zh')).toBe(AMAP_TILE_URL);
  });

  it('returns AMAP_TILE_URL for Chinese-CN locale (zh-CN)', () => {
    // zh-CN is a common locale code for Simplified Chinese
    expect(getTileUrl('zh-CN')).toBe(AMAP_TILE_URL);
  });

  it('returns OPENSTREETMAP_TILE_URL for English locale (en) as a fallback', () => {
    // English falls back to OSM as a placeholder until Mapbox is implemented
    expect(getTileUrl('en')).toBe(OPENSTREETMAP_TILE_URL);
  });

  it('returns AMAP_TILE_URL for any non-English locale (e.g., fr)', () => {
    expect(getTileUrl('fr')).toBe(AMAP_TILE_URL);
  });

  it('returns AMAP_TILE_URL for any non-English locale (e.g., ja)', () => {
    expect(getTileUrl('ja')).toBe(AMAP_TILE_URL);
  });

  it('returns AMAP_TILE_URL for empty string locale', () => {
    // Empty string is not 'en', so it falls through to AMap
    expect(getTileUrl('')).toBe(AMAP_TILE_URL);
  });

  it('AMap tile URL contains required AMap query parameters', () => {
    // Validate the AMap URL has the correct autonavi domain and parameters
    expect(AMAP_TILE_URL).toContain('wprd01.is.autonavi.com');
    expect(AMAP_TILE_URL).toContain('{x}');
    expect(AMAP_TILE_URL).toContain('{y}');
    expect(AMAP_TILE_URL).toContain('{z}');
    expect(AMAP_TILE_URL).toContain('lang=zh_cn');
  });

  it('OSM tile URL contains required tile.openstreetmap.org domain', () => {
    expect(OPENSTREETMAP_TILE_URL).toContain('tile.openstreetmap.org');
    expect(OPENSTREETMAP_TILE_URL).toContain('{z}');
    expect(OPENSTREETMAP_TILE_URL).toContain('{x}');
    expect(OPENSTREETMAP_TILE_URL).toContain('{y}');
  });
});
