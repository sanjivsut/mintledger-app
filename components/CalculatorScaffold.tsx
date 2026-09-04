/**
 * Shared shell for every calculator route: animated banner, breadcrumb, the
 * sample-data notice, the two-column calculator + related sidebar, the
 * "how the answer is worked out" section, an FAQ (with JSON-LD), related grid.
 */

import type { ReactNode } from "react";
import { PageBanner } from "./PageBanner";
import { Breadcrumb } from "./Breadcrumb";
import { RelatedCalculators } from "./RelatedCalculators";
import { CalculatorGrid } from "./CalculatorGrid";
import { Faq, type QA } from "./Faq";
import { DataDisclaimer } from "./DataDisclaimer";
import {
  getCalculator,
  relatedCalculators,
  type CalculatorSlug,
} from "@/lib/calculators-meta";

interface CalculatorScaffoldProps {
  slug: CalculatorSlug;
  intro: string;
  children: ReactNode;
  explanation: ReactNode;
  faq: QA[];
}

export function CalculatorScaffold({
  slug,
  intro,
  children,
  explanation,
  faq,
}: CalculatorScaffoldProps) {
  const calc = getCalculator(slug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="container-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageBanner title={calc.name} subtitle={intro} eyebrow={calc.category}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Calculators", href: "/calculators" },
            { label: calc.shortName },
          ]}
        />
      </PageBanner>

      <DataDisclaimer className="mt-8" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">{children}</div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <RelatedCalculators slug={slug} />
        </div>
      </div>

      <section
        aria-labelledby="how-heading"
        className="mt-16 max-w-3xl"
      >
        <h2 id="how-heading" className="text-2xl">
          How the answer is worked out
        </h2>
        <div className="prose-mint mt-4 space-y-4 text-sm leading-relaxed text-text/80">
          {explanation}
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="mt-14 max-w-3xl">
        <h2 id="faq-heading" className="text-2xl">
          Frequently asked questions
        </h2>
        <div className="mt-4">
          <Faq items={faq} />
        </div>
      </section>

      <section aria-labelledby="more-heading" className="mt-16">
        <h2 id="more-heading" className="text-2xl">
          More calculators
        </h2>
        <div className="mt-5">
          <CalculatorGrid calculators={relatedCalculators(slug, 3)} />
        </div>
      </section>
    </div>
  );
}
