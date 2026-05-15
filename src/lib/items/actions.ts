"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionResult } from "./types";
import { validateItemCreateInput } from "./validation";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function createItem(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const validation = validateItemCreateInput(formData);

  if (!validation.ok) {
    return {
      ok: false,
      error: "入力内容を確認してください。",
      fieldErrors: validation.fieldErrors,
    };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("items").insert({
    ...validation.data,
    user_id: user.id,
  });

  if (error) {
    return {
      ok: false,
      error: "保存に失敗しました。時間をおいて再試行してください。",
    };
  }

  revalidatePath("/items");
  revalidatePath("/dashboard");
  redirect("/items");
}
