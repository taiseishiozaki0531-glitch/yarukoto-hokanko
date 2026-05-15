import { STATUSES } from "./constants";
import { isDueWithinSevenDays, isOverdueItem } from "./date-logic";
import type { DashboardData, Item, Status } from "./types";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const DASHBOARD_ITEM_LIMIT = 100;
const ITEM_LIST_LIMIT = 100;

type DashboardQueryResult = {
  data: DashboardData;
  error?: string;
};

type ItemListQueryResult = {
  items: Item[];
  error?: string;
};

function createEmptyStatusCounts(): Record<Status, number> {
  return STATUSES.reduce(
    (counts, status) => ({
      ...counts,
      [status]: 0,
    }),
    {} as Record<Status, number>,
  );
}

export function createEmptyDashboardData(): DashboardData {
  return {
    totalCount: 0,
    statusCounts: createEmptyStatusCounts(),
    highPriorityCount: 0,
    overdueCount: 0,
    upcomingCount: 0,
    todayItems: [],
    upcomingItems: [],
  };
}

function isActiveItem(item: Pick<Item, "status">): boolean {
  return item.status !== "完了" && item.status !== "やめた";
}

function sortByDueDate(items: Item[]): Item[] {
  return [...items].sort((first, second) => {
    if (first.due_date === null && second.due_date === null) {
      return 0;
    }

    if (first.due_date === null) {
      return 1;
    }

    if (second.due_date === null) {
      return -1;
    }

    return first.due_date.localeCompare(second.due_date);
  });
}

export function buildDashboardData(
  items: Item[],
  today = new Date(),
): DashboardData {
  const statusCounts = createEmptyStatusCounts();

  for (const item of items) {
    statusCounts[item.status] += 1;
  }

  const overdueItems = items.filter((item) => isOverdueItem(item, today));
  const upcomingItems = sortByDueDate(
    items.filter((item) => isDueWithinSevenDays(item, today)),
  );

  return {
    totalCount: items.length,
    statusCounts,
    highPriorityCount: items.filter((item) => item.priority === "高").length,
    overdueCount: overdueItems.length,
    upcomingCount: upcomingItems.length,
    todayItems: items.filter((item) => item.is_today && isActiveItem(item)),
    upcomingItems,
  };
}

export async function getDashboardData(): Promise<DashboardQueryResult> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(DASHBOARD_ITEM_LIMIT);

  if (error) {
    return {
      data: createEmptyDashboardData(),
      error:
        "ダッシュボードのデータ取得に失敗しました。itemsテーブルとRLS設定を確認してください。",
    };
  }

  return {
    data: buildDashboardData((data ?? []) as Item[]),
  };
}

export async function listItems(): Promise<ItemListQueryResult> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(ITEM_LIST_LIMIT);

  if (error) {
    return {
      items: [],
      error:
        "アイテム一覧の取得に失敗しました。時間をおいて再読み込みしてください。",
    };
  }

  return {
    items: (data ?? []) as Item[],
  };
}
