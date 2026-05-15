import { CATEGORIES, PRIORITIES, STATUSES } from "./constants";
import { isProgressOverTotal } from "./date-logic";
import type { Category, ItemCreateInput, Priority, Status } from "./types";

type FieldErrors = Partial<Record<keyof ItemCreateInput, string>>;

interface ValidationSuccess {
  ok: true;
  data: ItemCreateInput;
}

interface ValidationFailure {
  ok: false;
  fieldErrors: FieldErrors;
}

type ValidationResult = ValidationSuccess | ValidationFailure;

function readText(formData: FormData, key: keyof ItemCreateInput): string {
  return String(formData.get(key) ?? "").trim();
}

function isOneOf<T extends readonly string[]>(
  value: string,
  options: T,
): value is T[number] {
  return options.includes(value);
}

function readRequiredText(
  formData: FormData,
  key: keyof ItemCreateInput,
  label: string,
  fieldErrors: FieldErrors,
): string {
  const value = readText(formData, key);

  if (!value) {
    fieldErrors[key] = `${label}を入力してください。`;
  }

  return value;
}

function readOptionalText(
  formData: FormData,
  key: keyof ItemCreateInput,
): string | null {
  const value = readText(formData, key);
  return value || null;
}

function readOptionalUrl(formData: FormData, fieldErrors: FieldErrors) {
  const value = readOptionalText(formData, "url");

  if (value === null) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }

    return value;
  } catch {
    fieldErrors.url = "URLは http:// または https:// から始めてください。";
    return null;
  }
}

function readOptionalDate(formData: FormData, fieldErrors: FieldErrors) {
  const value = readOptionalText(formData, "due_date");

  if (value === null) {
    return null;
  }

  if (Number.isNaN(new Date(`${value}T00:00:00`).getTime())) {
    fieldErrors.due_date = "期限は正しい日付で入力してください。";
    return null;
  }

  return value;
}

function readOptionalNumber(
  formData: FormData,
  key: "total_amount" | "current_amount",
  label: string,
  fieldErrors: FieldErrors,
): number | null {
  const value = readText(formData, key);

  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    fieldErrors[key] = `${label}は数値で入力してください。`;
    return null;
  }

  if (parsed < 0) {
    fieldErrors[key] = `${label}は0以上で入力してください。`;
    return null;
  }

  return parsed;
}

function readCategory(formData: FormData, fieldErrors: FieldErrors): Category {
  const value = readRequiredText(formData, "category", "カテゴリ", fieldErrors);

  if (!isOneOf(value, CATEGORIES)) {
    fieldErrors.category = "カテゴリを選択してください。";
    return "その他";
  }

  return value;
}

function readStatus(formData: FormData, fieldErrors: FieldErrors): Status {
  const value = readRequiredText(formData, "status", "ステータス", fieldErrors);

  if (!isOneOf(value, STATUSES)) {
    fieldErrors.status = "ステータスを選択してください。";
    return "未着手";
  }

  return value;
}

function readPriority(formData: FormData, fieldErrors: FieldErrors): Priority {
  const value = readRequiredText(formData, "priority", "優先度", fieldErrors);

  if (!isOneOf(value, PRIORITIES)) {
    fieldErrors.priority = "優先度を選択してください。";
    return "中";
  }

  return value;
}

export function validateItemCreateInput(formData: FormData): ValidationResult {
  const fieldErrors: FieldErrors = {};
  const title = readRequiredText(formData, "title", "タイトル", fieldErrors);
  const category = readCategory(formData, fieldErrors);
  const status = readStatus(formData, fieldErrors);
  const priority = readPriority(formData, fieldErrors);
  const nextAction = readRequiredText(
    formData,
    "next_action",
    "次にやること",
    fieldErrors,
  );
  const totalAmount = readOptionalNumber(
    formData,
    "total_amount",
    "総量",
    fieldErrors,
  );
  const currentAmount = readOptionalNumber(
    formData,
    "current_amount",
    "現在の進捗",
    fieldErrors,
  );
  const dueDate = readOptionalDate(formData, fieldErrors);
  const url = readOptionalUrl(formData, fieldErrors);

  const data: ItemCreateInput = {
    title,
    category,
    status,
    priority,
    next_action: nextAction,
    due_date: dueDate,
    url,
    memo: readOptionalText(formData, "memo"),
    total_amount: totalAmount,
    current_amount: currentAmount,
    amount_unit: readOptionalText(formData, "amount_unit"),
    person_name: readOptionalText(formData, "person_name"),
    contact_method: readOptionalText(formData, "contact_method"),
    is_today: false,
  };

  if (isProgressOverTotal(data)) {
    fieldErrors.current_amount = "現在の進捗は総量以下で入力してください。";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
    };
  }

  return {
    ok: true,
    data,
  };
}
