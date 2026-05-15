import { LoadingState } from "@/components/LoadingState";

export default function ProtectedLoading() {
  return (
    <LoadingState
      description="アイテム情報を取得しています。"
      title="データを読み込み中です"
    />
  );
}
