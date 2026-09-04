"use client";

/** Display-currency picker. Affects Intl formatting only — no rate maths here. */

import { CURRENCIES, CURRENCY_CODES, type CurrencyCode } from "@/data/currencies";

export function CurrencyPicker({
  value,
  onChange,
  label = "Display currency",
}: {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-medium text-primaryDark">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        className="rounded-lg border border-surface bg-white px-2 py-1 text-sm text-primaryDark focus:outline focus:outline-2 focus:outline-primary"
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code}>
            {CURRENCIES[code].flag} {code}
          </option>
        ))}
      </select>
    </label>
  );
}
