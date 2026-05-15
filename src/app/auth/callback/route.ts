import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

function getSafeNextPath(nextPath: string | null): string {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      revalidatePath("/", "layout");
      return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      revalidatePath("/", "layout");
      return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
    }
  }

  if (requestUrl.searchParams.has("next")) {
    return NextResponse.redirect(
      new URL("/login?message=email-confirmed", requestUrl.origin),
    );
  }

  return NextResponse.redirect(
    new URL("/login?message=confirm-error", requestUrl.origin),
  );
}
