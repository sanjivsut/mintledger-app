import { ImageResponse } from "next/og";

// Rendered by Next's built-in OG image generation (no external service).
export const alt = "Mintledger — free, private financial calculators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#FAFAF7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "#4F9A72",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <div style={{ width: 12, height: 24, borderRadius: 4, background: "#FAFAF7" }} />
              <div style={{ width: 12, height: 40, borderRadius: 4, background: "#FAFAF7" }} />
              <div style={{ width: 12, height: 56, borderRadius: 4, background: "#FAFAF7" }} />
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#1F3B2E" }}>
            <span>mint</span>
            <span style={{ color: "#4F9A72" }}>ledger</span>
          </div>
        </div>
        <div style={{ marginTop: 40, fontSize: 44, color: "#22262B", maxWidth: 900 }}>
          Free, private financial calculators
        </div>
        <div style={{ marginTop: 16, fontSize: 26, color: "#4F9A72" }}>
          Loans · Mortgage · Compound interest · Retirement · Tax · Savings
        </div>
      </div>
    ),
    size,
  );
}
