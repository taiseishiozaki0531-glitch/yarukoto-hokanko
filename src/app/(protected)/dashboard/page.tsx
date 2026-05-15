import { AddItemLink } from "@/components/AddItemLink";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { TodayList } from "@/components/dashboard/TodayList";
import { UpcomingDeadlineList } from "@/components/dashboard/UpcomingDeadlineList";
import { getDashboardData } from "@/lib/items/queries";

export default async function DashboardPage() {
  const { data, error } = await getDashboardData();

  return (
    <div className="space-y-6">
      <section className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-slate-500">ダッシュボード</p>
          <h1 className="text-2xl font-semibold text-slate-950">
            やることの状況
          </h1>
        </div>
        <AddItemLink className="w-full sm:w-auto" />
      </section>

      {error ? <ErrorMessage message={error} /> : null}

      <DashboardSummary data={data} />

      {!error && data.totalCount === 0 ? (
        <EmptyState
          actionHref="/items/new"
          actionLabel="新しいやることを追加"
          actionTone="primary"
          description="読書、動画、勉強、人間関係、買い物などを一箇所に保管できます。"
          title="まずはやることを登録しましょう"
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <TodayList items={data.todayItems} />
        <UpcomingDeadlineList items={data.upcomingItems} />
      </div>
    </div>
  );
}
