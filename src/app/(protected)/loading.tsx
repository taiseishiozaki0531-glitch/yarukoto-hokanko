import { LoadingState } from "@/components/LoadingState";

export default function ProtectedLoading() {
  return (
    <LoadingState
      description="やること情報を取得しています。"
      title="データを読み込み中です"
    />
  );
}
