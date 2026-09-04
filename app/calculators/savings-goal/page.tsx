import type { Metadata } from "next";
import { CalculatorScaffold } from "@/components/CalculatorScaffold";
import { SavingsGoalCalculator } from "@/components/calculators/SavingsGoalCalculator";
import { getCalculator } from "@/lib/calculators-meta";

const calc = getCalculator("savings-goal");

export const metadata: Metadata = {
  title: calc.name,
  description: calc.description,
  alternates: { canonical: "/calculators/savings-goal" },
  openGraph: { title: `${calc.name} — Mintledger`, description: calc.description },
};

const faq = [
  {
    q: "What does the result tell me?",
    a: "The fixed monthly deposit that, combined with your current savings and monthly compounding at the given rate, reaches the target exactly by the deadline.",
  },
  {
    q: "What if my current savings already cover the goal?",
    a: "The required deposit drops toward zero. The curve simply shows the balance growing past the target on interest alone.",
  },
  {
    q: "Is the interest rate realistic for savings?",
    a: "High-yield savings and short-term deposits are usually low single digits. Use a rate you can actually get for money you can't risk.",
  },
  {
    q: "Does it handle irregular deposits?",
    a: "No — it assumes the same amount every month. For variable investing, try the compound interest calculator.",
  },
];

export default function SavingsGoalPage() {
  return (
    <CalculatorScaffold
      slug="savings-goal"
      intro="Set a target and a deadline and see the monthly deposit required, how much of the total is your money versus interest, and the balance curve to the goal."
      faq={faq}
      explanation={
        <>
          <p>
            Your current savings grow for the whole period, so the deposits only
            need to cover the gap:
          </p>
          <p className="rounded-card bg-surface px-4 py-3 font-mono text-xs text-primaryDark">
            gap = goal − currentSavings × (1 + r)<sup>n</sup>
          </p>
          <p>
            That gap is divided by the future-value-of-an-annuity factor{" "}
            <code>((1 + r)<sup>n</sup> − 1) ÷ r</code> to get the monthly deposit,
            where <strong>r</strong> is the monthly rate and <strong>n</strong>{" "}
            the number of months. When the rate is zero it reduces to gap ÷ n.
          </p>
        </>
      }
    >
      <SavingsGoalCalculator />
    </CalculatorScaffold>
  );
}
