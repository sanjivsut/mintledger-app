import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { CalculatorGrid } from "@/components/CalculatorGrid";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { CALCULATORS } from "@/lib/calculators-meta";

export const metadata: Metadata = {
  title: "All calculators",
  description:
    "Every Mintledger calculator in one place: loan EMI, mortgage, compound interest / SIP, retirement, take-home tax and savings goal.",
  alternates: { canonical: "/calculators" },
};

const CATEGORIES = ["Borrowing", "Investing", "Planning", "Everyday"] as const;

export default function CalculatorHubPage() {
  return (
    <div className="container-page py-8">
      <PageBanner
        eyebrow="Calculator hub"
        title="Pick a calculator"
        subtitle="Each one has simple sliders, an instant result and a chart, plus a plain-English note on how the answer was worked out. All free, all private."
      />

      <DataDisclaimer className="mt-8" />

      {CATEGORIES.map((category) => {
        const items = CALCULATORS.filter((c) => c.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="mt-14" aria-labelledby={`cat-${category}`}>
            <h2 id={`cat-${category}`} className="text-xl">
              {category}
            </h2>
            <div className="mt-5">
              <CalculatorGrid calculators={items} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
