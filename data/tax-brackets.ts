/**
 * Static, locally-stored income-tax bracket data. No API, no lookups.
 *
 * These are simplified single-filer schedules for illustration only and are not
 * tax advice. Edit the brackets by hand to keep them current or to add regions.
 */

export interface TaxBracket {
  /** Upper bound of this bracket in the region's currency; null means "and above". */
  upTo: number | null;
  /** Marginal rate applied within the bracket, as a fraction (0.22 = 22%). */
  rate: number;
}

export interface TaxRegion {
  id: string;
  label: string;
  currency: string;
  /** A flat amount subtracted from gross before brackets are applied. */
  standardDeduction: number;
  brackets: TaxBracket[];
  note: string;
}

export const TAX_REGIONS: TaxRegion[] = [
  {
    id: "us-federal",
    label: "United States — federal (single)",
    currency: "USD",
    standardDeduction: 14600,
    brackets: [
      { upTo: 11600, rate: 0.1 },
      { upTo: 47150, rate: 0.12 },
      { upTo: 100525, rate: 0.22 },
      { upTo: 191950, rate: 0.24 },
      { upTo: 243725, rate: 0.32 },
      { upTo: 609350, rate: 0.35 },
      { upTo: null, rate: 0.37 },
    ],
    note: "Simplified 2024-style federal brackets. Excludes state tax, FICA, credits.",
  },
  {
    id: "uk",
    label: "United Kingdom (England & Wales)",
    currency: "GBP",
    standardDeduction: 12570,
    brackets: [
      { upTo: 37700, rate: 0.2 },
      { upTo: 125140, rate: 0.4 },
      { upTo: null, rate: 0.45 },
    ],
    note: "Personal allowance shown as a deduction. Ignores allowance taper and NI.",
  },
  {
    id: "india-new",
    label: "India — new regime",
    currency: "INR",
    standardDeduction: 75000,
    brackets: [
      { upTo: 300000, rate: 0 },
      { upTo: 700000, rate: 0.05 },
      { upTo: 1000000, rate: 0.1 },
      { upTo: 1200000, rate: 0.15 },
      { upTo: 1500000, rate: 0.2 },
      { upTo: null, rate: 0.3 },
    ],
    note: "Simplified new-regime slabs. Ignores 87A rebate, surcharge and cess.",
  },
];

export const DEFAULT_TAX_REGION_ID = TAX_REGIONS[0].id;
