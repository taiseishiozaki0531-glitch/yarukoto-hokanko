# Development Rules

最終更新: 2026-05-14  
対象プロジェクト: やること保管庫

この文書は、「やること保管庫」で実装・仕様作成・DB 変更を行うときのプロジェクト専用ルールです。`product.md`、`tech.md`、`structure.md` と同じく、すべての spec と実装タスクの前提として扱います。

## Product Boundary

このプロジェクトは、読書・動画・勉強・人間関係・買い物などの「後回し案件」を管理する個人向け Web アプリです。

初期リリースでは、次の体験を中心に実装します。

- 認証
- アイテム CRUD
- カテゴリ・ステータス・優先度フィルター
- ダッシュボード
- 今日やるリスト
- 期限切れ表示

初期リリースでは、次の機能を実装しません。

- AI 分類
- 通知
- 外部 API 連携
- 共有機能
- 画像アップロード
- Google カレンダー連携
- YouTube API 連携

これらを追加したくなった場合でも、既存タスクに混ぜず、別 spec として Requirements → Design → Tasks から始めます。

## Spec-Driven Workflow

- 実装前に、必ず `requirements.md`、`design.md`、`tasks.md` を作成する
- Requirements、Design、Tasks はユーザーの承認を得てから実装に進む
- 実装は `tasks.md` に基づき、1 タスクずつ行う
- 指定されたタスク以外の機能、画面、DB カラム、外部連携を勝手に追加しない
- 仕様が曖昧なときは、実装で補完せず、仕様の確認または修正に戻る
- 初心者が理解しやすいように、過度に複雑な抽象化や分散した設計を避ける

## Technical Policy

標準技術方針は次の通りです。

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- date-fns
- lucide-react
- Vercel
- GitHub
- cc-sdd Codex Skills

新しい技術・外部サービス・大きな設計パターンを追加する場合は、Design で理由、代替案、影響範囲を明示してから採用します。

## Data and Supabase Rules

- データは `user_id` によってユーザーごとに分離する
- Supabase の Row Level Security は必ず有効化する
- `items` などユーザーデータを扱うテーブルは、RLS policy で `auth.uid()` と `user_id` の対応を検証する
- クライアント側のフィルタリングだけをデータ保護として扱わない
- Supabase SQL や RLS policy を実行する場合は、実行前に必ず SQL を提示し、ユーザーの承認を待つ
- SQL 実行後は、適用内容と確認方法を日本語で説明する

RLS policy では、SELECT / INSERT / UPDATE / DELETE の権限を分けて考えます。UPDATE は対象行を読める SELECT policy も必要になるため、更新系の設計では読み取り policy との整合性も確認します。

## Secrets and Environment Variables

- 環境変数は `.env.local` で管理し、GitHub に公開しない
- `service_role` key はフロントエンドで絶対に使わない
- `NEXT_PUBLIC_` が付いた環境変数はブラウザに公開される前提で扱う
- Supabase の service role key、DB 接続文字列、秘密鍵、個人アクセストークンを steering、spec、コード例、ログに書かない

## Domain Constants

カテゴリ、ステータス、優先度は定数として管理します。コード内に同じ文字列を散らばらせず、UI 表示、DB 値、フィルター、バリデーションが同じ定義を参照する構造にします。

代表的な定数の例:

- カテゴリ: 読書、動画、勉強、人間関係、買い物
- ステータス: 未着手、進行中、完了、保留
- 優先度: 高、中、低

実際の値、英語 key、日本語 label、DB 制約は該当 spec の Design で確定します。

## Completion Report

実装後は、ユーザーに日本語で次を説明します。

- 変更ファイル
- 実装内容
- 動作確認方法
- 未解決課題

テストやビルドを実行できなかった場合は、成功したように言わず、未実行の理由とユーザーが確認すべきコマンドを明記します。

