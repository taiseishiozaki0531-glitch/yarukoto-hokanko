"use client";

import { CalendarCheck, CalendarMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, type FormEvent } from "react";

import { ErrorMessage } from "./ErrorMessage";
import { LoadingState } from "./LoadingState";
import { setTodayStatus } from "@/lib/items/actions";
import type { ActionResult, Item } from "@/lib/items/types";

interface TodayToggleButtonProps {
  item: Pick<Item, "id" | "is_today" | "status">;
}

const INITIAL_STATE: ActionResult = {
  ok: false,
};

function isInactiveTodayStatus(status: Item["status"]): boolean {
  return status === "完了" || status === "やめた";
}

export function TodayToggleButton({ item }: TodayToggleButtonProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    setTodayStatus,
    INITIAL_STATE,
  );
  const nextIsToday = !item.is_today;
  const isInactive = isInactiveTodayStatus(item.status);
  const isDisabled = isPending || (!item.is_today && isInactive);
  const label = item.is_today
    ? "今日やるから外す"
    : isInactive
      ? "対象外"
      : "今日やる";
  const Icon = item.is_today ? CalendarMinus : CalendarCheck;

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [router, state.ok]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (isDisabled) {
      event.preventDefault();
    }
  }

  return (
    <div className="min-w-0 space-y-2 sm:w-auto">
      <form
        aria-busy={isPending}
        action={formAction}
        onSubmit={handleSubmit}
      >
        <input name="id" type="hidden" value={item.id} />
        <input name="is_today" type="hidden" value={String(nextIsToday)} />
        <button
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-emerald-200 px-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent sm:min-h-10 sm:w-auto"
          disabled={isDisabled}
          type="submit"
        >
          <Icon aria-hidden="true" size={16} />
          {isPending ? "更新中" : label}
        </button>
      </form>
      {isPending ? (
        <LoadingState
          description="今日やるリストを更新しています。"
          title="更新中です"
          variant="inline"
        />
      ) : null}
      {state.error ? <ErrorMessage message={state.error} /> : null}
    </div>
  );
}
