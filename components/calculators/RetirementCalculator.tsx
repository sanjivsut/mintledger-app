"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { computeRetirement } from "@/lib/calculators/retirement";
import { formatCurrency } from "@/lib/format";
import type { CurrencyCode } from "@/data/currencies";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { CurrencyPicker } from "@/components/ui/CurrencyPicker";
import {
  CalcColumns,
  HeroResult,
  PanelTitle,
  StatChip,
} from "@/components/ui/CalcShell";
import { ProjectionLineChart } from "@/components/charts/lazy";
import { ScenarioCompare } from "@/components/ScenarioCompare";
import { ShareableSummary } from "@/components/ShareableSummary";

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(32);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  const [currentSavings, setCurrentSavings] = useState(45000);
  const [monthlyContribution, setMonthly] = useState(900);
  const [annualReturnPct, setReturn] = useState(6.5);
  const [annualInflationPct, setInflation] = useState(2.5);
  const [desiredAnnualSpending, setSpending] = useState(55000);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const input = {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    annualReturnPct,
    annualInflationPct,
    desiredAnnualSpending,
  };
  const deferred = useDeferredValue(input);
  const result = useMemo(() => computeRetirement(deferred), [deferred]);

  const money = (n: number) => formatCurrency(n, currency, "en-US", 0);
  const chartData = result.series.map((p) => ({
    age: p.age,
    nominal: p.balanceNominal,
    real: p.balanceReal,
  }));

  const lasts = result.moneyRunsOutAge === null;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CurrencyPicker value={currency} onChange={setCurrency} />
      </div>

      <CalcColumns
        input={
          <div className="space-y-7">
            <PanelTitle>Where you stand</PanelTitle>
            <RangeSlider label="Current age" value={currentAge} min={18} max={70} step={1} onChange={setCurrentAge} format={(v) => `${v}`} />
            <RangeSlider label="Retirement age" value={retirementAge} min={Math.max(currentAge + 1, 45)} max={80} step={1} onChange={setRetirementAge} format={(v) => `${v}`} />
            <RangeSlider label="Plan until age" value={lifeExpectancy} min={retirementAge + 1} max={105} step={1} onChange={setLifeExpectancy} format={(v) => `${v}`} />
            <RangeSlider label="Current savings" value={currentSavings} min={0} max={2_000_000} step={1000} onChange={setCurrentSavings} format={money} />
            <RangeSlider label="Monthly contribution" value={monthlyContribution} min={0} max={10000} step={50} onChange={setMonthly} format={money} />
            <RangeSlider label="Expected return" value={annualReturnPct} min={0} max={12} step={0.25} onChange={setReturn} format={(v) => `${v.toFixed(2)}%`} />
            <RangeSlider label="Inflation" value={annualInflationPct} min={0} max={8} step={0.25} onChange={setInflation} format={(v) => `${v.toFixed(2)}%`} />
            <RangeSlider label="Desired spending / year (today's money)" value={desiredAnnualSpending} min={10000} max={300000} step={1000} onChange={setSpending} format={money} />
          </div>
        }
        results={
          <div className="space-y-6">
            <PanelTitle>Projection</PanelTitle>
            <HeroResult
              label="Nest egg at retirement"
              value={result.nestEggAtRetirement}
              format={money}
              sublabel={`${money(result.nestEggAtRetirementReal)} in today's money`}
            />
            <div className="grid grid-cols-2 gap-2">
              <StatChip label="First-year withdrawal" value={result.firstYearWithdrawal} format={money} />
              <StatChip label="Years saving" value={result.yearsOfSavings} format={(v) => `${v}`} />
            </div>
            <div
              className={`rounded-card px-4 py-3 text-sm ${
                lasts ? "bg-surface text-primaryDark" : "bg-interest-bg text-interest-text"
              }`}
            >
              {lasts ? (
                <>
                  On these assumptions your savings last through age {lifeExpectancy}
                  {result.surplusOrShortfall > 0
                    ? `, with about ${money(result.surplusOrShortfall)} left over.`
                    : "."}
                </>
              ) : (
                <>Heads up — savings run out around age {result.moneyRunsOutAge}. Try saving more, spending less, or retiring later.</>
              )}
            </div>
          </div>
        }
      />

      <div className="card-result mt-4 p-4 sm:mt-6 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-primaryDark">
          Balance over time — nominal vs. today&apos;s money
        </h3>
        <ProjectionLineChart data={chartData} currency={currency} />
      </div>

      <ScenarioCompare
        calculatorKey="retirement"
        currentInput={input}
        currentHeadline={[
          { label: "Nest egg", value: money(result.nestEggAtRetirement) },
          { label: "In today's money", value: money(result.nestEggAtRetirementReal) },
          { label: "Lasts to", value: lasts ? `${lifeExpectancy}+` : `${result.moneyRunsOutAge}` },
          { label: "Saving", value: `${money(monthlyContribution)}/mo to ${retirementAge}` },
        ]}
      />

      <div className="mt-6 max-w-md">
        <ShareableSummary
          calculatorName="Retirement calculator"
          headline={{ label: "Nest egg at retirement", value: money(result.nestEggAtRetirement) }}
          rows={[
            { label: "In today's money", value: money(result.nestEggAtRetirementReal) },
            { label: "First-year withdrawal", value: money(result.firstYearWithdrawal) },
            {
              label: "Outlook",
              value: lasts ? `Lasts past ${lifeExpectancy}` : `Runs out at ${result.moneyRunsOutAge}`,
              tone: lasts ? "positive" : "negative",
            },
          ]}
        />
      </div>
    </div>
  );
}
