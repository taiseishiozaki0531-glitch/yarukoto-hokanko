import { redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";
import { ErrorMessage } from "@/components/ErrorMessage";
import { getCurrentUser } from "@/lib/supabase/auth";

interface LoginPageProps {
  searchParams: Promise<{
    message?: string;
    redirectedFrom?: string;
  }>;
}

function getLoginMessage(message?: string) {
  if (message === "confirm-email") {
    return {
      kind: "info" as const,
      text: "確認メールを送信しました。メール内のリンクを開いてからログインしてください。",
    };
  }

  if (message === "email-confirmed") {
    return {
      kind: "info" as const,
      text: "メール確認が完了しました。登録したメールアドレスとパスワードでログインしてください。",
    };
  }

  if (message === "confirm-error") {
    return {
      kind: "error" as const,
      text: "メール確認に失敗しました。確認メールのリンクをもう一度開くか、再登録をお試しください。",
    };
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const { message, redirectedFrom } = await searchParams;
  const loginMessage = getLoginMessage(message);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-slate-500">やること保管庫</p>
          <h1 className="text-2xl font-semibold text-slate-950">ログイン</h1>
          {redirectedFrom ? (
            <p className="text-sm text-slate-600">
              続きを見るにはログインしてください。
            </p>
          ) : null}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          {loginMessage?.kind === "info" ? (
            <p className="mb-5 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
              {loginMessage.text}
            </p>
          ) : null}
          {loginMessage?.kind === "error" ? (
            <div className="mb-5">
              <ErrorMessage message={loginMessage.text} />
            </div>
          ) : null}
          <AuthForm mode="login" />
        </div>
      </section>
    </main>
  );
}
