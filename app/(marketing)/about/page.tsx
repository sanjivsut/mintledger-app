import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { DataDisclaimer } from "@/components/DataDisclaimer";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Mintledger is, how to use the calculators, where the numbers come from, and why none of the rates are live.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-page py-8">
      <PageBanner
        eyebrow="About"
        title="Simple calculators, no surprises"
        subtitle="Mintledger helps you get a quick, rough answer to a money question and understand how that answer was reached — without accounts, adverts or jargon."
      />

      <DataDisclaimer className="mx-auto mt-10 max-w-2xl" />

      <div className="prose-mint mx-auto mt-10 max-w-2xl space-y-8 text-sm leading-relaxed text-text/80">
        <section>
          <h2 className="text-xl">What it is</h2>
          <p className="mt-2">
            A small, free collection of financial calculators — for loans,
            mortgages, saving towards a goal, compound growth, retirement and
            estimating take-home pay. Each one is built to be quick to try and
            easy to read.
          </p>
        </section>

        <section>
          <h2 className="text-xl">How to use it</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Pick a calculator from the hub or the menu.</li>
            <li>
              Drag the sliders, or type exact amounts into the boxes next to
              them. The result and the chart update as you go.
            </li>
            <li>
              Read the short &ldquo;how the answer is worked out&rdquo; section
              below each calculator if you want to understand the maths.
            </li>
            <li>
              Save a version to compare a few what-if scenarios side by side, or
              download a small summary image to keep or share.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl">Where the numbers come from</h2>
          <p className="mt-2">
            Nothing on Mintledger is a live rate. The tax estimator uses
            simplified example tax bands, and every other number is either a
            sensible default we picked or a value you enter yourself. You can
            change any of them. Every headline figure — a monthly payment, a
            future balance, a tax total — is then worked out from those inputs on
            your own device.
          </p>
          <p className="mt-2">
            Because the rates are examples and the models are simplified, the
            results can differ from a real quote, which will include fees, exact
            rules and up-to-date rates. Use Mintledger to explore and compare,
            then confirm anything important with your bank, lender or a qualified
            adviser.
          </p>
        </section>

        <section>
          <h2 className="text-xl">Your privacy</h2>
          <p className="mt-2">
            There are no accounts, no adverts and no tracking. The figures you
            enter are not sent anywhere. Scenarios you choose to save are kept
            only in your own browser and can be cleared at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl">Please remember</h2>
          <p className="mt-2">
            Mintledger is for learning and rough planning only. It is not
            financial, tax or investment advice.
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link href="/calculators" className="btn-primary">
          Browse the calculators
        </Link>
      </div>
    </div>
  );
}
