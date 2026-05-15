import Link from "next/link";

import { logout } from "@/lib/auth/actions";

interface AppHeaderProps {
  userEmail?: string | null;
}

export function AppHeader({ userEmail }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0 space-y-1">
          <Link
            className="text-base font-semibold text-slate-950"
            href="/dashboard"
          >
            やること保管庫
          </Link>
          {userEmail ? (
            <p className="break-all text-xs text-slate-500">{userEmail}</p>
          ) : null}
        </div>

        <nav className="grid grid-cols-2 gap-2 text-sm sm:flex sm:flex-wrap sm:items-center sm:justify-end">
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
            href="/dashboard"
          >
            ダッシュボード
          </Link>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
            href="/items"
          >
            アイテム
          </Link>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-3 py-2 font-medium text-white hover:bg-slate-800"
            href="/items/new"
          >
            追加
          </Link>
          <form action={logout}>
            <button
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 sm:w-auto"
              type="submit"
            >
              ログアウト
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
