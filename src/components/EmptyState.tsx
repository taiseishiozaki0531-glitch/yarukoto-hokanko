import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  variant?: "panel" | "subtle";
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  variant = "panel",
}: EmptyStateProps) {
  const isSubtle = variant === "subtle";

  return (
    <div
      className={
        isSubtle
          ? "min-w-0 rounded-md bg-slate-50 px-4 py-5 text-left"
          : "min-w-0 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-8 text-center"
      }
      role="status"
    >
      {isSubtle ? (
        <p className="text-sm font-semibold text-slate-800">{title}</p>
      ) : (
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      )}
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
      {actionHref && actionLabel ? (
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 sm:min-h-10"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
