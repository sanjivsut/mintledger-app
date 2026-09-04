"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { solveMonthlyDeposit } from "@/lib/calculators/savings";
import { formatCurrency, formatMonths } from "@/lib/format";
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
import { SavingsCurveChart } from "@/components/charts/lazy";
import { ScenarioCompare } from "@/components/ScenarioCompare";
import { ShareableSummary } from "@/components/ShareableSummary";

export function SavingsGoalCalculator() {
  const [goalAmount, setGoal] = useState(30000);
  const [currentSavings, setCurrent] = useState(4000);
  const [annualRatePct, setRate] = useState(4);
  const [months, setMonths] = useState(36);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const input = { goalAmount, currentSavings, annualRatePct, months };
  const deferred = useDeferredValue(input);
  const result = useMemo(() => solveMonthlyDeposit(deferred), [deferred]);

  const money = (n: number) => formatCurrency(n, currency, "en-US", 0);
  const money2 = (n: number) => formatCurrency(n, currency, "en-US", 2);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CurrencyPicker value={currency} onChange={setCurrency} />
      </div>

      <CalcColumns
        input={
          <div className="space-y-7">
            <PanelTitle>Your goal</PanelTitle>
            <RangeSlider label="Target amount" value={goalAmount} min={500} max={1_000_000} step={500} onChange={setGoal} format={money} />
            <RangeSlider label="Saved so far" value={currentSavings} min={0} max={goalAmount} step={250} onChange={setCurrent} format={money} />
            <RangeSlider label="Interest rate (annual)" value={annualRatePct} min={0} max={12} step={0.1} onChange={setRate} format={(v) => `${v.toFixed(1)}%`} />
            <RangeSlider label="Time to goal" value={months} min={3} max={240} step={1} onChange={setMonths} format={(v) => formatMonths(v)} hint={formatMonths(months)} />
          </div>
        }
        results={
          <div className="space-y-6">
            <PanelTitle>Monthly deposit needed</PanelTitle>
            <HeroResult
              label="Deposit each month"
              value={result.requiredMonthlyDeposit}
              format={money2}
              sublabel={`to reach ${money(goalAmount)} in ${formatMonths(months)}`}
            />
            <div className="grid grid-cols-2 gap-2">
              <StatChip label="You'll deposit" value={result.totalDeposited} format={money} tone="positive" />
              <StatChip label="Interest earned" value={result.interestEarned} format={money} tone="negative" />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text/50">
                Your money vs. interest
              </p>
              <BreakdownBar
                segments={[
                  { label: "Deposited", value: result.totalDeposited, tone: "principal" },
                  { label: "Interest", value: result.interestEarned, tone: "interest" },
                ]}
                format={money}
              />
            </div>
          </div>
        }
      />

      <div className="card-result mt-4 p-4 sm:mt-6 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-primaryDark">Balance to goal</h3>
        <SavingsCurveChart data={result.series} currency={currency} />
      </div>

      <ScenarioCompare
        calculatorKey="savings-goal"
        currentInput={input}
        currentHeadline={[
          { label: "Monthly deposit", value: money2(result.requiredMonthlyDeposit) },
          { label: "Total deposited", value: money(result.totalDeposited) },
          { label: "Interest earned", value: money(result.interestEarned) },
          { label: "Goal", value: `${money(goalAmount)} in ${formatMonths(months)}` },
        ]}
      />

      <div className="mt-6 max-w-md">
        <ShareableSummary
          calculatorName="Savings goal calculator"
          headline={{ label: "Deposit each month", value: money2(result.requiredMonthlyDeposit) }}
          rows={[
            { label: "Target", value: money(goalAmount) },
            { label: "Total you deposit", value: money(result.totalDeposited), tone: "positive" },
            { label: "Interest earned", value: money(result.interestEarned), tone: "negative" },
            { label: "Timeframe", value: formatMonths(months) },
          ]}
        />
      </div>
    </div>
  );
}
