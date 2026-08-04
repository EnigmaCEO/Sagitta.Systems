import Link from "@/components/Link";
import { ArrowRight } from "./icons";

/** Shown wherever a collection has no records yet. */
export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div
      className="rounded-xl border p-8 text-center"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        borderStyle: "dashed",
      }}
    >
      <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      {description && (
        <p
          className="text-xs leading-relaxed max-w-md mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold mt-4 transition-opacity duration-150 hover:opacity-80"
          style={{ color: "var(--family-accent)" }}
        >
          {action.label}
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}
