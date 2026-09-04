"use client";

/**
 * Comparison mode UI: "Save this scenario" plus a side-by-side table of up to
 * three saved scenarios. State lives in localStorage via useScenarios.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Trash2, Plus } from "lucide-react";
import { useScenarios, type Scenario } from "@/lib/useScenarios";

interface ScenarioCompareProps<TInput> {
  calculatorKey: string;
  currentInput: TInput;
  currentHeadline: { label: string; value: string }[];
}

export function ScenarioCompare<TInput>({
  calculatorKey,
  currentInput,
  currentHeadline,
}: ScenarioCompareProps<TInput>) {
  const { scenarios, hydrated, save, remove, clear, canSave } =
    useScenarios<TInput>(calculatorKey);
  const [justSaved, setJustSaved] = useState(false);

  if (!hydrated) return null;

  const handleSave = () => {
    save({
      name: `Scenario ${scenarios.length + 1}`,
      input: currentInput,
      headline: currentHeadline,
    });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1400);
  };

  const labels = currentHeadline.map((h) => h.label);

  return (
    <div className="mt-6 rounded-card border border-surface bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-primaryDark">
            Compare scenarios
          </h3>
          <p className="text-xs text-text/60">
            Saved on this device only — up to 3 at a time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {scenarios.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="text-xs font-medium text-text/60 hover:text-negative"
            >
              Clear all
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <AnimatePresence mode="wait" initial={false}>
              {justSaved ? (
                <motion.span
                  key="saved"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4" /> Saved
                </motion.span>
              ) : (
                <motion.span
                  key="save"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Save this scenario
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {scenarios.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-text/50">
                <th className="py-2 pr-4 font-medium">Metric</th>
                {scenarios.map((s) => (
                  <th key={s.id} className="py-2 pr-4 font-medium">
                    <div className="flex items-center gap-2">
                      {s.name}
                      <button
                        type="button"
                        onClick={() => remove(s.id)}
                        aria-label={`Remove ${s.name}`}
                        className="text-text/40 hover:text-negative"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface">
              {labels.map((label) => (
                <tr key={label}>
                  <td className="py-2.5 pr-4 text-text/70">{label}</td>
                  {scenarios.map((s: Scenario<TInput>) => (
                    <td
                      key={s.id}
                      className="tabular py-2.5 pr-4 font-medium text-primaryDark"
                    >
                      {s.headline.find((h) => h.label === label)?.value ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
