import type { Item } from "@/lib/items/types";

interface TodayListProps {
  items: Item[];
}

export function TodayList({ items }: TodayListProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">今日やるリスト</h2>

      {items.length === 0 ? (
        <p className="mt-5 rounded-md bg-slate-50 px-4 py-5 text-sm text-slate-600">
          今日やるものはまだ選ばれていません。
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li
              className="rounded-md border border-slate-200 px-4 py-3"
              key={item.id}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="min-w-0 flex-1 text-sm font-semibold text-slate-950">
                  {item.title}
                </h3>
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
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
