import Link from "next/link";

import { AddItemLink } from "@/components/AddItemLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logout } from "@/lib/auth/actions";

interface AppHeaderProps {
  userEmail?: string | null;
}

export function AppHeader({ userEmail }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-start sm:px-6">
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

        <form action={logout} className="justify-self-end sm:col-start-3">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            type="submit"
          >
            ログアウト
          </button>
        </form>

        <nav className="col-span-2 grid grid-cols-2 gap-2 text-sm sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:flex sm:flex-wrap sm:items-center sm:justify-end">
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
            やること
          </Link>
          <AddItemLink className="min-h-10 px-3 py-2" label="やることを追加" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
