import Link from "@/components/Link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ paddingTop: "var(--header-height)", color: "var(--text-primary)" }}
    >
      <p className="eyebrow mb-4" style={{ color: "var(--gold)" }}>
        404
      </p>
      <h1 className="text-2xl font-bold mb-3">Page not found</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="btn-primary tap-target inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          Back to Sagitta Systems
        </Link>
        <Link
          href="/systems"
          className="btn-secondary tap-target inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold"
        >
          Systems directory
        </Link>
      </div>
    </div>
  );
}
