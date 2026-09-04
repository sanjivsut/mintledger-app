/**
 * Loan / EMI maths. Pure functions, no I/O — safe to run on the server for the
 * pre-computed example and on the client for live slider updates.
 */

export interface LoanInput {
  /** Principal borrowed, in the display currency. */
  amount: number;
  /** Nominal annual interest rate as a percentage, e.g. 8.5 */
  annualRatePct: number;
  /** Loan tenure in months. */
  months: number;
}

export interface AmortisationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  schedule: AmortisationRow[];
}

/**
 * Standard reducing-balance EMI:
 *   EMI = P · r · (1 + r)^n / ((1 + r)^n − 1)
 * where r is the monthly rate and n the number of months.
 */
export function computeLoan({ amount, annualRatePct, months }: LoanInput): LoanResult {
  const principal = Math.max(0, amount);
  const n = Math.max(1, Math.round(months));
  const r = annualRatePct / 100 / 12;

  const emi =
    r === 0
      ? principal / n
      : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const schedule: AmortisationRow[] = [];
  let balance = principal;

  for (let period = 1; period <= n; period++) {
    const interest = balance * r;
    let principalPart = emi - interest;
    // Last row: absorb rounding drift so the balance lands exactly on zero.
    if (period === n) principalPart = balance;
    balance = Math.max(0, balance - principalPart);
    schedule.push({
      period,
      payment: principalPart + interest,
      principal: principalPart,
      interest,
      balance,
    });
  }

  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);

  return {
    emi,
    totalPayment: principal + totalInterest,
    totalInterest,
    principal,
    schedule,
  };
}

/** Collapse a monthly schedule into year-by-year totals for compact charts. */
export function toYearlySchedule(schedule: AmortisationRow[]) {
  const years: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[] = [];

  schedule.forEach((row, index) => {
    const yearIndex = Math.floor(index / 12);
    if (!years[yearIndex]) {
      years[yearIndex] = {
        year: yearIndex + 1,
        principal: 0,
        interest: 0,
        balance: row.balance,
      };
    }
    years[yearIndex].principal += row.principal;
    years[yearIndex].interest += row.interest;
    years[yearIndex].balance = row.balance;
  });

  return years;
}
