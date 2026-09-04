import type { Metadata } from "next";
import { CalculatorScaffold } from "@/components/CalculatorScaffold";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { getCalculator } from "@/lib/calculators-meta";

const calc = getCalculator("mortgage");

export const metadata: Metadata = {
  title: calc.name,
  description: calc.description,
  alternates: { canonical: "/calculators/mortgage" },
  openGraph: { title: `${calc.name} — Mintledger`, description: calc.description },
};

const faq = [
  {
    q: "What does the monthly figure include?",
    a: "Principal and interest always. With 'taxes & insurance' on, it also adds monthly property tax, homeowners insurance and any HOA dues — often called PITI plus HOA.",
  },
  {
    q: "How is property tax estimated?",
    a: "As a percentage of the home price, divided by twelve. Real assessments use local rates and assessed values that can differ from the purchase price.",
  },
  {
    q: "Does a bigger down payment lower the monthly payment?",
    a: "Yes — it reduces the amount financed, so both the payment and the lifetime interest fall. It does not change property tax or insurance in this model.",
  },
  {
    q: "Is PMI or mortgage insurance included?",
    a: "No. Loans below 20% down often carry mortgage insurance; add it to the insurance field if you want to approximate it.",
  },
];

export default function MortgagePage() {
  return (
    <CalculatorScaffold
      slug="mortgage"
      intro="Set the price, down payment, rate and term, toggle escrow for taxes and insurance, and see the full monthly cost plus lifetime interest."
      faq={faq}
      explanation={
        <>
          <p>
            The loan amount is the home price minus the down payment. Principal
            and interest use the same reducing-balance formula as a standard
            loan:
          </p>
          <p className="rounded-card bg-surface px-4 py-3 font-mono text-xs text-primaryDark">
            P&amp;I = L · r · (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> − 1)
          </p>
          <p>
            with <strong>L</strong> the financed amount, <strong>r</strong> the
            monthly rate and <strong>n</strong> the term in months. When escrow is
            enabled, monthly property tax is{" "}
            <em>home price × tax % ÷ 12</em>, monthly insurance is the annual
            premium ÷ 12, and HOA dues are added as entered. The total monthly
            cost is the sum of these parts.
          </p>
        </>
      }
    >
      <MortgageCalculator />
    </CalculatorScaffold>
  );
}
