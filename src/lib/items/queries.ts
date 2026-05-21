import { STATUSES } from "./constants";
import {
  isDueWithinSevenDays,
  isOverdueItem,
  isVisibleInTodayList,
} from "./date-logic";
import type {
  DashboardData,
  Item,
  ItemListFilter,
  Priority,
  Status,
} from "./types";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const DASHBOARD_ITEM_LIMIT = 100;
const ITEM_LIST_LIMIT = 100;
const PRIORITY_ORDER: Record<Priority, number> = {
  高: 0,
  中: 1,
  低: 2,
};

type DashboardQueryResult = {
  data: DashboardData;
  error?: string;
};

type ItemListQueryResult = {
  items: Item[];
  error?: string;
};

type ItemDetailQueryResult = {
  item: Item | null;
  error?: string;
};

function isLikelyUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

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

function sortByPriority(items: Item[]): Item[] {
  return [...items].sort((first, second) => {
    const completionDiff =
      Number(first.status === "完了") - Number(second.status === "完了");

    if (completionDiff !== 0) {
      return completionDiff;
    }

    const priorityDiff =
      PRIORITY_ORDER[first.priority] - PRIORITY_ORDER[second.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return second.created_at.localeCompare(first.created_at);
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
    todayItems: items.filter(isVisibleInTodayList),
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
        "ダッシュボードのデータ取得に失敗しました。時間をおいて再読み込みしてください。",
    };
  }

  return {
    data: buildDashboardData((data ?? []) as Item[]),
  };
}

export async function listItems(
  filter: ItemListFilter = {},
): Promise<ItemListQueryResult> {
  const user = await requireUser();
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id);

  if (filter.category) {
    query = query.eq("category", filter.category);
  }

  if (filter.status) {
    query = query.eq("status", filter.status);
  }

  if (filter.priority) {
    query = query.eq("priority", filter.priority);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(ITEM_LIST_LIMIT);

  if (error) {
    return {
      items: [],
      error:
        "やること一覧の取得に失敗しました。時間をおいて再読み込みしてください。",
    };
  }

  return {
    items: sortByPriority((data ?? []) as Item[]),
  };
}

export async function getItemById(id: string): Promise<ItemDetailQueryResult> {
  if (!isLikelyUuid(id)) {
    return {
      item: null,
      error: "指定されたやることが見つかりません。",
    };
  }

  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      item: null,
      error:
        "やること詳細の取得に失敗しました。時間をおいて再読み込みしてください。",
    };
  }

  if (!data) {
    return {
      item: null,
      error: "指定されたやることが見つかりません。",
    };
  }

  return {
    item: data as Item,
  };
}
