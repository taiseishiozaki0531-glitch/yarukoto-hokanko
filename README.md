# やること保管庫

「やること保管庫」は、読書・動画・教材・人間関係・買い物など、日常生活で「あとでやろう」と思ったまま放置されがちなものを保存し、「次にやること」まで整理する個人向けWebアプリです。

単なるToDoリストではなく、明確な締切がないために放置されやすい「後回し案件」を一箇所で見返せることを目的にしています。

## 技術スタック

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- date-fns
- lucide-react
- Vercel

## ローカル起動

依存関係をインストールします。

```bash
npm install
```

`.env.local` を作成し、次の環境変数を設定します。

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## よく使うコマンド

```bash
npm run dev
npm run lint
npm run build
npm run test
```

`npm run test` は暫定的に `npm run lint && npm run build` を実行します。

## Supabase設定

初期リリースでは、ユーザーごとの後回し案件を `items` テーブルで管理します。すべてのデータは `user_id` で所有者を分離し、Supabase Row Level Securityで本人のデータだけを扱えるようにします。

Supabase Authのメール確認を使う場合は、Supabase DashboardのRedirect URLsに次を登録してください。

```text
http://localhost:3000/auth/callback
https://<本番ドメイン>/auth/callback
```

`items` テーブル、制約、インデックス、RLS policyのSQLは `.kiro/specs/yarukoto-hokanko/design.md` とTask 4の作業内容を確認してください。

SQLやRLS policyを実行する場合は、必ず実行前にSQL全文を提示し、ユーザーが「実行して」と明示してから実行します。Supabase MCPを使う場合も同じです。

## 秘密情報の扱い

- `.env.local` はGit管理対象外です。
- `NEXT_PUBLIC_` が付いた環境変数はブラウザに公開される前提で扱います。
- フロントエンドではSupabaseのservice role keyやsecret keyを絶対に使いません。
- GitHubに公開するファイルへDB接続文字列、秘密鍵、個人アクセストークンを書きません。

## 手動確認チェックリスト

初期リリース前に、次の操作をブラウザで確認します。

- 新規登録
- ログイン
- ログアウト
- アイテム登録
- アイテム一覧表示
- アイテム詳細表示
- アイテム編集
- アイテム削除
- カテゴリ・ステータス・優先度フィルター
- ダッシュボード表示
- 進捗率表示
- 今日やるリストへの追加と解除
- 期限切れ表示
- 今週中に期限が来るアイテム表示
- URLを開くボタン
- 初回0件、フィルター0件、今日やるリスト0件の空状態
- 375px程度のスマホ幅で横スクロールなしに主要操作ができること

100件以下の一覧、ダッシュボード、CRUD操作は、通常時3秒以内を目標に確認します。

RLS確認では、別ユーザーでログインしたときに他ユーザーのアイテムが一覧、詳細、編集、削除で扱えないことを確認します。

## Vercelデプロイ準備

Vercelには次の環境変数を設定します。

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Production、Preview、Developmentの各環境で、接続先のSupabaseプロジェクトが意図したものになっているか確認してください。

Supabase AuthのRedirect URLsには、本番ドメインの `https://<本番ドメイン>/auth/callback` を追加します。

このREADMEでは本番デプロイ手順を整理しますが、デプロイ自体は実行しません。

## 初期リリース対象外

次の機能は初期リリースでは実装しません。

- AI分類
- 通知
- 外部API連携
- 共有機能
- 画像アップロード
- Googleカレンダー連携
- YouTube API連携
