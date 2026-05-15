import { STATUSES } from "@/lib/items/constants";
import type { DashboardData } from "@/lib/items/types";

interface DashboardSummaryProps {
  data: DashboardData;
}

const summaryItems = [
  {
    label: "やること合計",
    valueKey: "totalCount",
  },
  {
    label: "優先度 高",
    valueKey: "highPriorityCount",
  },
  {
    label: "期限切れ",
    valueKey: "overdueCount",
  },
  {
    label: "今週中の期限",
    valueKey: "upcomingCount",
  },
] as const;

export function DashboardSummary({ data }: DashboardSummaryProps) {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item) => (
          <div
            className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            key={item.valueKey}
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {data[item.valueKey]}
            </p>
          </div>
        ))}
      </div>

      <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-950">
          ステータス別件数
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {STATUSES.map((status) => (
            <div
              className="min-w-0 rounded-md bg-slate-50 px-3 py-3"
              key={status}
            >
              <p className="text-xs font-medium text-slate-500">{status}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {data.statusCounts[status]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
