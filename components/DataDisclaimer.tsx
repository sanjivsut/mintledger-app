import { Info } from "lucide-react";

/**
 * Plain-language notice that every figure on the site is a sample or a
 * self-entered value worked out on the visitor's own device — never a live feed.
 * Shown on the hub and on every calculator page.
 */
export function DataDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      className={`flex gap-3 rounded-card border border-accent bg-accent/25 p-4 text-sm leading-relaxed text-text/80 ${className}`}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primaryDark" />
      <p>
        <strong className="font-semibold text-primaryDark">
          The numbers here are examples.
        </strong>{" "}
        Interest rates, tax bands and every result are sample starting points or
        values you type in yourself. Nothing is pulled from a live rate feed or a
        bank, and the results are estimates only. Always check real figures with
        your bank, lender or a qualified adviser before making a decision.
      </p>
    </div>
  );
}
