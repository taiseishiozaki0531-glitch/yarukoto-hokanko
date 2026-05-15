"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionResult } from "./types";
import { validateItemCreateInput } from "./validation";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

function isLikelyUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function readBooleanFormValue(value: FormDataEntryValue | null): boolean | null {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return null;
}

function isInactiveTodayStatus(status: string): boolean {
  return status === "完了" || status === "やめた";
}

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

export async function updateItem(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");

  if (!isLikelyUuid(id)) {
    return {
      ok: false,
      error: "更新対象のアイテムが見つかりません。",
    };
  }

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
  const itemInput = {
    ...validation.data,
    updated_at: new Date().toISOString(),
  };

  if (!isInactiveTodayStatus(itemInput.status)) {
    delete itemInput.is_today;
  }

  const { data, error } = await supabase
    .from("items")
    .update(itemInput)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      error: "保存に失敗しました。時間をおいて再試行してください。",
    };
  }

  if (!data) {
    return {
      ok: false,
      error: "更新対象のアイテムが見つかりません。",
    };
  }

  revalidatePath("/items");
  revalidatePath(`/items/${id}`);
  revalidatePath("/dashboard");
  redirect(`/items/${id}`);
}

export async function deleteItem(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");

  if (!isLikelyUuid(id)) {
    return {
      ok: false,
      error: "削除に失敗しました",
    };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      error: "削除に失敗しました",
    };
  }

  revalidatePath("/items");
  revalidatePath(`/items/${id}`);
  revalidatePath("/dashboard");

  return {
    ok: true,
  };
}

export async function setTodayStatus(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  const nextIsToday = readBooleanFormValue(formData.get("is_today"));

  if (!isLikelyUuid(id) || nextIsToday === null) {
    return {
      ok: false,
      error: "今日やるリストの更新に失敗しました。",
    };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { data: currentItem, error: currentItemError } = await supabase
    .from("items")
    .select("id,status")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (currentItemError || !currentItem) {
    return {
      ok: false,
      error: "今日やるリストの更新に失敗しました。",
    };
  }

  if (nextIsToday && isInactiveTodayStatus(currentItem.status)) {
    return {
      ok: false,
      error: "完了またはやめたアイテムは今日やるリストに追加できません。",
    };
  }

  const { data, error } = await supabase
    .from("items")
    .update({
      is_today: nextIsToday,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      error: "今日やるリストの更新に失敗しました。",
    };
  }

  revalidatePath("/items");
  revalidatePath(`/items/${id}`);
  revalidatePath("/dashboard");

  return {
    ok: true,
  };
}
