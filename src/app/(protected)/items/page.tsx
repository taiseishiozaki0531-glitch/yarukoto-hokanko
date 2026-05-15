import { Plus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FilterBar } from "@/components/FilterBar";
import { ItemCard } from "@/components/ItemCard";
import { CATEGORIES, PRIORITIES, STATUSES } from "@/lib/items/constants";
import { listItems } from "@/lib/items/queries";
import type { Category, ItemListFilter, Priority, Status } from "@/lib/items/types";

type SearchParams = Promise<{
  category?: string | string[];
  status?: string | string[];
  priority?: string | string[];
}>;

interface ItemsPageProps {
  searchParams: SearchParams;
}

function readSingleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function isCategory(value: string | undefined): value is Category {
  return CATEGORIES.some((category) => category === value);
}

function isStatus(value: string | undefined): value is Status {
  return STATUSES.some((status) => status === value);
}

function isPriority(value: string | undefined): value is Priority {
  return PRIORITIES.some((priority) => priority === value);
}

function hasActiveFilter(filter: ItemListFilter): boolean {
  return Boolean(filter.category || filter.status || filter.priority);
}

async function parseItemListFilter(
  searchParams: SearchParams,
): Promise<ItemListFilter> {
  const params = await searchParams;
  const category = readSingleParam(params.category);
  const status = readSingleParam(params.status);
  const priority = readSingleParam(params.priority);

  return {
    category: isCategory(category) ? category : undefined,
    status: isStatus(status) ? status : undefined,
    priority: isPriority(priority) ? priority : undefined,
  };
}

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const filter = await parseItemListFilter(searchParams);
  const isFiltered = hasActiveFilter(filter);
  const { items, error } = await listItems(filter);

  return (
    <div className="space-y-6">
      <section className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-slate-500">アイテム</p>
          <h1 className="text-2xl font-semibold text-slate-950">
            登録済みアイテム
          </h1>
        </div>
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 sm:min-h-10 sm:w-auto"
          href="/items/new"
        >
          <Plus aria-hidden="true" size={18} />
          アイテム追加
        </Link>
      </section>

      {error ? <ErrorMessage message={error} /> : null}

      <FilterBar filter={filter} />

      {!error && items.length === 0 ? (
        <EmptyState
          actionHref={isFiltered ? "/items" : "/items/new"}
          actionLabel={isFiltered ? "フィルターを解除" : "アイテムを追加"}
          description={
            isFiltered
              ? "カテゴリ、ステータス、優先度の条件を変えて確認できます。"
              : "読書、動画、教材、人間関係、買い物などを登録できます。"
          }
          title={
            isFiltered
              ? "条件に一致するアイテムはありません"
              : "まずはアイテムを登録しましょう"
          }
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
