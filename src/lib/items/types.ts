import type { CATEGORIES, PRIORITIES, STATUSES } from "./constants";

export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export interface Item {
  id: string;
  user_id: string;
  title: string;
  category: Category;
  status: Status;
  priority: Priority;
  next_action: string;
  due_date: string | null;
  url: string | null;
  memo: string | null;
  total_amount: number | null;
  current_amount: number | null;
  amount_unit: string | null;
  person_name: string | null;
  contact_method: string | null;
  is_today: boolean;
  completed_from_status?: Status | null;
  completed_from_is_today?: boolean | null;
  created_at: string;
  updated_at: string;
}

export type ItemCreateInput = Omit<
  Item,
  | "id"
  | "user_id"
  | "created_at"
  | "updated_at"
  | "is_today"
  | "completed_from_status"
  | "completed_from_is_today"
> & {
  is_today?: boolean;
};

export type ItemUpdateInput = ItemCreateInput;
export type ItemInput = ItemCreateInput;

export interface ItemListFilter {
  category?: Category;
  status?: Status;
  priority?: Priority;
}

export interface DashboardData {
  totalCount: number;
  statusCounts: Record<Status, number>;
  highPriorityCount: number;
  overdueCount: number;
  upcomingCount: number;
  todayItems: Item[];
  upcomingItems: Item[];
}

export interface ActionResult<T = void> {
  ok: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Partial<Record<keyof ItemInput, string>>;
}
