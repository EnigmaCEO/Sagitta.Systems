export interface DefenseReviewFinding {
  label: string;
  value: string;
  tone: "critical" | "warning" | "neutral";
}

export interface DefenseReview {
  slug: string;
  newsroomSlug: string;
  canonicalPath: `/defense/reviews/${string}`;
  cve: string;
  environment: string;
  environmentQualifier: string;
  sourcePath: string;
  findings: DefenseReviewFinding[];
}

/** Published Defense evidence records. */
export const defenseReviews: DefenseReview[] = [
  {
    slug: "cve-2023-39363",
    newsroomSlug: "cve-2023-39363",
    canonicalPath: "/defense/reviews/cve-2023-39363",
    cve: "CVE-2023-39363",
    environment: "Meridian ETH Reserve Pool",
    environmentQualifier: "Fictional sample environment",
    sourcePath: "src/content/defense-reviews/cve-2023-39363.md",
    findings: [
      { label: "Technical reachability", value: "REACHABLE", tone: "critical" },
      {
        label: "Economic exploitability",
        value: "PROFITABLE PATH IDENTIFIED",
        tone: "critical",
      },
      { label: "Authority", value: "PARTIAL", tone: "warning" },
      { label: "Continuity posture", value: "MIGRATION REQUIRED", tone: "critical" },
    ],
  },
];

export function getDefenseReview(slug: string): DefenseReview | undefined {
  return defenseReviews.find((review) => review.slug === slug);
}
