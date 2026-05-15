"use client";

import { Save, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { ErrorMessage } from "./ErrorMessage";
import { CATEGORIES, PRIORITIES, STATUSES } from "@/lib/items/constants";
import { createItem } from "@/lib/items/actions";
import type { ActionResult, Category, ItemCreateInput } from "@/lib/items/types";

type FieldErrors = Partial<Record<keyof ItemCreateInput, string>>;

const INITIAL_STATE: ActionResult = {
  ok: false,
};

const inputClassName =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";
const selectClassName =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-rose-700">{message}</p>;
}

function RequiredBadge() {
  return (
    <span className="rounded-full bg-slate-950 px-2 py-0.5 text-xs font-semibold text-white">
      必須
    </span>
  );
}

function OptionalBadge() {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
      任意
    </span>
  );
}

function FieldLabel({
  htmlFor,
  label,
  required = false,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label
      className="flex items-center gap-2 text-sm font-medium text-slate-700"
      htmlFor={htmlFor}
    >
      {label}
      {required ? <RequiredBadge /> : <OptionalBadge />}
    </label>
  );
}

function TextInput({
  fieldErrors,
  label,
  name,
  required = false,
  type = "text",
}: {
  fieldErrors: FieldErrors;
  label: string;
  name: keyof ItemCreateInput;
  required?: boolean;
  type?: "date" | "text" | "url";
}) {
  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={name} label={label} required={required} />
      <input
        aria-invalid={fieldErrors[name] ? "true" : "false"}
        className={inputClassName}
        id={name}
        name={name}
        required={required}
        type={type}
      />
      <FieldError message={fieldErrors[name]} />
    </div>
  );
}

function NumberInput({
  fieldErrors,
  label,
  name,
}: {
  fieldErrors: FieldErrors;
  label: string;
  name: "total_amount" | "current_amount";
}) {
  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={name} label={label} />
      <input
        aria-invalid={fieldErrors[name] ? "true" : "false"}
        className={inputClassName}
        id={name}
        min="0"
        name={name}
        step="0.1"
        type="number"
      />
      <FieldError message={fieldErrors[name]} />
    </div>
  );
}

function ProgressFields({
  currentLabel,
  fieldErrors,
  totalLabel,
  unit,
}: {
  currentLabel: string;
  fieldErrors: FieldErrors;
  totalLabel: string;
  unit: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <NumberInput
        fieldErrors={fieldErrors}
        label={totalLabel}
        name="total_amount"
      />
      <NumberInput
        fieldErrors={fieldErrors}
        label={currentLabel}
        name="current_amount"
      />
      <div className="space-y-2">
        <FieldLabel htmlFor="amount_unit" label="単位" />
        <input
          className={inputClassName}
          id="amount_unit"
          name="amount_unit"
          readOnly
          type="text"
          value={unit}
        />
      </div>
    </div>
  );
}

function UrlField({ fieldErrors, label }: { fieldErrors: FieldErrors; label: string }) {
  return (
    <TextInput
      fieldErrors={fieldErrors}
      label={label}
      name="url"
      type="url"
    />
  );
}

function CategoryFields({
  category,
  fieldErrors,
}: {
  category: Category;
  fieldErrors: FieldErrors;
}) {
  if (category === "読書") {
    return (
      <ProgressFields
        currentLabel="現在のページ"
        fieldErrors={fieldErrors}
        totalLabel="総ページ数"
        unit="ページ"
      />
    );
  }

  if (category === "動画") {
    return (
      <div className="space-y-4">
        <UrlField fieldErrors={fieldErrors} label="動画URL" />
        <ProgressFields
          currentLabel="視聴済み時間"
          fieldErrors={fieldErrors}
          totalLabel="動画時間"
          unit="分"
        />
      </div>
    );
  }

  if (category === "教材") {
    return (
      <div className="space-y-4">
        <UrlField fieldErrors={fieldErrors} label="教材URL" />
        <ProgressFields
          currentLabel="現在の章"
          fieldErrors={fieldErrors}
          totalLabel="全体の章数"
          unit="章"
        />
      </div>
    );
  }

  if (category === "人間関係") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          fieldErrors={fieldErrors}
          label="相手の名前"
          name="person_name"
        />
        <TextInput
          fieldErrors={fieldErrors}
          label="連絡手段"
          name="contact_method"
        />
      </div>
    );
  }

  if (category === "買い物") {
    return <UrlField fieldErrors={fieldErrors} label="URL" />;
  }

  return (
    <p className="rounded-md bg-slate-50 px-4 py-4 text-sm text-slate-600">
      追加の入力項目はありません。
    </p>
  );
}

export function ItemForm() {
  const [state, formAction, isPending] = useActionState(
    createItem,
    INITIAL_STATE,
  );
  const [category, setCategory] = useState<Category>("読書");
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      {state.error ? <ErrorMessage message={state.error} /> : null}

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-950">基本項目</h2>

        <TextInput
          fieldErrors={fieldErrors}
          label="タイトル"
          name="title"
          required
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <FieldLabel htmlFor="category" label="カテゴリ" required />
            <select
              aria-invalid={fieldErrors.category ? "true" : "false"}
              className={selectClassName}
              id="category"
              name="category"
              onChange={(event) => setCategory(event.target.value as Category)}
              required
              value={category}
            >
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.category} />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="status" label="ステータス" required />
            <select
              aria-invalid={fieldErrors.status ? "true" : "false"}
              className={selectClassName}
              defaultValue="未着手"
              id="status"
              name="status"
              required
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.status} />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="priority" label="優先度" required />
            <select
              aria-invalid={fieldErrors.priority ? "true" : "false"}
              className={selectClassName}
              defaultValue="中"
              id="priority"
              name="priority"
              required
            >
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.priority} />
          </div>
        </div>

        <TextInput
          fieldErrors={fieldErrors}
          label="次にやること"
          name="next_action"
          required
        />
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-5">
        <h2 className="text-base font-semibold text-slate-950">カテゴリ別項目</h2>
        <div key={category}>
          <CategoryFields category={category} fieldErrors={fieldErrors} />
        </div>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-5">
        <h2 className="text-base font-semibold text-slate-950">任意項目</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            fieldErrors={fieldErrors}
            label="期限"
            name="due_date"
            type="date"
          />
          <div className="space-y-2 sm:col-span-2">
            <FieldLabel htmlFor="memo" label="メモ" />
            <textarea
              className="min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              id="memo"
              name="memo"
            />
            <FieldError message={fieldErrors.memo} />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          href="/items"
        >
          <X aria-hidden="true" size={18} />
          キャンセル
        </Link>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isPending}
          type="submit"
        >
          <Save aria-hidden="true" size={18} />
          {isPending ? "保存中" : "保存"}
        </button>
      </div>
    </form>
  );
}
