/**
 * Locale-aware formatting via the platform Intl APIs only. No geolocation or
 * remote locale services — the caller passes the locale/currency explicitly.
 */

export function formatCurrency(
  value: number,
  currency = "USD",
  locale = "en-US",
  maximumFractionDigits = 0,
): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(value);
}

export function formatNumber(
  value: number,
  locale = "en-US",
  maximumFractionDigits = 2,
): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

export function formatPercent(
  fraction: number,
  locale = "en-US",
  maximumFractionDigits = 1,
): string {
  if (!Number.isFinite(fraction)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits,
  }).format(fraction);
}

/** "18 mo" / "1 yr 6 mo" for tenure chips. */
export function formatMonths(months: number): string {
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}
