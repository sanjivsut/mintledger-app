import Link from "next/link";
import type { Metadata } from "next";
import { Lock, Zap, BookOpen, Info } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CalculatorGrid } from "@/components/CalculatorGrid";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { CALCULATORS } from "@/lib/calculators-meta";

export const metadata: Metadata = {
  title: "Free financial calculators",
  description:
    "Free, private financial calculators for loans, mortgages, savings, investing, retirement and tax. Simple sliders, instant results, plain-English explanations. All figures are examples, not live rates.",
  alternates: { canonical: "/" },
};

const POINTS = [
  {
    icon: Zap,
    title: "Instant answers",
    body: "Drag a slider and the result updates right away, with a chart that shows the whole picture.",
  },
  {
    icon: BookOpen,
    title: "Explained simply",
    body: "Each calculator says, in everyday language, what it worked out and which assumptions it made.",
  },
  {
    icon: Lock,
    title: "Private",
    body: "No sign-up and no tracking. What you type stays on your screen and is never sent anywhere.",
  },
  {
    icon: Info,
    title: "Sample figures, clearly flagged",
    body: "Interest rates, tax bands and other inputs are example starting points you can change — never a live feed.",
  },
];

export default function HomePage() {
  return (
    <div className="container-page py-8">
      <PageBanner
        eyebrow="Financial & banking calculators"
        title="Clear answers to money questions"
        subtitle="Mintledger is a growing set of free calculators for borrowing, saving, investing and planning — easy to use, upfront about its assumptions, and completely private."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/calculators/loan-emi" className="btn-primary">
            Open the loan calculator
          </Link>
          <Link href="/calculators" className="btn-secondary">
            Browse all calculators
          </Link>
        </div>
      </PageBanner>

      <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {POINTS.map((p) => (
          <div
            key={p.title}
            className="rounded-card border border-surface bg-white p-5 shadow-card"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-card bg-surface text-primary">
              <p.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 text-base font-semibold text-primaryDark">
              {p.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-text/70">{p.body}</p>
          </div>
        ))}
      </section>

      <DataDisclaimer className="mt-8" />

      <section aria-labelledby="all-heading" className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="all-heading" className="text-2xl">
              The calculators
            </h2>
            <p className="mt-1 text-sm text-text/60">
              {CALCULATORS.length} tools, more on the way.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <CalculatorGrid calculators={CALCULATORS} />
        </div>
      </section>

      <section className="mt-20 rounded-card bg-surface p-8 text-center sm:p-12">
        <h2 className="text-2xl">About the numbers you see</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text/70">
          Mintledger doesn&apos;t connect to any bank, market or rate service.
          The tax bands are a fixed set of example values that come with the
          site, and every result is a calculation based on those values and
          whatever you enter. Treat the answers as a guide and confirm the real
          figures with your provider.
        </p>
        <Link href="/about" className="btn-secondary mt-6">
          More about Mintledger
        </Link>
      </section>
    </div>
  );
}
