"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, type FormEvent } from "react";

import { ErrorMessage } from "./ErrorMessage";
import { LoadingState } from "./LoadingState";
import { deleteItem } from "@/lib/items/actions";
import type { ActionResult } from "@/lib/items/types";

interface DeleteItemButtonProps {
  itemId: string;
  itemTitle: string;
}

const INITIAL_STATE: ActionResult = {
  ok: false,
};

export function DeleteItemButton({
  itemId,
  itemTitle,
}: DeleteItemButtonProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    deleteItem,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [router, state.ok]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const shouldDelete = window.confirm(
      `「${itemTitle}」を削除しますか？この操作は取り消せません。`,
    );

    if (!shouldDelete) {
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
        <input name="id" type="hidden" value={itemId} />
        <button
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent sm:min-h-10 sm:w-auto"
          disabled={isPending}
          type="submit"
        >
          <Trash2 aria-hidden="true" size={16} />
          {isPending ? "削除中" : "削除"}
        </button>
      </form>
      {isPending ? (
        <LoadingState
          description="削除が完了するまでお待ちください。"
          title="削除中です"
          variant="inline"
        />
      ) : null}
      {state.error ? <ErrorMessage message={state.error} /> : null}
    </div>
  );
}
