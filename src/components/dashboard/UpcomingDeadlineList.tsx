import { format } from "date-fns";

import { CompleteItemButton } from "@/components/CompleteItemButton";
import { EmptyState } from "@/components/EmptyState";
import type { Item } from "@/lib/items/types";

interface UpcomingDeadlineListProps {
  items: Item[];
}

function formatDate(date: string | null): string {
  if (date === null) {
    return "期限なし";
  }

  return format(new Date(`${date}T00:00:00`), "yyyy/MM/dd");
}

export function UpcomingDeadlineList({ items }: UpcomingDeadlineListProps) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">今週中の期限</h2>

      {items.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            description="期限が近い未完了のやることがあると、ここに表示されます。"
            title="今週中の期限はありません。"
            variant="subtle"
          />
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li
              className="min-w-0 rounded-md border border-slate-200 px-4 py-3"
              key={item.id}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="min-w-0 flex-1 break-words text-sm font-semibold text-slate-950">
                  {item.title}
                </h3>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                  {formatDate(item.due_date)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {item.category}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {item.priority}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.next_action}
              </p>
              <div className="mt-3">
                <CompleteItemButton item={item} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
