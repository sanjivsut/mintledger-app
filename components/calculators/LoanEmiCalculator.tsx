"use client";

/**
 * Loan / EMI calculator island — the reference implementation.
 *
 * RHF + Zod own the input state; `useDeferredValue` keeps slider recalcs smooth;
 * calculation is the pure `computeLoan` from lib. Chart is lazy-loaded.
 */

import { useDeferredValue, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { loanSchema, type LoanForm } from "@/lib/calculators/schemas";
import { computeLoan, toYearlySchedule } from "@/lib/calculators/loan";
import { formatCurrency, formatMonths, formatPercent } from "@/lib/format";
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

const DEFAULTS: LoanForm = { amount: 25000, annualRatePct: 8.5, months: 60 };

export function LoanEmiCalculator() {
  const { control, watch } = useForm<LoanForm>({
    resolver: zodResolver(loanSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [showTable, setShowTable] = useState(false);

  const raw = watch();
  const deferred = useDeferredValue(raw);

  const result = useMemo(
    () =>
      computeLoan({
        amount: Number(deferred.amount) || 0,
        annualRatePct: Number(deferred.annualRatePct) || 0,
        months: Number(deferred.months) || 1,
      }),
    [deferred.amount, deferred.annualRatePct, deferred.months],
  );

  const yearly = useMemo(
    () => toYearlySchedule(result.schedule),
    [result.schedule],
  );

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
            <PanelTitle>Loan details</PanelTitle>

            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <RangeSlider
                  label="Loan amount"
                  value={field.value}
                  min={1000}
                  max={1_000_000}
                  step={1000}
                  onChange={field.onChange}
                  format={(v) => money(v)}
                />
              )}
            />

            <Controller
              control={control}
              name="annualRatePct"
              render={({ field }) => (
                <RangeSlider
                  label="Interest rate (annual)"
                  value={field.value}
                  min={0}
                  max={30}
                  step={0.1}
                  onChange={field.onChange}
                  format={(v) => `${v.toFixed(1)}%`}
                />
              )}
            />

            <Controller
              control={control}
              name="months"
              render={({ field }) => (
                <RangeSlider
                  label="Tenure"
                  value={field.value}
                  min={6}
                  max={360}
                  step={6}
                  onChange={field.onChange}
                  format={(v) => formatMonths(v)}
                  hint={formatMonths(field.value)}
                />
              )}
            />
          </div>
        }
        results={
          <div className="space-y-6">
            <PanelTitle>Monthly payment</PanelTitle>
            <HeroResult
              label="EMI per month"
              value={result.emi}
              format={money2}
              sublabel={`${formatMonths(Number(deferred.months) || 0)} · ${formatPercent(
                (Number(deferred.annualRatePct) || 0) / 100,
                "en-US",
                2,
              )} APR`}
            />

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <StatChip label="Principal" value={result.principal} format={money} tone="positive" />
              <StatChip label="Interest" value={result.totalInterest} format={money} tone="negative" />
              <StatChip label="Total paid" value={result.totalPayment} format={money} />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text/50">
                Where your money goes
              </p>
              <BreakdownBar
                segments={[
                  { label: "Principal", value: result.principal, tone: "principal" },
                  { label: "Interest", value: result.totalInterest, tone: "interest" },
                ]}
                format={money}
              />
            </div>
          </div>
        }
      />

      <div className="card-result mt-4 p-4 sm:mt-6 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primaryDark">
            Amortization by year
          </h3>
          <button
            type="button"
            onClick={() => setShowTable((s) => !s)}
            className="text-xs font-medium text-primary hover:text-primaryDark"
          >
            {showTable ? "Hide table" : "Show full table"}
          </button>
        </div>

        <div className="mt-4">
          <AmortizationChart data={yearly} currency={currency} />
        </div>

        {showTable ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 overflow-x-auto"
          >
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-text/50">
                  <th className="py-2 pr-4 font-medium">Year</th>
                  <th className="py-2 pr-4 font-medium">Principal</th>
                  <th className="py-2 pr-4 font-medium">Interest</th>
                  <th className="py-2 pr-4 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {yearly.map((row) => (
                  <tr key={row.year}>
                    <td className="py-2 pr-4">{row.year}</td>
                    <td className="tabular py-2 pr-4">{money(row.principal)}</td>
                    <td className="tabular py-2 pr-4 text-interest-text">
                      {money(row.interest)}
                    </td>
                    <td className="tabular py-2 pr-4">{money(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : null}
      </div>

      <ScenarioCompare
        calculatorKey="loan-emi"
        currentInput={raw}
        currentHeadline={[
          { label: "EMI / month", value: money2(result.emi) },
          { label: "Total interest", value: money(result.totalInterest) },
          { label: "Total paid", value: money(result.totalPayment) },
          {
            label: "Loan",
            value: `${money(Number(raw.amount) || 0)} @ ${Number(raw.annualRatePct).toFixed(1)}%`,
          },
        ]}
      />

      <div className="mt-6 max-w-md">
        <ShareableSummary
          calculatorName="Loan EMI calculator"
          headline={{ label: "EMI per month", value: money2(result.emi) }}
          rows={[
            { label: "Loan amount", value: money(result.principal), tone: "positive" },
            { label: "Total interest", value: money(result.totalInterest), tone: "negative" },
            { label: "Total of payments", value: money(result.totalPayment) },
            { label: "Tenure", value: formatMonths(Number(raw.months) || 0) },
          ]}
        />
      </div>
    </div>
  );
}
