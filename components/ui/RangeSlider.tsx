"use client";

/**
 * Labelled range slider paired with a number input. Keyboard-navigable (the
 * native <input type="range"> handles arrows/home/end); the thumb gets a subtle
 * scale + glow on interaction via CSS in globals is avoided — styled inline here
 * so the component is self-contained.
 */

import { useId } from "react";

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Formats the value shown in the pill on the right. */
  format?: (value: number) => string;
  suffix?: string;
  hint?: string;
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  hint,
}: RangeSliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 sm:gap-3">
        <label
          htmlFor={id}
          className="min-w-0 flex-1 text-sm font-medium text-primaryDark"
        >
          {label}
        </label>
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
          aria-label={`${label} exact value`}
          className="w-24 shrink-0 rounded-lg border border-surface bg-white px-2 py-1 text-right text-sm tabular text-primaryDark focus:outline focus:outline-2 focus:outline-primary sm:w-28"
        />
      </div>

      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-pill bg-white outline-none
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(79,154,114,0.18)]
          [&::-webkit-slider-thumb]:transition [&::-webkit-slider-thumb]:duration-150
          hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary"
        style={{
          background: `linear-gradient(to right, #4F9A72 0%, #4F9A72 ${pct}%, #ffffff ${pct}%, #ffffff 100%)`,
        }}
      />

      <div className="mt-1.5 flex justify-between text-xs text-text/50">
        <span>{format ? format(min) : min}</span>
        {hint ? <span className="text-text/60">{hint}</span> : null}
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}
