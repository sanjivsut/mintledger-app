"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { TAX_REGIONS, DEFAULT_TAX_REGION_ID } from "@/data/tax-brackets";
import { computeTax } from "@/lib/calculators/tax";
import { formatCurrency, formatPercent } from "@/lib/format";
import { RangeSlider } from "@/components/ui/RangeSlider";
import {
  CalcColumns,
  HeroResult,
  PanelTitle,
  StatChip,
} from "@/components/ui/CalcShell";
import { BreakdownBar } from "@/components/ui/BreakdownBar";
import { ScenarioCompare } from "@/components/ScenarioCompare";
import { ShareableSummary } from "@/components/ShareableSummary";

export function TaxEstimator() {
  const [regionId, setRegionId] = useState(DEFAULT_TAX_REGION_ID);
  const [gross, setGross] = useState(85000);

  const region = TAX_REGIONS.find((r) => r.id === regionId) ?? TAX_REGIONS[0];
  const input = { regionId, gross };
  const deferred = useDeferredValue(input);

  const result = useMemo(() => {
    const r = TAX_REGIONS.find((x) => x.id === deferred.regionId) ?? TAX_REGIONS[0];
    return computeTax(deferred.gross, r);
  }, [deferred]);

  const money = (n: number) => formatCurrency(n, region.currency, "en-US", 0);

  return (
    <div>
      <CalcColumns
        input={
          <div className="space-y-7">
            <PanelTitle>Income</PanelTitle>

            <label className="block text-sm">
              <span className="font-medium text-primaryDark">Region / schedule</span>
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-surface bg-white px-3 py-2 text-sm text-primaryDark focus:outline focus:outline-2 focus:outline-primary"
              >
                {TAX_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>

            <RangeSlider
              label="Gross annual income"
              value={gross}
              min={0}
              max={region.currency === "INR" ? 5_000_000 : 500_000}
              step={region.currency === "INR" ? 25_000 : 1000}
              onChange={setGross}
              format={money}
            />

            <p className="rounded-card bg-white px-3 py-2.5 text-xs text-text/60">
              {region.note}
            </p>
          </div>
        }
        results={
          <div className="space-y-6">
            <PanelTitle>Estimate</PanelTitle>
            <HeroResult
              label="Take-home pay"
              value={result.takeHome}
              format={money}
              sublabel={`${formatPercent(result.effectiveRate)} effective · ${formatPercent(result.marginalRate)} marginal`}
            />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <StatChip label="Gross" value={result.gross} format={money} tone="positive" />
              <StatChip label="Total tax" value={result.totalTax} format={money} tone="negative" />
              <StatChip label="Taxable" value={result.taxableIncome} format={money} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text/50">
                Keep vs. pay
              </p>
              <BreakdownBar
                segments={[
                  { label: "You keep", value: result.takeHome, tone: "principal" },
                  { label: "Tax", value: result.totalTax, tone: "interest" },
                ]}
                format={money}
              />
            </div>
          </div>
        }
      />

      <div className="card-result mt-4 p-4 sm:mt-6 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-primaryDark">Tax by bracket</h3>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-text/50">
              <th className="py-2 pr-4 font-medium">Rate</th>
              <th className="py-2 pr-4 font-medium">Income in band</th>
              <th className="py-2 pr-4 font-medium">Tax</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface">
            {result.perBracket.map((b, i) => (
              <tr key={i}>
                <td className="py-2 pr-4">{formatPercent(b.rate, "en-US", 0)}</td>
                <td className="tabular py-2 pr-4">{money(b.incomeInBand)}</td>
                <td className="tabular py-2 pr-4 text-interest-text">{money(b.tax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <ScenarioCompare
        calculatorKey="tax-estimator"
        currentInput={input}
        currentHeadline={[
          { label: "Take-home", value: money(result.takeHome) },
          { label: "Total tax", value: money(result.totalTax) },
          { label: "Effective rate", value: formatPercent(result.effectiveRate) },
          { label: "Region", value: region.label },
        ]}
      />

      <div className="mt-6 max-w-md">
        <ShareableSummary
          calculatorName="Take-home tax estimator"
          headline={{ label: "Take-home pay", value: money(result.takeHome) }}
          rows={[
            { label: "Gross income", value: money(result.gross), tone: "positive" },
            { label: "Total tax", value: money(result.totalTax), tone: "negative" },
            { label: "Effective rate", value: formatPercent(result.effectiveRate) },
            { label: "Marginal rate", value: formatPercent(result.marginalRate) },
          ]}
        />
      </div>
    </div>
  );
}
