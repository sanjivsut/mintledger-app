/** Zod schemas for calculator inputs, shared by the RHF-driven islands. */

import { z } from "zod";

export const loanSchema = z.object({
  amount: z.coerce.number().min(1_000).max(100_000_000),
  annualRatePct: z.coerce.number().min(0).max(60),
  months: z.coerce.number().int().min(1).max(600),
});
export type LoanForm = z.infer<typeof loanSchema>;

export const mortgageSchema = z.object({
  homePrice: z.coerce.number().min(10_000).max(100_000_000),
  downPayment: z.coerce.number().min(0).max(100_000_000),
  annualRatePct: z.coerce.number().min(0).max(30),
  termYears: z.coerce.number().int().min(1).max(40),
  propertyTaxPct: z.coerce.number().min(0).max(10),
  annualInsurance: z.coerce.number().min(0).max(1_000_000),
  monthlyHoa: z.coerce.number().min(0).max(100_000),
  includeEscrow: z.boolean(),
});
export type MortgageForm = z.infer<typeof mortgageSchema>;

export const compoundSchema = z.object({
  initialAmount: z.coerce.number().min(0).max(100_000_000),
  monthlyContribution: z.coerce.number().min(0).max(10_000_000),
  annualRatePct: z.coerce.number().min(0).max(40),
  years: z.coerce.number().int().min(1).max(60),
  annualStepUpPct: z.coerce.number().min(0).max(25),
});
export type CompoundForm = z.infer<typeof compoundSchema>;

export const retirementSchema = z.object({
  currentAge: z.coerce.number().int().min(18).max(80),
  retirementAge: z.coerce.number().int().min(40).max(90),
  lifeExpectancy: z.coerce.number().int().min(60).max(110),
  currentSavings: z.coerce.number().min(0).max(100_000_000),
  monthlyContribution: z.coerce.number().min(0).max(1_000_000),
  annualReturnPct: z.coerce.number().min(0).max(20),
  annualInflationPct: z.coerce.number().min(0).max(15),
  desiredAnnualSpending: z.coerce.number().min(0).max(10_000_000),
});
export type RetirementForm = z.infer<typeof retirementSchema>;

export const savingsGoalSchema = z.object({
  goalAmount: z.coerce.number().min(100).max(100_000_000),
  currentSavings: z.coerce.number().min(0).max(100_000_000),
  annualRatePct: z.coerce.number().min(0).max(20),
  months: z.coerce.number().int().min(1).max(600),
});
export type SavingsGoalForm = z.infer<typeof savingsGoalSchema>;

export const taxSchema = z.object({
  gross: z.coerce.number().min(0).max(100_000_000),
  regionId: z.string(),
});
export type TaxForm = z.infer<typeof taxSchema>;
