import Image from "next/image";
import type { Person } from "@/content/types";
import { ExternalArrow } from "./icons";

export default function PersonCard({
  person,
  variant = "default",
}: {
  person: Person;
  /** `press` uses the longer, press-usable biography. */
  variant?: "default" | "press";
}) {
  const bio = variant === "press" ? person.pressBio : person.bio;

  return (
    <article
      className="rounded-xl border p-5 h-full flex flex-col"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      id={person.slug}
    >
      {person.photo ? (
        <Image
          src={person.photo}
          alt=""
          width={56}
          height={56}
          className="rounded-lg object-cover mb-4"
        />
      ) : (
        <div
          className="w-14 h-14 rounded-lg mb-4 flex items-center justify-center text-sm font-semibold"
          style={{
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-tertiary)",
          }}
          aria-hidden="true"
        >
          {person.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </div>
      )}

      <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>
        {person.name}
      </p>
      <p className="text-xs font-medium mb-3" style={{ color: "var(--family-accent)" }}>
        {person.role}
      </p>
      <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
        {bio}
      </p>

      {variant === "press" && person.experience.length > 0 && (
        <div className="mt-4">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--text-tertiary)", letterSpacing: "0.1em" }}
          >
            Experience
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {person.experience.map((item) => (
              <li
                key={item}
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  color: "var(--text-tertiary)",
                  backgroundColor: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {person.links.length > 0 && (
        <ul className="flex flex-wrap gap-3 mt-4">
          {person.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1 text-xs font-medium transition-opacity duration-150 hover:opacity-80"
                style={{ color: "var(--text-tertiary)" }}
              >
                {link.label}
                {link.external && <ExternalArrow />}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
