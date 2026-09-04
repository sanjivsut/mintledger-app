"use client";

import { useEffect, useState } from "react";
import { canUseDOM } from "@/lib/can-use-dom";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NavItem {
  href: string;
  label: string;
}

export function MobileNav({
  nav,
  calculators,
}: {
  nav: NavItem[];
  calculators: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Defensive backstop for browser back/forward while the drawer is open —
  // every Link inside it already closes the drawer on click.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll and allow Escape to close while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const drawer = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] bg-primaryDark/30 backdrop-blur-sm md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.nav
            className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto bg-background p-6 shadow-card-hover"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-pill p-2 text-primaryDark hover:bg-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-card px-3 py-2.5 text-sm font-medium text-primaryDark hover:bg-surface"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Calculators
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {calculators.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-card px-3 py-2 text-sm text-text/80 hover:bg-surface hover:text-primaryDark"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/calculators/loan-emi"
              onClick={() => setOpen(false)}
              className="btn-primary mt-6"
            >
              Try a calculator
            </Link>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="rounded-pill p-2 text-primaryDark transition active:scale-95 hover:bg-surface"
      >
        <Menu className="h-5 w-5" />
      </button>

      {canUseDOM ? createPortal(drawer, document.body) : null}
    </div>
  );
}
