import { Plus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ItemCard } from "@/components/ItemCard";
import { listItems } from "@/lib/items/queries";

export default async function ItemsPage() {
  const { items, error } = await listItems();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">アイテム</p>
          <h1 className="text-2xl font-semibold text-slate-950">
            登録済みアイテム
          </h1>
        </div>
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          href="/items/new"
        >
          <Plus aria-hidden="true" size={18} />
          アイテム追加
        </Link>
      </section>

      {error ? <ErrorMessage message={error} /> : null}

      {!error && items.length === 0 ? (
        <EmptyState
          actionHref="/items/new"
          actionLabel="アイテムを追加"
          description="読書、動画、教材、人間関係、買い物などを登録できます。"
          title="まずはアイテムを登録しましょう"
        />
      ) : null}

      {items.length > 0 ? (
        <section className="grid gap-4">
          {items.map((item) => (
            <ItemCard item={item} key={item.id} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
