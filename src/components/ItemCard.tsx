import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { calculateProgressPercent } from "@/lib/items/date-logic";
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

function formatProgress(item: Item): string | null {
  const progressPercent = calculateProgressPercent(item);

  if (progressPercent === null) {
    return null;
  }

  if (item.amount_unit) {
    return `${progressPercent}% (${item.current_amount}/${item.total_amount}${item.amount_unit})`;
  }

  return `${progressPercent}%`;
}

export function ItemCard({ item }: ItemCardProps) {
  const progressText = formatProgress(item);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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
            <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-medium text-white">
              優先度 {item.priority}
            </span>
          </div>
        </div>

        {item.url ? (
          <a
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-slate-50 px-3 py-3">
            <p className="text-xs font-medium text-slate-500">期限</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formatDate(item.due_date)}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 px-3 py-3">
            <p className="text-xs font-medium text-slate-500">進捗率</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {progressText ?? "未設定"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          href={`/items/${item.id}`}
        >
          <Eye aria-hidden="true" size={16} />
          詳細
        </Link>
        <Link
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          href={`/items/${item.id}/edit`}
        >
          <Pencil aria-hidden="true" size={16} />
          編集
        </Link>
        <button
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-400"
          disabled
          type="button"
        >
          <Trash2 aria-hidden="true" size={16} />
          削除
        </button>
      </div>
    </article>
  );
}
