export const TOY_CATEGORIES = [
  'building',
  'figures',
  'vehicles',
  'puzzles',
  'outdoor',
  'electronic',
  'stuffed',
  'educational',
  'creative',
  'other'
] as const;

export type ToyCategory = typeof TOY_CATEGORIES[number];
