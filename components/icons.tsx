/**
 * Icon-key → component map. The calculator catalogue stores a string key (which
 * is serializable across the RSC boundary); components resolve it to a Lucide
 * component through this map on whichever side they render.
 */

import {
  Banknote,
  Home,
  LineChart,
  PiggyBank,
  Receipt,
  Target,
  type LucideIcon,
} from "lucide-react";

export type IconKey =
  | "loan"
  | "mortgage"
  | "compound"
  | "retirement"
  | "tax"
  | "savings";

export const ICONS: Record<IconKey, LucideIcon> = {
  loan: Banknote,
  mortgage: Home,
  compound: LineChart,
  retirement: PiggyBank,
  tax: Receipt,
  savings: Target,
};
