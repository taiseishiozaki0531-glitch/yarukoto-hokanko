"use client";

import { CheckCircle2, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { ErrorMessage } from "./ErrorMessage";
import { LoadingState } from "./LoadingState";
import { completeItem, restoreCompletedItem } from "@/lib/items/actions";
import type { ActionResult, Item } from "@/lib/items/types";

interface CompleteItemButtonProps {
  item: Pick<
    Item,
    "id" | "status" | "completed_from_status" | "completed_from_is_today"
  >;
}

type CompletionSnapshot = {
  previousStatus: "未着手" | "途中" | "保留";
  previousIsToday: boolean;
};

const INITIAL_STATE: ActionResult<CompletionSnapshot> = {
  ok: false,
};
const RESTORE_INITIAL_STATE: ActionResult = {
  ok: false,
};

function canComplete(status: Item["status"]): boolean {
  return status !== "完了" && status !== "やめた";
}

function isRestorableStatus(
  status: Item["status"] | null | undefined,
): status is CompletionSnapshot["previousStatus"] {
  return status === "未着手" || status === "途中" || status === "保留";
}

export function CompleteItemButton({ item }: CompleteItemButtonProps) {
  const router = useRouter();
  const [completeState, completeAction, isCompletePending] = useActionState(
    completeItem,
    INITIAL_STATE,
  );
  const [restoreState, restoreAction, isRestorePending] = useActionState(
    restoreCompletedItem,
    RESTORE_INITIAL_STATE,
  );

  useEffect(() => {
    if (completeState.ok || restoreState.ok) {
      router.refresh();
    }
  }, [completeState.ok, restoreState.ok, router]);

  if (item.status === "やめた") {
    return null;
  }

  if (item.status === "完了") {
    const restoreStatus =
      completeState.data?.previousStatus ??
      (isRestorableStatus(item.completed_from_status)
        ? item.completed_from_status
        : "未着手");
    const restoreIsToday =
      typeof completeState.data?.previousIsToday === "boolean"
        ? completeState.data.previousIsToday
        : item.completed_from_is_today ?? false;
    const hasRestoreHistory =
      Boolean(completeState.data?.previousStatus) ||
      isRestorableStatus(item.completed_from_status);

    return (
      <div className="min-w-0 space-y-2 sm:w-auto">
        <form aria-busy={isRestorePending} action={restoreAction}>
          <input name="id" type="hidden" value={item.id} />
          <input name="restore_status" type="hidden" value={restoreStatus} />
          <input
            name="restore_is_today"
            type="hidden"
            value={String(restoreIsToday)}
          />
          <button
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-amber-200 px-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent sm:min-h-10 sm:w-auto"
            disabled={isRestorePending}
            type="submit"
          >
            <Undo2 aria-hidden="true" size={16} />
            {isRestorePending
              ? "戻し中"
              : hasRestoreHistory
                ? `${restoreStatus}に戻す`
                : "未着手に戻す"}
          </button>
        </form>
        {isRestorePending ? (
          <LoadingState
            description="完了前の状態に戻しています。"
            title="更新中です"
            variant="inline"
          />
        ) : null}
        {restoreState.error ? (
          <ErrorMessage message={restoreState.error} />
        ) : null}
      </div>
    );
  }

  if (!canComplete(item.status)) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-2 sm:w-auto">
      <form aria-busy={isCompletePending} action={completeAction}>
        <input name="id" type="hidden" value={item.id} />
        <button
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-emerald-200 px-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent sm:min-h-10 sm:w-auto"
          disabled={isCompletePending}
          type="submit"
        >
          <CheckCircle2 aria-hidden="true" size={16} />
          {isCompletePending ? "完了中" : "完了"}
        </button>
      </form>
      {isCompletePending ? (
        <LoadingState
          description="完了に更新しています。"
          title="更新中です"
          variant="inline"
        />
      ) : null}
      {completeState.error ? (
        <ErrorMessage message={completeState.error} />
      ) : null}
    </div>
  );
}
