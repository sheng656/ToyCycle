export const TOY_CATEGORIES = {
  building: '🧱',
  figures: '🧸',
  vehicles: '🚗',
  puzzles: '🧩',
  outdoor: '⚽',
  electronic: '🎮',
  stuffed: '🐻',
  educational: '📐',
  creative: '🎨',
  other: '📦',
} as const;

export type ToyCategory = keyof typeof TOY_CATEGORIES;
