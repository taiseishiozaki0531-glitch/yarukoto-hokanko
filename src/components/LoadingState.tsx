import { LoaderCircle } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
  variant?: "panel" | "inline";
}

export function LoadingState({
  title = "読み込み中です",
  description = "しばらくお待ちください。",
  variant = "panel",
}: LoadingStateProps) {
  const isInline = variant === "inline";

  return (
    <div
      aria-live="polite"
      className={
        isInline
          ? "inline-flex min-w-0 items-start gap-2 rounded-md bg-slate-50 px-3 py-2 text-left"
          : "min-w-0 rounded-lg border border-slate-200 bg-white px-6 py-8 text-center shadow-sm"
      }
      role="status"
    >
      <LoaderCircle
        aria-hidden="true"
        className={
          isInline
            ? "mt-0.5 h-4 w-4 shrink-0 animate-spin text-slate-500"
            : "mx-auto h-6 w-6 animate-spin text-slate-500"
        }
      />
      <div className={isInline ? "min-w-0" : "mt-3"}>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
