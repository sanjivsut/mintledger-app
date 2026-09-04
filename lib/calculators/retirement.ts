/**
 * Retirement projection with inflation-adjusted (real) figures. Pure functions.
 */

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  /** Age to which savings must last. */
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  /** Expected nominal annual return while saving and drawing down. */
  annualReturnPct: number;
  annualInflationPct: number;
  /** Desired annual spending in today's money. */
  desiredAnnualSpending: number;
}

export interface RetirementYearPoint {
  age: number;
  balanceNominal: number;
  balanceReal: number;
  phase: "accumulate" | "drawdown";
}

export interface RetirementResult {
  nestEggAtRetirement: number;
  nestEggAtRetirementReal: number;
  /** Inflation-grown spending in the first retirement year. */
  firstYearWithdrawal: number;
  yearsOfSavings: number;
  moneyRunsOutAge: number | null;
  surplusOrShortfall: number;
  series: RetirementYearPoint[];
}

export function computeRetirement(input: RetirementInput): RetirementResult {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    annualReturnPct,
    annualInflationPct,
    desiredAnnualSpending,
  } = input;

  const r = annualReturnPct / 100;
  const i = annualInflationPct / 100;
  const monthlyR = r / 12;

  const accumulateYears = Math.max(0, retirementAge - currentAge);
  const drawdownYears = Math.max(0, lifeExpectancy - retirementAge);

  const series: RetirementYearPoint[] = [];
  let balance = Math.max(0, currentSavings);

  // Accumulation: contribute monthly, grow monthly.
  for (let y = 0; y < accumulateYears; y++) {
    for (let m = 0; m < 12; m++) {
      balance += balance * monthlyR;
      balance += monthlyContribution;
    }
    const age = currentAge + y + 1;
    series.push({
      age,
      balanceNominal: balance,
      balanceReal: balance / Math.pow(1 + i, age - currentAge),
      phase: "accumulate",
    });
  }

  const nestEggAtRetirement = balance;
  const nestEggAtRetirementReal =
    balance / Math.pow(1 + i, accumulateYears);

  // Spending in the first retirement year, grown by inflation from today.
  const firstYearWithdrawal =
    desiredAnnualSpending * Math.pow(1 + i, accumulateYears);

  // Drawdown: withdraw an inflation-growing amount at the start of each year.
  let moneyRunsOutAge: number | null = null;
  let withdrawal = firstYearWithdrawal;
  for (let y = 0; y < drawdownYears; y++) {
    balance -= withdrawal;
    if (balance <= 0 && moneyRunsOutAge === null) {
      moneyRunsOutAge = retirementAge + y;
      balance = 0;
    }
    balance += balance * r;
    withdrawal *= 1 + i;
    const age = retirementAge + y + 1;
    series.push({
      age,
      balanceNominal: Math.max(0, balance),
      balanceReal: Math.max(0, balance) / Math.pow(1 + i, age - currentAge),
      phase: "drawdown",
    });
  }

  return {
    nestEggAtRetirement,
    nestEggAtRetirementReal,
    firstYearWithdrawal,
    yearsOfSavings: accumulateYears,
    moneyRunsOutAge,
    surplusOrShortfall: balance,
    series,
  };
}
