import type { Metadata } from "next";
import { CalculatorScaffold } from "@/components/CalculatorScaffold";
import { TaxEstimator } from "@/components/calculators/TaxEstimator";
import { getCalculator } from "@/lib/calculators-meta";

const calc = getCalculator("tax-estimator");

export const metadata: Metadata = {
  title: calc.name,
  description: calc.description,
  alternates: { canonical: "/calculators/tax-estimator" },
  openGraph: { title: `${calc.name} — Mintledger`, description: calc.description },
};

const faq = [
  {
    q: "Which taxes does this cover?",
    a: "Just the main income tax for the region you pick, after one standard deduction or personal allowance. It leaves out social-security or payroll taxes, state and local taxes, surcharges, credits and rebates.",
  },
  {
    q: "What's the difference between the effective and marginal rate?",
    a: "The marginal rate is what you'd pay on your next bit of income — the top band you reach. The effective rate is your total tax as a share of your whole income, and it's always lower.",
  },
  {
    q: "How accurate are the tax bands?",
    a: "They are simplified example bands, roughly based on recent years. Treat the result as a ballpark figure and check the official tax tables before relying on it.",
  },
  {
    q: "Why is my country not listed?",
    a: "Only a few regions are included as examples for now. The ones shown are meant to illustrate how progressive tax works rather than to cover every country.",
  },
];

export default function TaxEstimatorPage() {
  return (
    <CalculatorScaffold
      slug="tax-estimator"
      intro="Estimate income tax and take-home pay using simplified example tax bands, with your effective and marginal rate broken out band by band."
      faq={faq}
      explanation={
        <>
          <p>
            Taxable income is gross income minus the schedule&apos;s standard
            deduction or personal allowance (not below zero). Tax is then applied
            band by band:
          </p>
          <p className="rounded-card bg-surface px-4 py-3 font-mono text-xs text-primaryDark">
            tax = Σ (income within band × band rate)
          </p>
          <p>
            Only the portion of income that falls inside each band is taxed at
            that band&apos;s rate. <strong>Effective rate</strong> is total tax ÷
            gross; <strong>marginal rate</strong> is the highest band reached.
            This is not tax advice.
          </p>
        </>
      }
    >
      <TaxEstimator />
    </CalculatorScaffold>
  );
}
