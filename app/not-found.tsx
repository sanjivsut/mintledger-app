import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";

export default function NotFound() {
  return (
    <div className="container-page py-8">
      <PageBanner
        eyebrow="404"
        title="That page isn't in the ledger"
        subtitle="The link may be old or mistyped. Try the calculator hub instead."
      >
        <Link href="/calculators" className="btn-primary">
          Go to the calculators
        </Link>
      </PageBanner>
    </div>
  );
}
