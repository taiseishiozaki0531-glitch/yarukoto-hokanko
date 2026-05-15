import { Plus } from "lucide-react";
import Link from "next/link";

interface AddItemLinkProps {
  className?: string;
  label?: string;
}

export function AddItemLink({
  className = "",
  label = "やることを追加",
}: AddItemLinkProps) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:min-h-10 ${className}`}
      href="/items/new"
    >
      <Plus aria-hidden="true" size={18} />
      {label}
    </Link>
  );
}
