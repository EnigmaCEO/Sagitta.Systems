import type { Metadata } from "next";
import { site } from "@/content/site";

export interface PageMetaInput {
  title: string;
  description?: string;
  /** Path relative to the site root, e.g. "/newsroom/example". */
  path?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  /** Open Graph content type. */
  type?: "website" | "article" | "profile";
  publishedTime?: string | null;
  modifiedTime?: string | null;
}

/**
 * Roughly what a search result renders before it truncates. Not a hard limit —
 * the number is pixels in practice, not characters — but a budget to decide
 * against.
 */
const TITLE_BUDGET = 60;

const BRAND_SUFFIX = ` — ${site.name}`;

/**
 * The page title, with the site name appended only where it earns its place.
 *
 * Two rules, and both exist because of something this site actually shipped:
 *
 *   - **Never twice.** A title that already ends in the site name takes no
 *     second copy. The homepage passed its own tagline *and* the brand, and the
 *     old unconditional append made that "The Sagitta Systems Network — Sagitta
 *     Systems — Sagitta Systems" on the most important page on the site.
 *   - **Not past the budget.** Canonical article titles are recorded verbatim
 *     by editorial policy and several already run past 60 characters on their
 *     own. Appending an 18-character suffix to those does not add the brand to
 *     the result — it pushes the suffix, and the title's own last words, past
 *     the truncation point. Where the brand cannot fit, the title keeps the
 *     room instead.
 */
function titleWithBrand(title: string): string {
  if (title === site.name || title.endsWith(site.name)) return title;
  return title.length + BRAND_SUFFIX.length <= TITLE_BUDGET ? `${title}${BRAND_SUFFIX}` : title;
}

/**
 * Builds page metadata from site defaults, allowing any individual content
 * record to override title, description, canonical URL, Open Graph fields,
 * content type, and published/updated dates.
 */
export function buildMetadata({
  title,
  description = site.description,
  path = "/",
  ogTitle,
  ogDescription,
  ogImage = site.socialImage,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetaInput): Metadata {
  const fullTitle = titleWithBrand(title);
  const canonical = new URL(path, site.url).toString();

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(site.url),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    alternates: {
      canonical,
      // Feed autodiscovery, declared on every route rather than in the root
      // layout. A page's `alternates` replaces the layout's outright rather
      // than merging into it, and every page here sets its own canonical — so
      // declaring the feed in the layout would have removed it from every page
      // on the site. It belongs wherever `canonical` is set.
      types: {
        "application/rss+xml": [
          { url: new URL("/newsroom/feed.xml", site.url).toString(), title: `${site.name} — Newsroom` },
        ],
      },
    },
    openGraph: {
      title: ogTitle ?? fullTitle,
      description: ogDescription ?? description,
      url: canonical,
      siteName: site.name,
      images: [{ url: ogImage, alt: `${site.name} — ${title}` }],
      type: type === "profile" ? "profile" : type,
      ...(type === "article"
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? fullTitle,
      description: ogDescription ?? description,
      images: [ogImage],
    },
  };
}
