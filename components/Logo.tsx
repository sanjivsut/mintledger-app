/**
 * Mintledger lockup: icon square + wordmark, sized as one unit.
 *
 * The icon square's side equals the wordmark font-size / line-height, so the
 * whole lockup scales from a single `size` prop. The bar glyph is inset to ~68%
 * of the square. Use the full lockup everywhere in-product; the icon alone is
 * reserved for the favicon / app icon.
 */

interface LogoProps {
  /** Font-size (px) of the wordmark; the icon square matches it. */
  size?: number;
  /** Render just the icon square (favicon contexts). */
  iconOnly?: boolean;
  className?: string;
}

export function LogoIcon({ size = 40 }: { size?: number }) {
  const glyph = Math.round(size * 0.68);
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.25),
      }}
      className="inline-flex shrink-0 items-center justify-center bg-primary"
    >
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 24 24"
        fill="none"
        role="img"
      >
        <rect x="4" y="14" width="3.5" height="7" rx="1" fill="#FAFAF7" />
        <rect x="10.2" y="9" width="3.5" height="12" rx="1" fill="#FAFAF7" />
        <rect x="16.5" y="4" width="3.5" height="17" rx="1" fill="#FAFAF7" />
      </svg>
    </span>
  );
}

export function Logo({ size = 28, iconOnly = false, className }: LogoProps) {
  if (iconOnly) return <LogoIcon size={size} />;

  return (
    <span
      className={`inline-flex items-center gap-3 ${className ?? ""}`}
    >
      <LogoIcon size={size} />
      <span
        className="font-heading font-semibold leading-none text-primaryDark"
        style={{ fontSize: size, lineHeight: `${size}px` }}
      >
        mint<span className="text-primary">ledger</span>
      </span>
    </span>
  );
}
