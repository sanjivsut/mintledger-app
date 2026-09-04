import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter, lora } from "./fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const SITE_URL = "https://mintledger.example";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAFAF7",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mintledger — Free financial calculators",
    template: "%s — Mintledger",
  },
  description:
    "Free, private financial and banking calculators: loan EMI, mortgage, compound interest, retirement, tax and savings goals. Simple sliders, instant results, and plain-English explanations. All figures are examples, not live rates.",
  applicationName: "Mintledger",
  keywords: [
    "financial calculator",
    "loan calculator",
    "EMI calculator",
    "mortgage calculator",
    "compound interest calculator",
    "retirement calculator",
  ],
  openGraph: {
    type: "website",
    siteName: "Mintledger",
    title: "Mintledger — Free financial calculators",
    description:
      "Loan, mortgage, compound interest, retirement and tax calculators. Private and free. All figures are examples, not live rates.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mintledger — Free financial calculators",
    description:
      "Free, private financial calculators. No accounts, no tracking. All figures are examples, not live rates.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
