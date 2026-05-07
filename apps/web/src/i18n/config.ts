export const locales = ['zh'] as const;
export const defaultLocale = 'zh' as const;

export type Locale = (typeof locales)[number];
