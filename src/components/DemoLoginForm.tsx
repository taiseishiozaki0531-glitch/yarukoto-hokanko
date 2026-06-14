"use client";

import { LogIn } from "lucide-react";
import { useActionState } from "react";

import { loginWithDemoAccount } from "@/lib/auth/actions";
import type { AuthFormState } from "@/lib/auth/types";

import { ErrorMessage } from "./ErrorMessage";

interface DemoLoginFormProps {
  isConfigured: boolean;
}

const INITIAL_STATE: AuthFormState = {};

export function DemoLoginForm({ isConfigured }: DemoLoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    loginWithDemoAccount,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <ErrorMessage message={state.error} /> : null}

      <div className="space-y-1.5">
        <h2 className="text-base font-semibold text-slate-950">
          新規登録前に試す
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          サンプルの保管庫を開いて、登録後の画面を確認できます。
        </p>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
        type="submit"
        disabled={isPending || !isConfigured}
      >
        <LogIn aria-hidden="true" className="size-4" />
        {isPending ? "ログイン中" : "仮アカウントで試す"}
      </button>

      {!isConfigured ? (
        <p className="text-sm text-slate-500">
          仮体験用アカウントは現在準備中です。
        </p>
      ) : null}
    </form>
  );
}
