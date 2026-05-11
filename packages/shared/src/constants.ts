/**
 * Shared constants for the ToyCycle platform.
 */

/** Initial credits granted to new users for cold-start liquidity */
export const INITIAL_CREDITS = 50;

/** Platform fee percentage on each exchange (5-10%) */
export const PLATFORM_FEE_PERCENT = 0.08; // 8%

/** Maximum photos per toy listing */
export const MAX_TOY_PHOTOS = 5;

/** Default isochrone time in minutes */
export const DEFAULT_ISOCHRONE_MINUTES = 15;

/** Available travel modes for isochrone */
export const TRAVEL_MODES = ['walking', 'driving'] as const;

/** Subscription tiers */
export const SUBSCRIPTION_TIERS = {
  free: {
    maxMonthlyExchanges: 3,
    monthlyBonusCredits: 0,
    feeWaiversPerMonth: 0,
    priceYuan: 0,
  },
  plus: {
    maxMonthlyExchanges: Infinity,
    monthlyBonusCredits: 0,
    feeWaiversPerMonth: 2,
    priceYuan: 29.9,
  },
  family: {
    maxMonthlyExchanges: Infinity,
    monthlyBonusCredits: 100,
    feeWaiversPerMonth: 5,
    priceYuan: 59.9,
  },
} as const;
