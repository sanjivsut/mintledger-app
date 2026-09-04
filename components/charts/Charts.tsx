"use client";

/**
 * Recharts wrappers. Imported through `next/dynamic({ ssr: false })` from the
 * calculator islands so the chart bundle is only fetched on interaction-capable
 * clients, never shipped in the server HTML.
 */

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  primary: "#4F9A72",
  positive: "#5FD3A1",
  negative: "#F19A8E",
  accent: "#FFD8B8",
  grid: "#EAF6EF",
  text: "#22262B",
};

const axisProps = {
  stroke: "#B9CFC2",
  tick: { fill: "#6b7280", fontSize: 11 },
  tickLine: false,
  // keep tick labels from colliding on narrow (mobile) charts
  interval: "preserveStartEnd" as const,
  minTickGap: 24,
};

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #EAF6EF",
  boxShadow: "0 8px 24px rgba(31,59,46,0.10)",
  fontSize: 12,
} as const;

function compact(n: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Stacked area: contributions vs. interest over time. */
export function GrowthAreaChart({
  data,
  currency = "USD",
}: {
  data: { year: number; contributions: number; interest: number }[];
  currency?: string;
}) {
  const money = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="gInterest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.positive} stopOpacity={0.45} />
            <stop offset="100%" stopColor={COLORS.positive} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={COLORS.grid} vertical={false} />
        <XAxis
          dataKey="year"
          {...axisProps}
          tickFormatter={(y) => `Yr ${y}`}
        />
        <YAxis {...axisProps} width={48} tickFormatter={compact} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name) => [
            money(value),
            name === "contributions" ? "Contributions" : "Interest",
          ]}
          labelFormatter={(y) => `Year ${y}`}
        />
        <Legend
          formatter={(v) => (v === "contributions" ? "Contributions" : "Interest")}
          wrapperStyle={{ fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="contributions"
          stackId="1"
          stroke={COLORS.primary}
          strokeWidth={2}
          fill="url(#gContrib)"
          animationDuration={700}
        />
        <Area
          type="monotone"
          dataKey="interest"
          stackId="1"
          stroke={COLORS.positive}
          strokeWidth={2}
          fill="url(#gInterest)"
          animationDuration={700}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Grouped bars: principal vs. interest paid each year, plus a balance line. */
export function AmortizationChart({
  data,
  currency = "USD",
}: {
  data: { year: number; principal: number; interest: number; balance: number }[];
  currency?: string;
}) {
  const money = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey="year" {...axisProps} tickFormatter={(y) => `Yr ${y}`} />
        <YAxis {...axisProps} width={48} tickFormatter={compact} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name) => [money(value), labelFor(name)]}
          labelFormatter={(y) => `Year ${y}`}
        />
        <Legend formatter={labelFor} wrapperStyle={{ fontSize: 12 }} />
        <Bar
          dataKey="principal"
          stackId="pay"
          fill={COLORS.primary}
          radius={[0, 0, 0, 0]}
          animationDuration={600}
        />
        <Bar
          dataKey="interest"
          stackId="pay"
          fill={COLORS.negative}
          radius={[3, 3, 0, 0]}
          animationDuration={600}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function labelFor(name: string | number) {
  const map: Record<string, string> = {
    principal: "Principal",
    interest: "Interest",
    balance: "Balance",
    real: "Today's money",
    nominal: "Nominal",
  };
  return map[String(name)] ?? String(name);
}

/** Two-line chart: nominal vs. inflation-adjusted balance. */
export function ProjectionLineChart({
  data,
  currency = "USD",
}: {
  data: { age: number; nominal: number; real: number }[];
  currency?: string;
}) {
  const money = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey="age" {...axisProps} tickFormatter={(a) => `${a}`} />
        <YAxis {...axisProps} width={48} tickFormatter={compact} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name) => [money(value), labelFor(name)]}
          labelFormatter={(a) => `Age ${a}`}
        />
        <Legend formatter={labelFor} wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="nominal"
          stroke={COLORS.primary}
          strokeWidth={2}
          dot={false}
          animationDuration={700}
        />
        <Line
          type="monotone"
          dataKey="real"
          stroke={COLORS.accent}
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          animationDuration={700}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Single balance curve toward a savings goal, with a target reference band. */
export function SavingsCurveChart({
  data,
  currency = "USD",
}: {
  data: { month: number; balance: number; deposited: number }[];
  currency?: string;
}) {
  const money = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={COLORS.grid} vertical={false} />
        <XAxis
          dataKey="month"
          {...axisProps}
          tickFormatter={(m) => (m % 12 === 0 ? `${m / 12}y` : "")}
        />
        <YAxis {...axisProps} width={48} tickFormatter={compact} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name) => [
            money(value),
            name === "balance" ? "Balance" : "Deposited",
          ]}
          labelFormatter={(m) => `Month ${m}`}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke={COLORS.primary}
          strokeWidth={2}
          fill="url(#gBalance)"
          animationDuration={700}
        />
        <Area
          type="monotone"
          dataKey="deposited"
          stroke={COLORS.accent}
          strokeWidth={2}
          strokeDasharray="4 4"
          fill="none"
          animationDuration={700}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
