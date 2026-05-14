export interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} が未設定です。.env.local に Supabase の公開用設定を追加してください。`,
    );
  }

  return value;
}

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: requirePublicEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    publishableKey: requirePublicEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  };
}
