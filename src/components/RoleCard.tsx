export default function RoleCard({ role }: { role: string }) {
  return (
    <div
      className="role-card flex items-center justify-between px-4 py-3 rounded-lg border"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
        {role}
      </span>
      <a
        href="mailto:careers@sagitta.systems"
        className="text-xs font-medium shrink-0 ml-4 transition-opacity duration-150 hover:opacity-70"
        style={{ color: "var(--accent)" }}
      >
        Register interest
      </a>
    </div>
  );
}
