import Link from "next/link";
import { ICONS } from "@/components/icons";
import { relatedCalculators, type CalculatorSlug } from "@/lib/calculators-meta";

/** Server-rendered "related calculators" list for the calculator sidebar. */
export function RelatedCalculators({ slug }: { slug: CalculatorSlug }) {
  const related = relatedCalculators(slug);

  return (
    <aside aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-sm font-semibold text-primaryDark">
        Related calculators
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {related.map((calc) => {
          const Icon = ICONS[calc.icon];
          return (
            <li key={calc.slug}>
              <Link
                href={`/calculators/${calc.slug}`}
                className="flex items-center gap-3 rounded-card border border-surface bg-white p-3 text-sm shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-medium text-primaryDark">{calc.shortName}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
