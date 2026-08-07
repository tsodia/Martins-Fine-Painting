// Ballpark pricing anchors for the instant-estimate feature.
//
// ⚠️ PLACEHOLDER RANGES — these are generic market-range guesses, NOT Martin's
// real pricing. Martin must review and calibrate every number below before
// ESTIMATE_SHOW_TO_CUSTOMER is enabled. Until then, estimates are only sent
// internally (email to Martin + Tyler) so accuracy can be checked against
// real consultations.

export interface PriceRange {
  low: number;
  high: number;
}

export interface PricingAnchors {
  /** Per cabinet door (removal, prep, hand-rolled finish, rehang) */
  perDoor: PriceRange;
  /** Per drawer front */
  perDrawerFront: PriceRange;
  /** Built-ins / bookshelves, per linear foot of unit width */
  builtInPerLinearFoot: PriceRange;
  /** Minimum engagement for any cabinet/built-in project */
  projectMinimum: PriceRange;
  /** Typical full kitchen, all-in (sanity bound for the model) */
  fullKitchen: PriceRange;
}

export const PRICING_ANCHORS: PricingAnchors = {
  perDoor: { low: 100, high: 200 },
  perDrawerFront: { low: 50, high: 100 },
  builtInPerLinearFoot: { low: 150, high: 350 },
  projectMinimum: { low: 1200, high: 1800 },
  fullKitchen: { low: 3500, high: 8500 },
};
