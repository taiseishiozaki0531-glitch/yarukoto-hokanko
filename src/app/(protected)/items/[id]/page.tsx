import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ItemDetail } from "@/components/ItemDetail";
import { getItemById } from "@/lib/items/queries";

interface ItemDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;
  const { item, error } = await getItemById(id);

  return (
    <div className="space-y-6">
      <section className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-slate-500">やること詳細</p>
          <h1 className="text-2xl font-semibold text-slate-950">
            やることの内容
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-10"
            href="/items"
          >
            <ArrowLeft aria-hidden="true" size={18} />
            一覧へ戻る
          </Link>
          {item ? (
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 sm:min-h-10"
              href={`/items/${item.id}/edit`}
            >
              <Pencil aria-hidden="true" size={18} />
              編集
            </Link>
          ) : null}
        </div>
      </section>

      {error ? <ErrorMessage message={error} /> : null}

      {item ? (
        <ItemDetail item={item} />
      ) : (
        <EmptyState
          actionHref="/items"
          actionLabel="一覧へ戻る"
          description="やることが削除されたか、アクセスできない可能性があります。"
          title="やることを表示できません"
        />
      )}
    </div>
  );
}
