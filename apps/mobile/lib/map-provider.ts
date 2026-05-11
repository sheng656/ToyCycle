export const AMAP_TILE_URL = 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7';
export const OPENSTREETMAP_TILE_URL = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const getTileUrl = (locale: string) => {
  // If locale is english, use OSM or similar, otherwise AMap
  // We'll default to AMap for now, but provide the toggle.
  if (locale === 'en') {
    return OPENSTREETMAP_TILE_URL;
  }
  return AMAP_TILE_URL;
};
