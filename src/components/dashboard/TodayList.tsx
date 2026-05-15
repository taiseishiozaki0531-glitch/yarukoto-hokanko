import { CompleteItemButton } from "@/components/CompleteItemButton";
import { EmptyState } from "@/components/EmptyState";
import { TodayToggleButton } from "@/components/TodayToggleButton";
import type { Item } from "@/lib/items/types";

interface TodayListProps {
  items: Item[];
}

export function TodayList({ items }: TodayListProps) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">今日やるリスト</h2>

      {items.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            description="一覧から「今日やる」を選ぶと、ここに表示されます。"
            title="今日やるものはまだ選ばれていません。"
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
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
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
              <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                <CompleteItemButton item={item} />
                <TodayToggleButton item={item} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
