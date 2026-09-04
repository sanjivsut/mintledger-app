/**
 * Single source of truth for the calculator catalogue: routes, copy, icons and
 * cross-links. Imported by the hub grid, related-calculator sidebars, nav,
 * sitemap and per-route metadata — all server-rendered.
 */

import type { IconKey } from "@/components/icons";

export type CalculatorSlug =
  | "loan-emi"
  | "mortgage"
  | "compound-interest"
  | "retirement"
  | "tax-estimator"
  | "savings-goal";

export interface CalculatorMeta {
  slug: CalculatorSlug;
  name: string;
  /** Short label for nav and breadcrumbs. */
  shortName: string;
  tagline: string;
  description: string;
  icon: IconKey;
  category: "Borrowing" | "Investing" | "Planning" | "Everyday";
  keywords: string[];
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "loan-emi",
    name: "Loan EMI calculator",
    shortName: "Loan EMI",
    tagline: "Monthly payment, total interest and a full amortization schedule.",
    description:
      "Work out the equated monthly instalment on any fixed-rate loan, see how much of every payment goes to interest, and read the payoff schedule year by year.",
    icon: "loan",
    category: "Borrowing",
    keywords: ["emi calculator", "loan repayment", "amortization schedule", "personal loan"],
  },
  {
    slug: "mortgage",
    name: "Mortgage calculator",
    shortName: "Mortgage",
    tagline: "Principal, interest, taxes and insurance in one monthly figure.",
    description:
      "Estimate the full monthly cost of a home loan including escrow for property tax and insurance, and see the payoff timeline and lifetime interest.",
    icon: "mortgage",
    category: "Borrowing",
    keywords: ["mortgage calculator", "home loan", "PITI", "down payment"],
  },
  {
    slug: "compound-interest",
    name: "Compound interest calculator",
    shortName: "Compound / SIP",
    tagline: "Growth of a lump sum plus recurring contributions.",
    description:
      "Project how savings grow when interest compounds monthly, with optional annual step-ups on your contribution, and see the split between what you put in and what you earned.",
    icon: "compound",
    category: "Investing",
    keywords: ["compound interest", "SIP calculator", "investment growth", "future value"],
  },
  {
    slug: "retirement",
    name: "Retirement calculator",
    shortName: "Retirement",
    tagline: "Inflation-adjusted projection to and through retirement.",
    description:
      "See the nest egg you are on track to build, what it is worth in today's money, and whether it lasts through retirement at your desired spending level.",
    icon: "retirement",
    category: "Planning",
    keywords: ["retirement calculator", "nest egg", "inflation adjusted", "drawdown"],
  },
  {
    slug: "tax-estimator",
    name: "Take-home tax estimator",
    shortName: "Tax estimate",
    tagline: "Progressive income tax and take-home pay by region.",
    description:
      "Estimate income tax and take-home pay using simplified example tax bands for a few regions, with the effective and marginal rate broken out.",
    icon: "tax",
    category: "Everyday",
    keywords: ["tax calculator", "take home pay", "income tax brackets", "effective rate"],
  },
  {
    slug: "savings-goal",
    name: "Savings goal calculator",
    shortName: "Savings goal",
    tagline: "The monthly deposit that gets you to a target by a date.",
    description:
      "Set a target amount and a deadline and see the monthly deposit required, how much is your money versus interest, and the balance curve to the goal.",
    icon: "savings",
    category: "Planning",
    keywords: ["savings goal", "sinking fund", "monthly savings", "target amount"],
  },
];

export const CALCULATOR_BY_SLUG: Record<CalculatorSlug, CalculatorMeta> =
  Object.fromEntries(CALCULATORS.map((c) => [c.slug, c])) as Record<
    CalculatorSlug,
    CalculatorMeta
  >;

export function getCalculator(slug: CalculatorSlug): CalculatorMeta {
  return CALCULATOR_BY_SLUG[slug];
}

/** Everything except `slug`, in catalogue order — for "related" sidebars. */
export function relatedCalculators(
  slug: CalculatorSlug,
  limit = 4,
): CalculatorMeta[] {
  const current = CALCULATOR_BY_SLUG[slug];
  return CALCULATORS.filter((c) => c.slug !== slug)
    .sort((a, b) => {
      const aSame = a.category === current.category ? 0 : 1;
      const bSame = b.category === current.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, limit);
}
