import type { Metadata } from "next";
import { CalculatorScaffold } from "@/components/CalculatorScaffold";
import { LoanEmiCalculator } from "@/components/calculators/LoanEmiCalculator";
import { getCalculator } from "@/lib/calculators-meta";

const calc = getCalculator("loan-emi");

export const metadata: Metadata = {
  title: calc.name,
  description: calc.description,
  alternates: { canonical: "/calculators/loan-emi" },
  openGraph: { title: `${calc.name} — Mintledger`, description: calc.description },
};

const faq = [
  {
    q: "What is an EMI?",
    a: "An equated monthly instalment is a fixed payment that covers both interest and principal so the loan is fully repaid by the end of the term. Early payments are mostly interest; later payments are mostly principal.",
  },
  {
    q: "Does a longer tenure reduce the cost of a loan?",
    a: "No. A longer tenure lowers the monthly payment but increases total interest, because you owe the balance for longer. The amortization chart shows this trade-off directly.",
  },
  {
    q: "Is the interest rate here monthly or annual?",
    a: "You enter the nominal annual rate. The calculator divides it by 12 to get the monthly rate used in the EMI formula.",
  },
  {
    q: "Are fees and prepayments included?",
    a: "No. This models a plain fixed-rate loan with no origination fees, insurance or prepayments. Real quotes may differ.",
  },
];

export default function LoanEmiPage() {
  return (
    <CalculatorScaffold
      slug="loan-emi"
      intro="Enter an amount, rate and tenure to see the monthly payment, the total interest you'll pay, and a full year-by-year amortization schedule."
      faq={faq}
      explanation={
        <>
          <p>
            The monthly payment uses the standard reducing-balance formula:
          </p>
          <p className="rounded-card bg-surface px-4 py-3 font-mono text-xs text-primaryDark">
            EMI = P · r · (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> − 1)
          </p>
          <p>
            where <strong>P</strong> is the principal, <strong>r</strong> is the
            monthly interest rate (annual rate ÷ 12 ÷ 100), and{" "}
            <strong>n</strong> is the number of monthly payments. When the rate is
            zero the payment is simply P ÷ n.
          </p>
          <p>
            Each month, interest is charged on the outstanding balance and the
            rest of the payment reduces the principal. As the balance falls, the
            interest portion shrinks and the principal portion grows. Total
            interest is the sum of every month&apos;s interest charge; the final
            row absorbs any rounding so the balance lands exactly on zero.
          </p>
        </>
      }
    >
      <LoanEmiCalculator />
    </CalculatorScaffold>
  );
}
