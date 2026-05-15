import { ListFilter, RotateCcw } from "lucide-react";
import Link from "next/link";

import { CATEGORIES, PRIORITIES, STATUSES } from "@/lib/items/constants";
import type { ItemListFilter } from "@/lib/items/types";

interface FilterBarProps {
  filter: ItemListFilter;
}

function FilterSelect({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: keyof ItemListFilter;
  options: readonly string[];
  value?: string;
}) {
  return (
    <label className="min-w-0 space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        defaultValue={value ?? ""}
        name={name}
      >
        <option value="">すべて</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ filter }: FilterBarProps) {
  return (
    <form
      action="/items"
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <FilterSelect
          label="カテゴリ"
          name="category"
          options={CATEGORIES}
          value={filter.category}
        />
        <FilterSelect
          label="ステータス"
          name="status"
          options={STATUSES}
          value={filter.status}
        />
        <FilterSelect
          label="優先度"
          name="priority"
          options={PRIORITIES}
          value={filter.priority}
        />
      </div>

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-10"
          href="/items"
        >
          <RotateCcw aria-hidden="true" size={16} />
          解除
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 sm:min-h-10"
          type="submit"
        >
          <ListFilter aria-hidden="true" size={16} />
          絞り込む
        </button>
      </div>
    </form>
  );
}
