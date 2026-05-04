import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "var(--accent)", letterSpacing: "0.15em" }}
      >
        404
      </p>
      <h1 className="text-2xl font-bold mb-3">Page not found</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="text-sm font-semibold"
        style={{ color: "var(--accent)" }}
      >
        Back to Sagitta Systems
      </Link>
    </div>
  );
}
