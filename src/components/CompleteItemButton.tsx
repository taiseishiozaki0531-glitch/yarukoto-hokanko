"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { ErrorMessage } from "./ErrorMessage";
import { LoadingState } from "./LoadingState";
import { completeItem } from "@/lib/items/actions";
import type { ActionResult, Item } from "@/lib/items/types";

interface CompleteItemButtonProps {
  item: Pick<Item, "id" | "status">;
}

const INITIAL_STATE: ActionResult = {
  ok: false,
};

function canComplete(status: Item["status"]): boolean {
  return status !== "完了" && status !== "やめた";
}

export function CompleteItemButton({ item }: CompleteItemButtonProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    completeItem,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [router, state.ok]);

  if (!canComplete(item.status)) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-2 sm:w-auto">
      <form aria-busy={isPending} action={formAction}>
        <input name="id" type="hidden" value={item.id} />
        <button
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-emerald-200 px-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent sm:min-h-10 sm:w-auto"
          disabled={isPending}
          type="submit"
        >
          <CheckCircle2 aria-hidden="true" size={16} />
          {isPending ? "完了中" : "完了"}
        </button>
      </form>
      {isPending ? (
        <LoadingState
          description="完了に更新しています。"
          title="更新中です"
          variant="inline"
        />
      ) : null}
      {state.error ? <ErrorMessage message={state.error} /> : null}
    </div>
  );
}
