/** Sticky server-rendered header. The only client bit is the mobile menu. */

import Link from "next/link";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { CALCULATORS } from "@/lib/calculators-meta";

const NAV = [
  { href: "/calculators", label: "Calculators" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface/80 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Mintledger home" className="shrink-0">
          <Logo size={24} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-pill px-3 py-2 text-sm font-medium text-text/80 transition hover:bg-surface hover:text-primaryDark"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/calculators/loan-emi" className="btn-primary ml-2">
            Try a calculator
          </Link>
        </nav>

        <MobileNav
          nav={NAV}
          calculators={CALCULATORS.map((c) => ({
            href: `/calculators/${c.slug}`,
            label: c.shortName,
          }))}
        />
      </div>
    </header>
  );
}
