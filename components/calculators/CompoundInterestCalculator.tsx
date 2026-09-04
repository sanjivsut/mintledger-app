"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { computeCompound } from "@/lib/calculators/compound";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { CurrencyCode } from "@/data/currencies";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { CurrencyPicker } from "@/components/ui/CurrencyPicker";
import {
  CalcColumns,
  HeroResult,
  PanelTitle,
  StatChip,
} from "@/components/ui/CalcShell";
import { BreakdownBar } from "@/components/ui/BreakdownBar";
import { GrowthAreaChart } from "@/components/charts/lazy";
import { ScenarioCompare } from "@/components/ScenarioCompare";
import { ShareableSummary } from "@/components/ShareableSummary";

export function CompoundInterestCalculator() {
  const [initialAmount, setInitial] = useState(5000);
  const [monthlyContribution, setMonthly] = useState(400);
  const [annualRatePct, setRate] = useState(9);
  const [years, setYears] = useState(20);
  const [annualStepUpPct, setStepUp] = useState(5);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const input = { initialAmount, monthlyContribution, annualRatePct, years, annualStepUpPct };
  const deferred = useDeferredValue(input);
  const result = useMemo(() => computeCompound(deferred), [deferred]);

  const money = (n: number) => formatCurrency(n, currency, "en-US", 0);
  const chartData = result.series.filter((p) => p.year > 0);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CurrencyPicker value={currency} onChange={setCurrency} />
      </div>

      <CalcColumns
        input={
          <div className="space-y-7">
            <PanelTitle>Your plan</PanelTitle>
            <RangeSlider label="Starting amount" value={initialAmount} min={0} max={500000} step={500} onChange={setInitial} format={money} />
            <RangeSlider label="Monthly contribution" value={monthlyContribution} min={0} max={20000} step={50} onChange={setMonthly} format={money} />
            <RangeSlider label="Expected annual return" value={annualRatePct} min={0} max={20} step={0.25} onChange={setRate} format={(v) => `${v.toFixed(2)}%`} />
            <RangeSlider label="Years invested" value={years} min={1} max={50} step={1} onChange={setYears} format={(v) => `${v} yr`} />
            <RangeSlider label="Annual contribution step-up" value={annualStepUpPct} min={0} max={20} step={1} onChange={setStepUp} format={(v) => `${v}%`} hint="Raises your deposit each year" />
          </div>
        }
        results={
          <div className="space-y-6">
            <PanelTitle>Projected value</PanelTitle>
            <HeroResult
              label={`Balance after ${years} years`}
              value={result.futureValue}
              format={money}
              sublabel={`${formatPercent(annualRatePct / 100, "en-US", 2)} return, compounded monthly`}
            />
            <div className="grid grid-cols-2 gap-2">
              <StatChip label="You contributed" value={result.totalContributions} format={money} tone="positive" />
              <StatChip label="Interest earned" value={result.totalInterest} format={money} tone="negative" />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text/50">
                Contributions vs. growth
              </p>
              <BreakdownBar
                segments={[
                  { label: "Contributions", value: result.totalContributions, tone: "principal" },
                  { label: "Interest", value: result.totalInterest, tone: "interest" },
                ]}
                format={money}
              />
            </div>
          </div>
        }
      />

      <div className="card-result mt-4 p-4 sm:mt-6 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-primaryDark">Growth curve</h3>
        <GrowthAreaChart data={chartData} currency={currency} />
      </div>

      <ScenarioCompare
        calculatorKey="compound-interest"
        currentInput={input}
        currentHeadline={[
          { label: "Future value", value: money(result.futureValue) },
          { label: "Contributed", value: money(result.totalContributions) },
          { label: "Interest", value: money(result.totalInterest) },
          { label: "Plan", value: `${money(monthlyContribution)}/mo · ${years}y @ ${annualRatePct}%` },
        ]}
      />

      <div className="mt-6 max-w-md">
        <ShareableSummary
          calculatorName="Compound interest calculator"
          headline={{ label: `Balance after ${years} years`, value: money(result.futureValue) }}
          rows={[
            { label: "Total contributions", value: money(result.totalContributions), tone: "positive" },
            { label: "Interest earned", value: money(result.totalInterest), tone: "negative" },
            { label: "Monthly contribution", value: money(monthlyContribution) },
            { label: "Assumed return", value: `${annualRatePct}%` },
          ]}
        />
      </div>
    </div>
  );
}
