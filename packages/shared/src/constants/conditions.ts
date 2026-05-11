export const TOY_CONDITIONS = [
  'new',
  'like_new',
  'used'
] as const;

export type ToyCondition = typeof TOY_CONDITIONS[number];
