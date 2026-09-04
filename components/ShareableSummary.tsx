"use client";

/**
 * Client-side shareable/printable summary card. The PNG is drawn by hand on a
 * <canvas> with the 2D API — no html2canvas, no external image service.
 */

import { useCallback, useRef } from "react";
import { Download, Printer } from "lucide-react";

export interface SummaryRow {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}

interface ShareableSummaryProps {
  calculatorName: string;
  headline: { label: string; value: string };
  rows: SummaryRow[];
}

const PALETTE = {
  bg: "#FAFAF7",
  surface: "#EAF6EF",
  primary: "#4F9A72",
  primaryDark: "#1F3B2E",
  text: "#22262B",
  positive: "#3f9f78",
  negative: "#c0584a",
};

export function ShareableSummary({
  calculatorName,
  headline,
  rows,
}: ShareableSummaryProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadPng = useCallback(() => {
    const scale = 2;
    const w = 640;
    const h = 200 + rows.length * 46 + 72;
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);

    // background
    ctx.fillStyle = PALETTE.bg;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = PALETTE.surface;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // logo mark
    roundRect(ctx, 32, 30, 30, 30, 8);
    ctx.fillStyle = PALETTE.primary;
    ctx.fill();
    ctx.fillStyle = PALETTE.bg;
    ctx.fillRect(39, 46, 4, 8);
    ctx.fillRect(46, 41, 4, 13);
    ctx.fillRect(53, 36, 4, 18);

    ctx.fillStyle = PALETTE.primaryDark;
    ctx.font = "600 20px Georgia, serif";
    ctx.fillText("mintledger", 74, 51);

    ctx.fillStyle = "rgba(34,38,43,0.55)";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(calculatorName, 32, 92);

    // headline
    ctx.fillStyle = "rgba(34,38,43,0.5)";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(headline.label.toUpperCase(), 32, 120);
    ctx.fillStyle = PALETTE.primaryDark;
    ctx.font = "italic 600 40px Georgia, serif";
    ctx.fillText(headline.value, 32, 162);

    // rows
    let y = 200;
    ctx.font = "14px system-ui, sans-serif";
    rows.forEach((row) => {
      ctx.fillStyle = "rgba(34,38,43,0.7)";
      ctx.textAlign = "left";
      ctx.fillText(row.label, 32, y);
      ctx.fillStyle =
        row.tone === "positive"
          ? PALETTE.positive
          : row.tone === "negative"
            ? PALETTE.negative
            : PALETTE.text;
      ctx.textAlign = "right";
      ctx.font = "600 14px system-ui, sans-serif";
      ctx.fillText(row.value, w - 32, y);
      ctx.font = "14px system-ui, sans-serif";
      ctx.textAlign = "left";
      y += 46;
    });

    ctx.fillStyle = "rgba(34,38,43,0.4)";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText("Generated with Mintledger · estimates only, not advice", 32, h - 28);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `mintledger-${slugify(calculatorName)}.png`;
    a.click();
  }, [calculatorName, headline, rows]);

  return (
    <div>
      <div
        ref={cardRef}
        className="print-summary rounded-card border border-surface bg-background p-5"
      >
        <p className="text-xs text-text/50">{calculatorName}</p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-text/50">
          {headline.label}
        </p>
        <p className="font-heading text-3xl font-semibold italic text-primaryDark">
          {headline.value}
        </p>
        <dl className="mt-4 space-y-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between text-sm"
            >
              <dt className="text-text/70">{row.label}</dt>
              <dd
                className={`tabular font-semibold ${
                  row.tone === "positive"
                    ? "text-primary"
                    : row.tone === "negative"
                      ? "text-interest-text"
                      : "text-text"
                }`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 print:hidden">
        <button type="button" onClick={downloadPng} className="btn-secondary">
          <Download className="h-4 w-4" /> Download PNG
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-secondary"
        >
          <Printer className="h-4 w-4" /> Print
        </button>
      </div>
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
