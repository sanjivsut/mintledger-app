/** Mortgage maths — reuses the loan engine and layers on housing costs. */

import { computeLoan, toYearlySchedule, type AmortisationRow } from "./loan";

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  annualRatePct: number;
  termYears: number;
  /** Annual property tax as a percentage of home price. */
  propertyTaxPct: number;
  /** Annual homeowners insurance, a flat amount. */
  annualInsurance: number;
  /** Monthly HOA / maintenance dues. */
  monthlyHoa: number;
  includeEscrow: boolean;
}

export interface MortgageResult {
  loanAmount: number;
  principalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  totalMonthly: number;
  totalInterest: number;
  totalOfPayments: number;
  payoffYears: number;
  schedule: AmortisationRow[];
  yearly: ReturnType<typeof toYearlySchedule>;
}

export function computeMortgage(input: MortgageInput): MortgageResult {
  const loanAmount = Math.max(0, input.homePrice - input.downPayment);
  const loan = computeLoan({
    amount: loanAmount,
    annualRatePct: input.annualRatePct,
    months: Math.round(input.termYears * 12),
  });

  const monthlyTax = input.includeEscrow
    ? (input.homePrice * (input.propertyTaxPct / 100)) / 12
    : 0;
  const monthlyInsurance = input.includeEscrow ? input.annualInsurance / 12 : 0;
  const monthlyHoa = input.includeEscrow ? input.monthlyHoa : 0;

  return {
    loanAmount,
    principalAndInterest: loan.emi,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    totalMonthly: loan.emi + monthlyTax + monthlyInsurance + monthlyHoa,
    totalInterest: loan.totalInterest,
    totalOfPayments: loan.totalPayment,
    payoffYears: input.termYears,
    schedule: loan.schedule,
    yearly: toYearlySchedule(loan.schedule),
  };
}
