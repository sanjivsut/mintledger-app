/** Progressive income-tax estimate from static local bracket data. */

import type { TaxRegion } from "@/data/tax-brackets";

export interface TaxResult {
  gross: number;
  taxableIncome: number;
  totalTax: number;
  takeHome: number;
  effectiveRate: number;
  marginalRate: number;
  perBracket: {
    rate: number;
    incomeInBand: number;
    tax: number;
  }[];
}

export function computeTax(gross: number, region: TaxRegion): TaxResult {
  const taxableIncome = Math.max(0, gross - region.standardDeduction);

  let remaining = taxableIncome;
  let lowerBound = 0;
  let totalTax = 0;
  let marginalRate = 0;
  const perBracket: TaxResult["perBracket"] = [];

  for (const bracket of region.brackets) {
    if (remaining <= 0) break;
    const upper = bracket.upTo ?? Infinity;
    const band = Math.min(remaining, upper - lowerBound);
    const tax = band * bracket.rate;
    if (band > 0) {
      perBracket.push({ rate: bracket.rate, incomeInBand: band, tax });
      totalTax += tax;
      marginalRate = bracket.rate;
      remaining -= band;
    }
    lowerBound = upper;
  }

  return {
    gross,
    taxableIncome,
    totalTax,
    takeHome: gross - totalTax,
    effectiveRate: gross > 0 ? totalTax / gross : 0,
    marginalRate,
    perBracket,
  };
}
