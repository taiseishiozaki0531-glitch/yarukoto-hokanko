"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login, signup } from "@/lib/auth/actions";
import type { AuthFormState } from "@/lib/auth/types";

import { ErrorMessage } from "./ErrorMessage";

type AuthFormMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthFormMode;
}

const INITIAL_STATE: AuthFormState = {};

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const action = isLogin ? login : signup;
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? <ErrorMessage message={state.error} /> : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          メールアドレス
        </label>
        <input
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          パスワード
        </label>
        <input
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
        />
      </div>

      <button
        className="flex w-full items-center justify-center rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "送信中" : isLogin ? "ログイン" : "新規登録"}
      </button>

      <p className="text-center text-sm text-slate-600">
        {isLogin ? "アカウントをお持ちでない方は" : "すでにアカウントがある方は"}{" "}
        <Link
          className="font-medium text-slate-950 underline underline-offset-4"
          href={isLogin ? "/signup" : "/login"}
        >
          {isLogin ? "新規登録" : "ログイン"}
        </Link>
      </p>
    </form>
  );
}
