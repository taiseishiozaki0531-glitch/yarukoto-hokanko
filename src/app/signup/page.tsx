import { redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-slate-500">やること保管庫</p>
          <h1 className="text-2xl font-semibold text-slate-950">新規登録</h1>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <AuthForm mode="signup" />
        </div>
      </section>
    </main>
  );
}
