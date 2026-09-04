"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { ICONS } from "@/components/icons";
import type { CalculatorMeta } from "@/lib/calculators-meta";

export function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  const Icon = ICONS[calc.icon];
  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/calculators/${calc.slug}`}
        className="group flex h-full flex-col rounded-card border border-surface bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div className="flex items-start justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-card bg-surface text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <ArrowUpRight className="h-5 w-5 text-text/30 transition group-hover:text-primary" />
        </div>
        <h3 className="mt-4 text-lg">{calc.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-text/70">
          {calc.tagline}
        </p>
        <span className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {calc.category}
        </span>
      </Link>
    </motion.div>
  );
}
