"use client";

/** Client-only, lazily-loaded chart entrypoints. Keeps Recharts out of SSR. */

import dynamic from "next/dynamic";

const ChartSkeleton = () => (
  <div
    className="flex h-[280px] w-full items-center justify-center rounded-card bg-surface/60 text-xs text-text/40"
    role="status"
    aria-label="Loading chart"
  >
    Loading chart…
  </div>
);

export const GrowthAreaChart = dynamic(
  () => import("./Charts").then((m) => m.GrowthAreaChart),
  { ssr: false, loading: ChartSkeleton },
);

export const AmortizationChart = dynamic(
  () => import("./Charts").then((m) => m.AmortizationChart),
  { ssr: false, loading: ChartSkeleton },
);

export const ProjectionLineChart = dynamic(
  () => import("./Charts").then((m) => m.ProjectionLineChart),
  { ssr: false, loading: ChartSkeleton },
);

export const SavingsCurveChart = dynamic(
  () => import("./Charts").then((m) => m.SavingsCurveChart),
  { ssr: false, loading: ChartSkeleton },
);
