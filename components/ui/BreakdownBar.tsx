"use client";

/**
 * Principal-vs-interest (or contributions-vs-growth) split: two stacked pill
 * rows plus a matching 2-segment horizontal bar. Colours follow the locked-in
 * component conventions — surface tint for principal, coral tint for interest.
 */

import { motion } from "framer-motion";

interface Segment {
  label: string;
  value: number;
  tone: "principal" | "interest";
}

export function BreakdownBar({
  segments,
  format,
}: {
  segments: [Segment, Segment];
  format: (n: number) => string;
}) {
  const total = segments[0].value + segments[1].value || 1;
  const firstPct = (segments[0].value / total) * 100;

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-pill bg-surface">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${firstPct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        <motion.div
          className="h-full bg-negative"
          animate={{ width: `${100 - firstPct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="mt-3 space-y-2">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`flex items-center justify-between rounded-pill px-3 py-2 text-sm ${
              seg.tone === "principal"
                ? "bg-surface text-primaryDark"
                : "bg-interest-bg text-interest-text"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  seg.tone === "principal" ? "bg-primary" : "bg-negative"
                }`}
              />
              {seg.label}
            </span>
            <span className="tabular font-medium">{format(seg.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
