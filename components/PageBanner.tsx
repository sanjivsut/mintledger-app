"use client";

/**
 * Decorative animated banner shown behind every page heading.
 *
 * 2–4 flat palette-coloured shapes drift on independent slow float loops,
 * staggered by per-shape duration/delay so they never move in sync. Motion is
 * wrapped in a reduced-motion check — with shapes frozen the layout still reads
 * as a finished banner.
 */

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

interface Shape {
  type: "coin" | "chip" | "bars";
  color: string;
  className: string;
  duration: number;
  delay: number;
  drift: number;
}

const SHAPES: Shape[] = [
  {
    type: "coin",
    color: "#FFD8B8", // accent
    className:
      "left-1 top-3 h-8 w-8 sm:left-[6%] sm:top-8 sm:h-12 sm:w-12",
    duration: 4.2,
    delay: 0,
    drift: 9,
  },
  {
    type: "bars",
    color: "#4F9A72", // primary
    className:
      "right-1 top-2 h-9 w-9 sm:right-[8%] sm:top-6 sm:h-14 sm:w-14",
    duration: 3.6,
    delay: 0.4,
    drift: 7,
  },
  {
    type: "chip",
    color: "#5FD3A1", // positive
    className:
      "hidden right-[22%] bottom-5 h-8 w-14 sm:block",
    duration: 4.8,
    delay: 0.8,
    drift: 10,
  },
  {
    type: "coin",
    color: "#F19A8E", // negative
    className:
      "hidden left-[20%] bottom-6 h-7 w-7 sm:block",
    duration: 4.5,
    delay: 0.2,
    drift: 6,
  },
];

function ShapeSvg({ type, color }: Pick<Shape, "type" | "color">) {
  if (type === "coin") {
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill={color} />
        <circle
          cx="20"
          cy="20"
          r="12"
          fill="none"
          stroke="#FAFAF7"
          strokeWidth="2"
          opacity="0.7"
        />
      </svg>
    );
  }
  if (type === "chip") {
    return (
      <svg viewBox="0 0 56 32" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="56" height="32" rx="12" fill={color} />
      </svg>
    );
  }
  // ledger bars — reuse of the logo glyph
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <rect x="4" y="14" width="3.5" height="7" rx="1" fill={color} />
      <rect x="10.2" y="9" width="3.5" height="12" rx="1" fill={color} />
      <rect x="16.5" y="4" width="3.5" height="17" rx="1" fill={color} />
    </svg>
  );
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** Optional slot under the subtitle (breadcrumb, CTAs). */
  children?: React.ReactNode;
}

export function PageBanner({
  title,
  subtitle,
  eyebrow,
  children,
}: PageBannerProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative isolate overflow-hidden rounded-card bg-background px-6 py-10 sm:px-10 sm:py-12">
      {/* decorative floating shapes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {SHAPES.map((shape, i) => (
          <motion.div
            key={i}
            className={`absolute ${shape.className}`}
            animate={
              reduced
                ? undefined
                : { y: [0, -shape.drift, 0] }
            }
            transition={
              reduced
                ? undefined
                : {
                    duration: shape.duration,
                    delay: shape.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <ShapeSvg type={shape.type} color={shape.color} />
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        {subtitle ? (
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text/70 sm:text-base">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </div>
  );
}
