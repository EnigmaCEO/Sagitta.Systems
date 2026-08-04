"use client";

import Image from "next/image";
import Link from "@/components/Link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav, site } from "@/content/site";
import MobileNav, { isActiveRoute } from "./MobileNav";
import { MenuIcon } from "./icons";

/**
 * The site shell's header.
 *
 * It is fixed rather than sticky and starts transparent, so the hero reads as
 * one composition running to the top of the viewport rather than a band sitting
 * under a bar. Once the page scrolls past the first screen-edge it solidifies
 * into a blurred surface with a border, which is what keeps the navigation
 * legible over dense content further down.
 *
 * The transparent state is purely presentational: `.hero-section` reserves the
 * header's height, so no content ever begins underneath it.
 */
export default function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A route change closes the drawer. Next keeps the header mounted across
  // navigations, so without this the drawer would survive the transition.
  //
  // Adjusted during render rather than in an effect. As an effect this ran a
  // second render pass after every navigation, and closed the drawer one paint
  // late — React's documented pattern for resetting state when an input changes
  // is to compare it during render, which React re-runs immediately without
  // committing the intermediate result to the DOM.
  const [navigatedFrom, setNavigatedFrom] = useState(pathname);
  if (navigatedFrom !== pathname) {
    setNavigatedFrom(pathname);
    setOpen(false);
  }

  return (
    <header
      className="site-header fixed top-0 inset-x-0 z-50"
      data-solid={solid || open}
      // The header sits inside the composition it is over, so it takes that
      // composition's alignment. On an institutional route that is the document
      // measure; on the front page it is the broadcast gutter, which is what
      // keeps the wordmark on the same line as the headline beneath it instead
      // of floating in from the middle of the screen.
      data-home={pathname === "/"}
      style={{ height: "var(--header-height)" }}
    >
      <div className="site-header-inner mx-auto max-w-6xl px-6 h-full flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 rounded">
          <Image
            src={site.mark}
            alt=""
            width={22}
            height={22}
            className="object-contain"
            style={{ opacity: 0.95 }}
            priority
          />
          <span
            className="text-sm font-semibold uppercase hidden sm:block"
            style={{ color: "var(--text-primary)", letterSpacing: "0.15em" }}
          >
            {site.name}
          </span>
          <span className="visually-hidden sm:hidden">{site.name} — home</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {primaryNav.map((link) => {
            const active = isActiveRoute(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="nav-link px-3 py-2 rounded text-xs font-medium"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/press"
            data-cta="header:press"
            data-cta-type="press"
            className="nav-cta hidden md:inline-flex px-3 py-1.5 rounded border text-xs font-medium"
          >
            Press Room
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="md:hidden tap-target inline-flex items-center justify-center w-10 h-10 rounded border"
            style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls="mobile-navigation"
            aria-label="Open menu"
            data-testid="mobile-nav-toggle"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <MobileNav
        open={open}
        pathname={pathname}
        onClose={() => {
          setOpen(false);
          toggleRef.current?.focus();
        }}
      />
    </header>
  );
}
