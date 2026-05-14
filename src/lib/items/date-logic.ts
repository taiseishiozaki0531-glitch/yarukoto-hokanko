import { addDays, isBefore, isWithinInterval, parseISO, startOfDay } from "date-fns";

import type { Item } from "./types";

type ProgressInput = Pick<Item, "total_amount" | "current_amount">;
type DeadlineInput = Pick<Item, "due_date" | "status">;

function parseDateOnly(date: string): Date {
  return startOfDay(parseISO(date));
}

function isCompletedStatus(status: Item["status"]): boolean {
  return status === "完了" || status === "やめた";
}

export function isProgressOverTotal(input: ProgressInput): boolean {
  const { total_amount, current_amount } = input;

  if (total_amount === null || current_amount === null) {
    return false;
  }

  return current_amount > total_amount;
}

export function calculateProgressPercent(input: ProgressInput): number | null {
  const { total_amount, current_amount } = input;

  if (total_amount === null || current_amount === null || total_amount <= 0) {
    return null;
  }

  if (isProgressOverTotal(input)) {
    return null;
  }

  const percent = Math.round((current_amount / total_amount) * 100);
  return Math.min(100, Math.max(0, percent));
}

export function isOverdueItem(item: DeadlineInput, today: Date): boolean {
  if (item.due_date === null || isCompletedStatus(item.status)) {
    return false;
  }

  return isBefore(parseDateOnly(item.due_date), startOfDay(today));
}

export function isDueWithinSevenDays(item: DeadlineInput, today: Date): boolean {
  if (item.due_date === null || isCompletedStatus(item.status)) {
    return false;
  }

  const currentDay = startOfDay(today);
  const dueDate = parseDateOnly(item.due_date);

  return isWithinInterval(dueDate, {
    start: currentDay,
    end: addDays(currentDay, 7),
  });
}
