import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import type { ReactNode } from "react";

import { formatProgressText } from "@/lib/items/date-logic";
import type { Item } from "@/lib/items/types";

interface ItemDetailProps {
  item: Item;
}

function formatDate(date: string | null): string {
  if (date === null) {
    return "未設定";
  }

  return format(new Date(`${date}T00:00:00`), "yyyy/MM/dd");
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-md bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-1 break-words text-sm font-semibold leading-6 text-slate-900">
        {value}
      </div>
    </div>
  );
}

export function ItemDetail({ item }: ItemDetailProps) {
  const progressText = formatProgressText(item);

  return (
    <article className="min-w-0 space-y-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <section className="space-y-3">
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
        <h2 className="break-words text-2xl font-semibold text-slate-950">
          {item.title}
        </h2>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-medium text-slate-500">次にやること</p>
        <p className="break-words rounded-md bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800">
          {item.next_action}
        </p>
      </section>

      <section className={`grid gap-3 ${progressText ? "sm:grid-cols-2" : ""}`}>
        <DetailField label="期限" value={formatDate(item.due_date)} />
        {progressText ? (
          <DetailField label="進捗" value={progressText} />
        ) : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <DetailField label="相手の名前" value={item.person_name ?? "未設定"} />
        <DetailField label="連絡手段" value={item.contact_method ?? "未設定"} />
      </section>

      <section className="space-y-2">
        <p className="text-xs font-medium text-slate-500">URL</p>
        {item.url ? (
          <a
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-10 sm:w-auto"
            href={item.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink aria-hidden="true" size={16} />
            URLを開く
          </a>
        ) : (
          <p className="rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
            未設定
          </p>
        )}
      </section>

      <section className="space-y-2">
        <p className="text-xs font-medium text-slate-500">メモ</p>
        <p className="min-h-16 whitespace-pre-wrap break-words rounded-md bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800">
          {item.memo ?? "未設定"}
        </p>
      </section>
    </article>
  );
}
