"use client";

import Link from "@/components/Link";
import { useEffect, useRef } from "react";
import { primaryNav, site, utilityNav } from "@/content/site";
import { isActiveRoute, nextTrapIndex } from "@/lib/nav";
import { CloseIcon } from "./icons";

export { isActiveRoute };

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen navigation drawer for narrow viewports.
 *
 * It behaves as a modal dialog, which means four things have to hold together:
 * focus moves into the drawer on open and returns to the toggle on close, Tab
 * cycles within it rather than escaping to the page behind, Escape closes it,
 * and the document behind is both scroll-locked and inert to pointer input.
 */
export default function MobileNav({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus in on open. The close button is the safest landing point: it is
  // the first control, and it names the way out.
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  // Lock the document behind the drawer.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Escape closes; Tab is trapped inside the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );

      const target = nextTrapIndex({
        count: items.length,
        activeIndex: items.indexOf(document.activeElement as HTMLElement),
        shiftKey: event.shiftKey,
      });

      if (target !== null) {
        event.preventDefault();
        items[target].focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-navigation"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      data-testid="mobile-nav"
      className="md:hidden fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div
        className="flex items-center justify-between px-6 border-b shrink-0"
        style={{ height: "var(--header-height)", borderColor: "var(--border)" }}
      >
        <span
          className="text-sm font-semibold uppercase"
          style={{ color: "var(--text-primary)", letterSpacing: "0.15em" }}
        >
          {site.name}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          data-testid="mobile-nav-close"
          className="tap-target inline-flex items-center justify-center w-10 h-10 rounded border"
          style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
        >
          <CloseIcon />
        </button>
      </div>

      <nav
        aria-label="Primary mobile"
        className="flex-1 overflow-y-auto px-6 py-6"
        style={{ overscrollBehavior: "contain" }}
      >
        <ul className="space-y-1 mb-8">
          {primaryNav.map((link) => {
            const active = isActiveRoute(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className="tap-target flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    backgroundColor: active ? "var(--surface-2)" : "transparent",
                    borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
                  }}
                >
                  {link.label}
                  {active && (
                    <span className="text-xs font-normal" style={{ color: "var(--gold)" }}>
                      Current
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="eyebrow px-4 mb-3" style={{ color: "var(--text-tertiary)" }}>
          More from Sagitta
        </p>
        <ul className="grid grid-cols-2 gap-1 mb-8">
          {utilityNav.map((link) => {
            const active = isActiveRoute(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className="tap-target flex items-center px-4 py-3 rounded-lg text-sm"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    backgroundColor: active ? "var(--surface-2)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <a
          href={`mailto:${site.contactEmail}`}
          onClick={onClose}
          data-cta="mobile-nav:contact"
          data-cta-type="contact"
          className="tap-target flex items-center px-4 py-3 rounded-lg text-sm"
          style={{ color: "var(--gold)" }}
        >
          {site.contactEmail}
        </a>
      </nav>
    </div>
  );
}
