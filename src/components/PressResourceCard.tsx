import Link from "@/components/Link";
import type { PressResource } from "@/content/types";
import { ArrowRight, ExternalArrow } from "./icons";

/** A press resource that is ready for public use. Nothing pending reaches here. */
export default function PressResourceCard({ resource }: { resource: PressResource }) {
  return (
    <article
      className="rounded-xl border p-5 h-full flex flex-col"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        {resource.title}
      </p>

      <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
        {resource.description}
      </p>

      {resource.links.length > 0 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
          {resource.links.map((link) => (
            <li key={`${link.href}-${link.label}`}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity duration-150 hover:opacity-80"
                  style={{ color: "var(--family-accent)" }}
                >
                  {link.label}
                  <ExternalArrow />
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity duration-150 hover:opacity-80"
                  style={{ color: "var(--family-accent)" }}
                >
                  {link.label}
                  <ArrowRight size={12} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
