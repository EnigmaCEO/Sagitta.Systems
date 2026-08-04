import SectionHeading from "./SectionHeading";
import EmptyState from "./EmptyState";

/**
 * Wrapper for the related blocks on detail templates (related publications,
 * roadmap items, roles). Renders an empty state rather than disappearing, so
 * the relationship stays visible even before content exists.
 */
export default function RelatedContent({
  title,
  description,
  action,
  emptyTitle,
  emptyDescription,
  isEmpty,
  children,
  columns = 3,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  emptyTitle: string;
  emptyDescription?: string;
  isEmpty: boolean;
  children?: React.ReactNode;
  columns?: 1 | 2 | 3;
}) {
  const gridClass =
    columns === 1
      ? "grid grid-cols-1 gap-3"
      : columns === 2
        ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className="mb-12 last:mb-0">
      <SectionHeading title={title} description={description} action={action} />
      {isEmpty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className={gridClass}>{children}</div>
      )}
    </div>
  );
}
