"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthFormState } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";

type DemoAccountConfig =
  | {
      ok: true;
      email: string;
      password: string;
    }
  | {
      ok: false;
      error: string;
    };

function readAuthInput(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    passwordConfirmation: String(formData.get("passwordConfirmation") ?? ""),
  };
}

function validateAuthInput(email: string, password: string): AuthFormState | null {
  if (!email || !password) {
    return {
      error: "メールアドレスとパスワードを入力してください。",
    };
  }

  return null;
}

function readDemoAccountConfig(): DemoAccountConfig {
  const email = process.env.DEMO_ACCOUNT_EMAIL?.trim();
  const password = process.env.DEMO_ACCOUNT_PASSWORD;

  if (!email || !password) {
    return {
      ok: false,
      error:
        "仮体験用アカウントは現在準備中です。通常のログインまたは新規登録をご利用ください。",
    };
  }

  return { ok: true, email, password };
}

async function getRequestOrigin(): Promise<string> {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const host = headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = readAuthInput(formData);
  const validationError = validateAuthInput(email, password);

  if (validationError) {
    return validationError;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        "ログインできませんでした。メールアドレスとパスワードを確認してください。",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function loginWithDemoAccount(
  _previousState: AuthFormState,
  _formData: FormData,
): Promise<AuthFormState> {
  void _previousState;
  void _formData;

  const demoAccount = readDemoAccountConfig();

  if (!demoAccount.ok) {
    return { error: demoAccount.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: demoAccount.email,
    password: demoAccount.password,
  });

  if (error) {
    return {
      error:
        "仮体験用アカウントでログインできませんでした。時間をおいてもう一度お試しください。",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password, passwordConfirmation } = readAuthInput(formData);
  const validationError = validateAuthInput(email, password);

  if (validationError) {
    return validationError;
  }

  if (!passwordConfirmation) {
    return {
      error: "確認用パスワードを入力してください。",
    };
  }

  if (password !== passwordConfirmation) {
    return {
      error: "パスワードが一致していません。",
    };
  }

  const origin = await getRequestOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return {
      error:
        "新規登録できませんでした。入力内容を確認して、もう一度お試しください。",
    };
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/login?message=confirm-email");
}

export async function logout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
