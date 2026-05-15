import { ExternalLink, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { CompleteItemButton } from "./CompleteItemButton";
import { DeleteItemButton } from "./DeleteItemButton";
import { TodayToggleButton } from "./TodayToggleButton";
import {
  formatProgressText,
  isDueWithinSevenDays,
  isOverdueItem,
} from "@/lib/items/date-logic";
import type { Item } from "@/lib/items/types";

interface ItemCardProps {
  item: Item;
}

function formatDate(date: string | null): string {
  if (date === null) {
    return "期限なし";
  }

  return format(new Date(`${date}T00:00:00`), "yyyy/MM/dd");
}

function getDeadlineState(item: Item): "overdue" | "upcoming" | null {
  const today = new Date();

  if (isOverdueItem(item, today)) {
    return "overdue";
  }

  if (isDueWithinSevenDays(item, today)) {
    return "upcoming";
  }

  return null;
}

function getPriorityBadgeClass(priority: Item["priority"]): string {
  switch (priority) {
    case "高":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "中":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "低":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

export function ItemCard({ item }: ItemCardProps) {
  const progressText = formatProgressText(item);
  const deadlineState = getDeadlineState(item);
  const isOverdue = deadlineState === "overdue";
  const priorityBadgeClass = getPriorityBadgeClass(item.priority);

  return (
    <article
      className={`min-w-0 rounded-lg border p-4 shadow-sm ${
        isOverdue
          ? "border-rose-200 bg-rose-50/60"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <h2 className="break-words text-lg font-semibold text-slate-950">
            {item.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {item.category}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {item.status}
            </span>
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityBadgeClass}`}
            >
              優先度 {item.priority}
            </span>
          </div>
        </div>

        {item.url ? (
          <a
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-10 sm:w-auto"
            href={item.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink aria-hidden="true" size={16} />
            URLを開く
          </a>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-slate-500">次にやること</p>
          <p className="mt-1 break-words text-sm leading-6 text-slate-700">
            {item.next_action}
          </p>
        </div>

        <div className={`grid gap-3 ${progressText ? "sm:grid-cols-2" : ""}`}>
          <div className="rounded-md bg-slate-50 px-3 py-3">
            <p className="text-xs font-medium text-slate-500">期限</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-800">
                {formatDate(item.due_date)}
              </p>
              {deadlineState === "overdue" ? (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                  期限切れ
                </span>
              ) : null}
              {deadlineState === "upcoming" ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  今週中
                </span>
              ) : null}
            </div>
          </div>
          {progressText ? (
            <div className="rounded-md bg-slate-50 px-3 py-3">
              <p className="text-xs font-medium text-slate-500">進捗率</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {progressText}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-200 pt-4 sm:flex sm:flex-wrap sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-10"
          href={`/items/${item.id}`}
        >
          <Eye aria-hidden="true" size={16} />
          詳細
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-10"
          href={`/items/${item.id}/edit`}
        >
          <Pencil aria-hidden="true" size={16} />
          編集
        </Link>
        <CompleteItemButton item={item} />
        <TodayToggleButton item={item} />
        <DeleteItemButton itemId={item.id} itemTitle={item.title} />
      </div>
    </article>
  );
}
