"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { ErrorMessage } from "@/components/ErrorMessage";

interface ProtectedErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProtectedError({ error, reset }: ProtectedErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4">
      <ErrorMessage
        message="画面の表示中に予期しないエラーが発生しました。再読み込みしても直らない場合は、時間をおいてもう一度お試しください。"
        title="画面を表示できません"
      />
      <button
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 sm:min-h-10 sm:w-auto"
        onClick={reset}
        type="button"
      >
        <RotateCcw aria-hidden="true" size={18} />
        再読み込み
      </button>
    </div>
  );
}
