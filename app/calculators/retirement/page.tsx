import type { Metadata } from "next";
import { CalculatorScaffold } from "@/components/CalculatorScaffold";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";
import { getCalculator } from "@/lib/calculators-meta";

const calc = getCalculator("retirement");

export const metadata: Metadata = {
  title: calc.name,
  description: calc.description,
  alternates: { canonical: "/calculators/retirement" },
  openGraph: { title: `${calc.name} — Mintledger`, description: calc.description },
};

const faq = [
  {
    q: "What does 'in today's money' mean?",
    a: "The nominal balance discounted by inflation back to the present, so you can judge its real purchasing power rather than a large future number.",
  },
  {
    q: "How is the withdrawal amount set?",
    a: "Your desired annual spending is entered in today's money, then grown by inflation to the year you retire. It keeps rising with inflation each year of retirement.",
  },
  {
    q: "What happens after retirement in the model?",
    a: "The balance keeps earning the same expected return while you withdraw the inflation-adjusted spending each year. If it hits zero, the calculator flags the age.",
  },
  {
    q: "Does it include pensions or social security?",
    a: "No. Add any guaranteed income by reducing your desired spending accordingly.",
  },
];

export default function RetirementPage() {
  return (
    <CalculatorScaffold
      slug="retirement"
      intro="See the nest egg you're on track to build, what it's worth in today's money, and whether it lasts through retirement at your desired spending."
      faq={faq}
      explanation={
        <>
          <p>
            <strong>Accumulation:</strong> until the retirement age, the balance
            compounds monthly at the expected return and your monthly
            contribution is added.
          </p>
          <p>
            <strong>Drawdown:</strong> from retirement onward, each year you
            withdraw the target spending — grown from today by inflation — then
            the remaining balance earns the expected return:
          </p>
          <p className="rounded-card bg-surface px-4 py-3 font-mono text-xs text-primaryDark">
            balance = (balance − withdrawal) × (1 + return)
          </p>
          <p>
            Real figures divide the nominal balance by (1 + inflation) raised to
            the number of years from today. If the balance reaches zero before
            your planning age, that age is reported as a shortfall.
          </p>
        </>
      }
    >
      <RetirementCalculator />
    </CalculatorScaffold>
  );
}
