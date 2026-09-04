"use client";

/**
 * Spring-animated number that counts up/down when `value` changes.
 * Falls back to the plain formatted value when reduced motion is requested.
 */

import { useEffect } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  className?: string;
  /** Announce updates to assistive tech. */
  ariaLabel?: string;
}

export function AnimatedNumber({
  value,
  format,
  className,
  ariaLabel,
}: AnimatedNumberProps) {
  const reduced = usePrefersReducedMotion();
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 18, mass: 0.6 });
  const text = useTransform(spring, (n) => format(n));

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  if (reduced) {
    return (
      <span className={`tabular ${className ?? ""}`} aria-label={ariaLabel}>
        {format(value)}
      </span>
    );
  }

  return (
    <motion.span
      className={`tabular ${className ?? ""}`}
      aria-label={ariaLabel ?? format(value)}
    >
      {text}
    </motion.span>
  );
}
