import type { Metadata } from "next";
import { CalculatorScaffold } from "@/components/CalculatorScaffold";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { getCalculator } from "@/lib/calculators-meta";

const calc = getCalculator("compound-interest");

export const metadata: Metadata = {
  title: calc.name,
  description: calc.description,
  alternates: { canonical: "/calculators/compound-interest" },
  openGraph: { title: `${calc.name} — Mintledger`, description: calc.description },
};

const faq = [
  {
    q: "How often does interest compound here?",
    a: "Monthly. The annual rate is divided by twelve and applied to the balance each month, then the month's contribution is added.",
  },
  {
    q: "What is the annual step-up?",
    a: "An optional yearly percentage increase to your monthly contribution — useful for modelling a SIP that you raise as income grows.",
  },
  {
    q: "Is this a guaranteed return?",
    a: "No. Investment returns vary and can be negative. Treat the rate as a long-run assumption, not a promise, and try a few values.",
  },
  {
    q: "Does it account for tax or inflation?",
    a: "No. Figures are nominal and pre-tax. For an inflation-adjusted view of a long horizon, see the retirement calculator.",
  },
];

export default function CompoundInterestPage() {
  return (
    <CalculatorScaffold
      slug="compound-interest"
      intro="Project how a starting balance plus regular contributions grow when interest compounds monthly, and see how much of the result is your money versus interest."
      faq={faq}
      explanation={
        <>
          <p>
            Each month the balance grows by the monthly rate and then the
            contribution is added:
          </p>
          <p className="rounded-card bg-surface px-4 py-3 font-mono text-xs text-primaryDark">
            balance = balance × (1 + r) + contribution
          </p>
          <p>
            where <strong>r</strong> is the annual rate ÷ 12 ÷ 100. After twelve
            months the contribution is increased by the step-up percentage, if
            any. <strong>Total contributions</strong> is everything you paid in
            (including the opening balance); <strong>interest earned</strong> is
            the final balance minus that.
          </p>
        </>
      }
    >
      <CompoundInterestCalculator />
    </CalculatorScaffold>
  );
}
