"use client";

/**
 * Comparison mode: save up to 3 named scenarios per calculator to localStorage
 * (no backend). Each scenario stores the raw inputs plus a few headline numbers
 * for the side-by-side table.
 */

import { useCallback, useEffect, useState } from "react";

export interface Scenario<TInput = Record<string, number | string | boolean>> {
  id: string;
  name: string;
  savedAt: number;
  input: TInput;
  headline: { label: string; value: string }[];
}

const MAX = 3;

export function useScenarios<TInput>(calculatorKey: string) {
  const storageKey = `mintledger:scenarios:${calculatorKey}`;
  const [scenarios, setScenarios] = useState<Scenario<TInput>[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // One-time hydration read: localStorage doesn't exist during server
  // rendering, so this has to happen after mount to avoid a markup mismatch —
  // there's no snapshot-based alternative that dodges the effect here (unlike
  // the DOM-availability check in MobileNav, the *content* genuinely differs
  // between the empty first render and the real data).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setScenarios(JSON.parse(raw));
    } catch {
      /* private mode / disabled storage — start empty */
    }
    setHydrated(true);
  }, [storageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const persist = useCallback(
    (next: Scenario<TInput>[]) => {
      setScenarios(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  const save = useCallback(
    (scenario: Omit<Scenario<TInput>, "id" | "savedAt">) => {
      const entry: Scenario<TInput> = {
        ...scenario,
        id: crypto.randomUUID(),
        savedAt: Date.now(),
      };
      persist([entry, ...scenarios].slice(0, MAX));
    },
    [persist, scenarios],
  );

  const remove = useCallback(
    (id: string) => persist(scenarios.filter((s) => s.id !== id)),
    [persist, scenarios],
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { scenarios, hydrated, save, remove, clear, canSave: scenarios.length < MAX };
}
