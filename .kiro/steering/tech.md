# Technology Stack

最終更新: 2026-05-13  
更新理由: 「やること保管庫」の初期リリース前提、Supabase 利用方針、デプロイ方針を反映。

## Architecture

Next.js App Router を中心にした、個人向けレスポンシブ Web アプリです。UI、認証、データ表示・更新を同一 Next.js アプリ内で扱い、データ永続化とユーザー分離は Supabase に委ねます。

読書・動画・教材・人間関係・買い物などの種別は、初期リリースでは共通の `items` データモデルで扱います。種別ごとに別テーブルや別アプリ構造を作るのではなく、カテゴリ・ステータス・優先度・期限・URL などの属性で整理します。

## Core Technologies

- **Language**: TypeScript 5、`strict: true`
- **Framework**: Next.js 16.2.6、App Router
- **UI Runtime**: React 19.2.4、React DOM 19.2.4
- **Styling**: Tailwind CSS 4、`@tailwindcss/postcss`
- **Backend / Data**: Supabase Auth、Supabase PostgreSQL、Supabase Row Level Security
- **Package Manager**: npm（`package-lock.json` を利用）
- **Hosting**: Vercel
- **Source Control**: GitHub
- **Development Workflow**: cc-sdd Codex Skills による仕様駆動開発

## Key Libraries

- `@supabase/supabase-js` / `@supabase/ssr`: 認証、DB アクセス、SSR cookie 境界に使う
- `date-fns`: 期限切れ、今週中の期限、日付表示、進捗やダッシュボードの期間計算に使う
- `lucide-react`: フィルター、操作ボタン、ダッシュボードなどの UI アイコンに使う
- `next/font`: Geist Sans / Geist Mono を root layout で読み込む

## Data and Security Standards

- すべてのユーザーデータは `user_id` で所有者を明示する
- Supabase Row Level Security を前提に、ユーザーごとにデータを分離する
- 初期リリースの主要データは共通の `items` テーブルで扱う
- クライアント側の条件分岐だけをアクセス制御として扱わない
- Supabase URL、anon key 以外の秘匿情報、サービスロールキー、DB 接続文字列はコードや steering に書かない

## Development Standards

### Type Safety

- TypeScript strict mode を前提にする
- 新規コードでは `any` を避け、アイテム・カテゴリ・ステータス・優先度などの境界には明示的な型を置く
- `@/*` は `src/*` へのパスエイリアスとして使う

### Code Quality

- ESLint は `eslint-config-next/core-web-vitals` と `eslint-config-next/typescript` を使う
- Tailwind CSS の utility class を標準スタイリング手段にする
- 実装判断が複数機能にまたがる場合は、コードコメントより design.md または steering に残す

### Testing

- 現時点で `test` スクリプトは未定義
- 新機能でテストが必要な場合は、tasks phase でテストコマンドと検証範囲を明示する
- 認証、RLS、アイテム CRUD、期限表示、進捗率計算は仕様上のリスクが高いため、実装タスクで検証方法を明記する

## Development Environment

### Required Tools

- npm
- Node.js（Next.js 16 / React 19 が動作するバージョン）
- Supabase プロジェクト
- Vercel プロジェクト
- GitHub リポジトリ

### Common Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Key Technical Decisions

- App Router を標準ルーティングモデルにする
- 個人利用向けの認証・データ分離は Supabase Auth + PostgreSQL + RLS で実現する
- 初期リリースの後回し案件は共通の `items` テーブルで扱い、カテゴリやステータスで表現する
- AI 分類、通知、外部 API 連携、共有、画像アップロードは初期リリースの設計に含めない
- cc-sdd の Requirements → Design → Tasks → Implementation の順で、仕様に基づいて実装する

