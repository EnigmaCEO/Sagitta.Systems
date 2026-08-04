import type { Metadata } from "next";
import CtaAnalytics from "@/components/CtaAnalytics";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { site } from "@/content/site";
import { organizationLd, webSiteLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  ...buildMetadata({
    title: site.name,
    description: site.description,
    path: "/",
  }),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s`,
  },
  icons: {
    icon: site.mark,
    apple: site.mark,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `data-scroll-behavior` is the Next 16 opt-in for the behaviour Next 15
    // applied automatically: this stylesheet sets `scroll-behavior: smooth`
    // on <html> for in-page anchors, and without this attribute every route
    // change would smooth-scroll to the top instead of landing instantly.
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">
        {/* The Organization and WebSite nodes are site-wide identity, so they
            belong on every page. Page-level nodes reference them by @id rather
            than restating them. */}
        <JsonLd data={organizationLd()} />
        <JsonLd data={webSiteLd()} />
        {/* Reads the `data-cta` attributes the templates already carry. Inert
            unless NEXT_PUBLIC_ANALYTICS_ENDPOINT is set, and inert for any
            reader sending Do Not Track or Global Privacy Control. Loads no
            third-party script. */}
        <CtaAnalytics />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
