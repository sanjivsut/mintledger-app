/**
 * Savings goal solver. Given a target and a horizon, work out the monthly
 * deposit needed; given a deposit, work out how long the goal takes.
 */

export interface SavingsGoalInput {
  goalAmount: number;
  currentSavings: number;
  annualRatePct: number;
  /** Months available to reach the goal. */
  months: number;
}

export interface SavingsGoalResult {
  requiredMonthlyDeposit: number;
  totalDeposited: number;
  interestEarned: number;
  series: { month: number; balance: number; deposited: number }[];
}

/** Future value of the opening balance plus the annuity of monthly deposits. */
export function solveMonthlyDeposit({
  goalAmount,
  currentSavings,
  annualRatePct,
  months,
}: SavingsGoalInput): SavingsGoalResult {
  const n = Math.max(1, Math.round(months));
  const r = annualRatePct / 100 / 12;

  const grownOpening =
    r === 0 ? currentSavings : currentSavings * Math.pow(1 + r, n);
  const remaining = Math.max(0, goalAmount - grownOpening);

  const annuityFactor =
    r === 0 ? n : (Math.pow(1 + r, n) - 1) / r;
  const requiredMonthlyDeposit = remaining / annuityFactor;

  const series: SavingsGoalResult["series"] = [];
  let balance = currentSavings;
  let deposited = currentSavings;
  for (let month = 1; month <= n; month++) {
    balance += balance * r;
    balance += requiredMonthlyDeposit;
    deposited += requiredMonthlyDeposit;
    series.push({ month, balance, deposited });
  }

  return {
    requiredMonthlyDeposit,
    totalDeposited: deposited,
    interestEarned: balance - deposited,
    series,
  };
}

/** Months needed to reach the goal at a fixed monthly deposit. */
export function solveTimeline(
  input: Omit<SavingsGoalInput, "months"> & { monthlyDeposit: number },
): number {
  const r = input.annualRatePct / 100 / 12;
  let balance = input.currentSavings;
  let month = 0;
  const cap = 12 * 100; // stop after 100 years
  while (balance < input.goalAmount && month < cap) {
    balance += balance * r + input.monthlyDeposit;
    month++;
  }
  return month;
}
