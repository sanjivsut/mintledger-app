"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { computeMortgage } from "@/lib/calculators/mortgage";
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
import { AmortizationChart } from "@/components/charts/lazy";
import { ScenarioCompare } from "@/components/ScenarioCompare";
import { ShareableSummary } from "@/components/ShareableSummary";

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(420000);
  const [downPayment, setDownPayment] = useState(84000);
  const [annualRatePct, setRate] = useState(6.5);
  const [termYears, setTerm] = useState(30);
  const [propertyTaxPct, setTax] = useState(1.1);
  const [annualInsurance, setInsurance] = useState(1600);
  const [monthlyHoa, setHoa] = useState(0);
  const [includeEscrow, setEscrow] = useState(true);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const input = {
    homePrice,
    downPayment,
    annualRatePct,
    termYears,
    propertyTaxPct,
    annualInsurance,
    monthlyHoa,
    includeEscrow,
  };
  const deferred = useDeferredValue(input);
  const result = useMemo(() => computeMortgage(deferred), [deferred]);

  const money = (n: number) => formatCurrency(n, currency, "en-US", 0);
  const money2 = (n: number) => formatCurrency(n, currency, "en-US", 2);
  const downPct = homePrice > 0 ? downPayment / homePrice : 0;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CurrencyPicker value={currency} onChange={setCurrency} />
      </div>

      <CalcColumns
        input={
          <div className="space-y-7">
            <PanelTitle>Home &amp; loan</PanelTitle>
            <RangeSlider label="Home price" value={homePrice} min={50000} max={3_000_000} step={5000} onChange={setHomePrice} format={money} />
            <RangeSlider
              label="Down payment"
              value={downPayment}
              min={0}
              max={homePrice}
              step={1000}
              onChange={setDownPayment}
              format={money}
              hint={`${formatPercent(downPct, "en-US", 0)} down`}
            />
            <RangeSlider label="Interest rate" value={annualRatePct} min={0} max={15} step={0.05} onChange={setRate} format={(v) => `${v.toFixed(2)}%`} />
            <RangeSlider label="Term" value={termYears} min={5} max={40} step={1} onChange={setTerm} format={(v) => `${v} yr`} />

            <label className="flex items-center justify-between rounded-card bg-white px-3 py-2.5 text-sm">
              <span className="font-medium text-primaryDark">Include taxes &amp; insurance</span>
              <button
                type="button"
                role="switch"
                aria-checked={includeEscrow}
                onClick={() => setEscrow((v) => !v)}
                className={`relative h-6 w-11 rounded-pill transition ${includeEscrow ? "bg-primary" : "bg-surface"}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${includeEscrow ? "left-[22px]" : "left-0.5"}`}
                />
              </button>
            </label>

            {includeEscrow ? (
              <div className="space-y-7">
                <RangeSlider label="Property tax (annual)" value={propertyTaxPct} min={0} max={4} step={0.05} onChange={setTax} format={(v) => `${v.toFixed(2)}%`} />
                <RangeSlider label="Homeowners insurance (annual)" value={annualInsurance} min={0} max={12000} step={100} onChange={setInsurance} format={money} />
                <RangeSlider label="HOA / dues (monthly)" value={monthlyHoa} min={0} max={2000} step={25} onChange={setHoa} format={money} />
              </div>
            ) : null}
          </div>
        }
        results={
          <div className="space-y-6">
            <PanelTitle>Monthly payment</PanelTitle>
            <HeroResult
              label="Total monthly cost"
              value={result.totalMonthly}
              format={money2}
              sublabel={`${money(result.loanAmount)} financed over ${termYears} years`}
            />
            <div className="grid grid-cols-2 gap-2">
              <StatChip label="Principal & interest" value={result.principalAndInterest} format={money} tone="positive" />
              <StatChip label="Taxes" value={result.monthlyTax} format={money} tone="negative" />
              <StatChip label="Insurance" value={result.monthlyInsurance} format={money} tone="negative" />
              <StatChip label="HOA" value={result.monthlyHoa} format={money} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text/50">
                Lifetime principal vs. interest
              </p>
              <BreakdownBar
                segments={[
                  { label: "Principal", value: result.loanAmount, tone: "principal" },
                  { label: "Interest", value: result.totalInterest, tone: "interest" },
                ]}
                format={money}
              />
            </div>
          </div>
        }
      />

      <div className="card-result mt-4 p-4 sm:mt-6 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-primaryDark">
          Principal &amp; interest by year
        </h3>
        <AmortizationChart data={result.yearly} currency={currency} />
      </div>

      <ScenarioCompare
        calculatorKey="mortgage"
        currentInput={input}
        currentHeadline={[
          { label: "Monthly (all-in)", value: money2(result.totalMonthly) },
          { label: "P&I only", value: money2(result.principalAndInterest) },
          { label: "Total interest", value: money(result.totalInterest) },
          { label: "Home / down", value: `${money(homePrice)} / ${formatPercent(downPct, "en-US", 0)}` },
        ]}
      />

      <div className="mt-6 max-w-md">
        <ShareableSummary
          calculatorName="Mortgage calculator"
          headline={{ label: "Total monthly cost", value: money2(result.totalMonthly) }}
          rows={[
            { label: "Loan amount", value: money(result.loanAmount), tone: "positive" },
            { label: "Lifetime interest", value: money(result.totalInterest), tone: "negative" },
            { label: "Total of payments", value: money(result.totalOfPayments) },
            { label: "Term", value: `${termYears} years` },
          ]}
        />
      </div>
    </div>
  );
}
