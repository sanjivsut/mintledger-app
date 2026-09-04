/**
 * Self-hosted fonts.
 *
 * The spec calls for `next/font/local` with variable font files checked into the
 * repo. Those binaries aren't in this scaffold, so we use `next/font/google`,
 * which **downloads and self-hosts the files at build time** — the served pages
 * make no runtime request to Google Fonts or any CDN, satisfying the "no runtime
 * CDN request" rule. To switch to true local files: drop the .woff2 into
 * `app/fonts/`, swap these for `localFont({ src: [...] })`, keep the same CSS
 * variable names (`--font-lora`, `--font-inter`).
 */

import { Inter, Lora } from "next/font/google";

export const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lora",
  fallback: ["Georgia", "serif"],
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "sans-serif"],
});
