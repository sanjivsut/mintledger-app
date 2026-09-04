/**
 * Currency catalogue used only for display formatting (symbol, decimal places)
 * via Intl.NumberFormat. Mintledger does no currency conversion and holds no
 * exchange rates.
 */

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "INR"
  | "JPY"
  | "CAD"
  | "AUD"
  | "SGD"
  | "CHF"
  | "CNY"
  | "AED"
  | "ZAR";

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  /** Fraction digits normally shown for this currency. */
  decimals: number;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: "USD", name: "US Dollar", symbol: "$", decimals: 2, flag: "🇺🇸" },
  EUR: { code: "EUR", name: "Euro", symbol: "€", decimals: 2, flag: "🇪🇺" },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", decimals: 2, flag: "🇬🇧" },
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹", decimals: 2, flag: "🇮🇳" },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥", decimals: 0, flag: "🇯🇵" },
  CAD: { code: "CAD", name: "Canadian Dollar", symbol: "C$", decimals: 2, flag: "🇨🇦" },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "A$", decimals: 2, flag: "🇦🇺" },
  SGD: { code: "SGD", name: "Singapore Dollar", symbol: "S$", decimals: 2, flag: "🇸🇬" },
  CHF: { code: "CHF", name: "Swiss Franc", symbol: "Fr", decimals: 2, flag: "🇨🇭" },
  CNY: { code: "CNY", name: "Chinese Yuan", symbol: "¥", decimals: 2, flag: "🇨🇳" },
  AED: { code: "AED", name: "UAE Dirham", symbol: "د.إ", decimals: 2, flag: "🇦🇪" },
  ZAR: { code: "ZAR", name: "South African Rand", symbol: "R", decimals: 2, flag: "🇿🇦" },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];
