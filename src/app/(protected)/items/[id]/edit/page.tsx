import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ItemForm } from "@/components/ItemForm";
import { getItemById } from "@/lib/items/queries";

interface EditItemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params;
  const { item, error } = await getItemById(id);

  return (
    <div className="space-y-6">
      <section className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-slate-500">アイテム編集</p>
          <h1 className="text-2xl font-semibold text-slate-950">
            アイテムを編集
          </h1>
        </div>
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-10 sm:w-auto"
          href={item ? `/items/${item.id}` : "/items"}
        >
          <ArrowLeft aria-hidden="true" size={18} />
          {item ? "詳細へ戻る" : "一覧へ戻る"}
        </Link>
      </section>

      {error ? <ErrorMessage message={error} /> : null}

      {item ? (
        <ItemForm item={item} />
      ) : (
        <EmptyState
          actionHref="/items"
          actionLabel="一覧へ戻る"
          description="アイテムが削除されたか、アクセスできない可能性があります。"
          title="編集できるアイテムが見つかりません"
        />
      )}
    </div>
  );
}
