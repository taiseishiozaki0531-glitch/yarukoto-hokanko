import { ItemForm } from "@/components/ItemForm";

export default function NewItemPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-medium text-slate-500">アイテム追加</p>
        <h1 className="text-2xl font-semibold text-slate-950">
          新しいアイテムを登録
        </h1>
      </section>

      <ItemForm />
    </div>
  );
}
