"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { CalculatorCard } from "./CalculatorCard";
import type { CalculatorMeta } from "@/lib/calculators-meta";

export function CalculatorGrid({ calculators }: { calculators: CalculatorMeta[] }) {
  return (
    <motion.div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {calculators.map((calc) => (
        <CalculatorCard key={calc.slug} calc={calc} />
      ))}
    </motion.div>
  );
}
