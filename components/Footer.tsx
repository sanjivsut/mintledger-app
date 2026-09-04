import Link from "next/link";
import { Logo } from "./Logo";
import { CALCULATORS } from "@/lib/calculators-meta";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-surface bg-surface/40">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo size={22} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text/70">
            Free, private financial calculators. No accounts, no tracking — what
            you type stays on your screen.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-primaryDark">Calculators</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CALCULATORS.slice(0, 4).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/calculators/${c.slug}`}
                  className="text-text/70 transition hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-primaryDark">More</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CALCULATORS.slice(4).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/calculators/${c.slug}`}
                  className="text-text/70 transition hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-primaryDark">Site</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/calculators"
                className="text-text/70 transition hover:text-primary"
              >
                All calculators
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-text/70 transition hover:text-primary"
              >
                About Mintledger
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-text/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Mintledger. For learning only — not financial advice.</p>
          <p>All rates and results are examples, not a live feed.</p>
        </div>
      </div>
    </footer>
  );
}
