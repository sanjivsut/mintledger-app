"use client";

/** Presentational building blocks shared by the calculator islands. */

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";

export function CalcColumns({
  input,
  results,
}: {
  input: ReactNode;
  results: ReactNode;
}) {
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <div className="card-input p-4 sm:p-6">{input}</div>
      <div className="card-result p-4 sm:p-6">{results}</div>
    </div>
  );
}

export function PanelTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-5 text-lg font-semibold text-primaryDark">{children}</h2>
  );
}

export function HeroResult({
  label,
  value,
  format,
  sublabel,
}: {
  label: string;
  value: number;
  format: (n: number) => string;
  sublabel?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text/50">
        {label}
      </p>
      <div
        className="mt-1 break-words font-heading text-3xl font-semibold italic leading-tight text-primaryDark sm:text-4xl lg:text-5xl"
        aria-live="polite"
      >
        <AnimatedNumber value={value} format={format} ariaLabel={`${label}: ${format(value)}`} />
      </div>
      {sublabel ? (
        <p className="mt-1 text-xs text-text/50">{sublabel}</p>
      ) : null}
    </div>
  );
}

export function StatChip({
  label,
  value,
  format,
  tone = "neutral",
}: {
  label: string;
  value: number;
  format: (n: number) => string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "bg-surface text-primaryDark"
      : tone === "negative"
        ? "bg-interest-bg text-interest-text"
        : "bg-background text-text/80";
  return (
    <div className={`min-w-0 rounded-card px-3 py-2.5 ${toneClass}`}>
      <p className="truncate text-[11px] font-medium uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="tabular mt-0.5 break-words text-sm font-semibold">
        <AnimatedNumber value={value} format={format} />
      </p>
    </div>
  );
}

export function SuccessPop({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-positive text-white"
      aria-hidden="true"
    >
      ✓
    </motion.span>
  );
}
