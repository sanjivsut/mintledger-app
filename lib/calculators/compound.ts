/**
 * Compound interest / SIP growth. Pure functions.
 *
 * Handles a lump-sum opening balance plus a recurring contribution, compounded
 * monthly, with an optional annual step-up on the contribution.
 */

export interface CompoundInput {
  initialAmount: number;
  monthlyContribution: number;
  annualRatePct: number;
  years: number;
  /** Yearly percentage increase applied to the contribution, e.g. 5 */
  annualStepUpPct: number;
}

export interface CompoundYearPoint {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
}

export interface CompoundResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  series: CompoundYearPoint[];
}

export function computeCompound({
  initialAmount,
  monthlyContribution,
  annualRatePct,
  years,
  annualStepUpPct,
}: CompoundInput): CompoundResult {
  const monthlyRate = annualRatePct / 100 / 12;
  const totalYears = Math.max(1, Math.round(years));

  let balance = Math.max(0, initialAmount);
  let contributedSoFar = Math.max(0, initialAmount);
  let contribution = Math.max(0, monthlyContribution);

  const series: CompoundYearPoint[] = [
    {
      year: 0,
      contributions: contributedSoFar,
      interest: 0,
      balance,
    },
  ];

  for (let year = 1; year <= totalYears; year++) {
    for (let month = 0; month < 12; month++) {
      balance += balance * monthlyRate;
      balance += contribution;
      contributedSoFar += contribution;
    }
    series.push({
      year,
      contributions: contributedSoFar,
      interest: balance - contributedSoFar,
      balance,
    });
    contribution += contribution * (annualStepUpPct / 100);
  }

  return {
    futureValue: balance,
    totalContributions: contributedSoFar,
    totalInterest: balance - contributedSoFar,
    series,
  };
}
