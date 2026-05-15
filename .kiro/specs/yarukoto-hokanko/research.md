# Research & Design Decisions

## Summary

- **Feature**: `yarukoto-hokanko`
- **Discovery Scope**: New Feature / Complex Integration
- **Key Findings**:
  - Next.js App Router では Server Components を既定にし、フォーム送信やデータ更新は Server Actions に寄せると、初期リリースの CRUD を単純に保てる。
  - `@supabase/ssr` は browser client と server client を分け、Next.js の request cookie を使う server client と `src/proxy.ts` による session refresh が必要になる。
  - Supabase RLS は `auth.uid() = user_id` を基準に、SELECT / INSERT / UPDATE / DELETE を操作別 policy として分けると、要件の user_id 分離を明確に検証できる。

## Research Log

### Next.js App Router と Server Actions

- **Context**: 要件 1〜15 は認証、フォーム入力、CRUD、ダッシュボード表示を含むため、App Router に沿った設計が必要。
- **Sources Consulted**:
  - Context7 `/vercel/next.js/v16.2.2`: App Router forms, Server Actions, redirect, cookies, authentication guidance
  - Local Vercel Next.js skill: Next.js 16 App Router guidance, Proxy notes
- **Findings**:
  - Server Components はデータ取得に向き、Client Components はフォーム入力やクリック操作などのインタラクションに限定する。
  - Server Actions はフォーム送信とデータ更新に使える。認証確認、保存、`revalidatePath`、`redirect` を同じサーバー境界で扱える。
  - Next.js 16 では旧 middleware は Proxy として扱われる。`src/` ディレクトリ利用時は `src/proxy.ts` が配置先になる。
  - Proxy だけを認可の唯一の層にしない。Server Components / Server Actions でもユーザー確認を行う。
- **Implications**:
  - ページは Server Components を基本にし、`ItemForm`、`AuthForm`、`FilterBar` などだけを Client Components にする。
  - `/dashboard`、`/items` などの保護ルートは `src/proxy.ts` で未ログインを `/login` へ誘導し、各データ操作でも user を再確認する。

### Supabase SSR と Auth

- **Context**: 要件 1、17、24 で認証、user_id、RLS、本人以外への非公開が必須。
- **Sources Consulted**:
  - Context7 `/supabase/ssr`: `createBrowserClient`、`createServerClient`、cookie handlers、middleware/session refresh guidance
  - Supabase skill: service role 非公開、RLS、SQL 実行前承認の安全方針
- **Findings**:
  - `@supabase/ssr` は browser client と server client の factory を分ける。
  - server client は cookies の `getAll` / `setAll` を環境に応じて渡す必要がある。
  - Server Components では cookie 書き込みができないため、session refresh は Proxy 側で担う。
  - frontend で service role key を使ってはいけない。公開可能なのはブラウザに出てもよいキーだけ。
- **Implications**:
  - `src/lib/supabase/server.ts`、`client.ts`、`proxy.ts` を分ける。
  - 認証チェックは `getCurrentUser()` のような server-only helper に集約する。

### Supabase PostgreSQL と RLS

- **Context**: items テーブル、`user_id`、RLS 操作別 policy が設計の中心。
- **Sources Consulted**:
  - Context7 `/supabase/supabase`: RLS policy examples using `auth.uid() = user_id`
  - `.kiro/steering/development-rules.md`: SQL/RLS 実行前承認、RLS 必須、service role 禁止
- **Findings**:
  - RLS は table ごとに有効化する。
  - SELECT は `using (auth.uid() = user_id)`、INSERT は `with check (auth.uid() = user_id)`、UPDATE は `using` と `with check` の両方、DELETE は `using` が必要。
  - UPDATE は SELECT policy と整合していないと対象行を見つけられない。
- **Implications**:
  - design.md には SQL 実行案を載せるが、実行はユーザー承認後に限る。
  - CRUD は application-level filtering に加えて RLS を最終防衛線にする。

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| App Router + Server Actions + Supabase | Server Components で表示、Client Components で入力、Server Actions で変更、Supabase RLS で分離 | 初心者に追いやすい、API Route を増やさず CRUD を実装できる | Server Action の責務が膨らむと読みにくい | 採用 |
| API Routes 中心 | すべての CRUD を Route Handlers に寄せる | HTTP API として境界が明確 | 初期リリースではファイル数と手順が増える | 外部API公開予定がないため不採用 |
| クライアント直接 CRUD 中心 | Browser client から直接 Supabase を呼ぶ | 実装が短い | 認証・検証・エラー処理が散らばりやすい | 補助的に限定 |

## Design Decisions

### Decision: 共通 items テーブルを中心にする

- **Context**: 読書・動画・勉強・人間関係・買い物を初期リリースで扱う。
- **Alternatives Considered**:
  1. カテゴリごとに別テーブルを作る。
  2. 共通 `items` テーブルにカテゴリ別の任意項目を持たせる。
- **Selected Approach**: 共通 `items` テーブルを採用する。
- **Rationale**: 要件は「一箇所に保存する」体験が中心であり、カテゴリ別テーブルは初期リリースには複雑すぎる。
- **Trade-offs**: 一部 nullable カラムが増えるが、UI と CRUD は単純に保てる。
- **Follow-up**: 将来カテゴリごとの詳細データが増えた場合は別 spec で分割を検討する。

### Decision: Server Actions を CRUD の主要境界にする

- **Context**: アイテム登録・編集・削除・今日やる更新はフォーム/ボタン操作で発生する。
- **Alternatives Considered**:
  1. Route Handlers を作る。
  2. Server Actions に寄せる。
- **Selected Approach**: 初期リリースでは Server Actions を採用する。
- **Rationale**: App Router のページと近い場所で、認証確認、入力検証、DB 更新、再検証、遷移をまとめられる。
- **Trade-offs**: 外部クライアント向け API にはならない。外部API連携は初期対象外のため問題ない。
- **Follow-up**: 外部連携が必要になった時点で Route Handlers を追加する。

### Decision: 初期リリース対象外機能は拡張余地だけ残す

- **Context**: AI分類、通知、外部API連携、共有、画像アップロード等は対象外。
- **Alternatives Considered**:
  1. 将来用の adapter やテーブルを先に作る。
  2. 現要件に必要な最小構成にし、データ項目だけ将来を妨げない形にする。
- **Selected Approach**: 現要件に必要な最小構成にする。
- **Rationale**: 初心者が実装しやすく、タスク分割も明確になる。
- **Trade-offs**: 将来機能追加時に migration が必要になる可能性はある。
- **Follow-up**: 将来機能は別 spec で要件化する。

## Risks & Mitigations

- RLS policy の誤りで他ユーザーのデータが見える — 操作別 policy と `auth.uid() = user_id` を設計に明記し、実行前にSQLレビューを行う。
- Proxy だけに認可を依存して bypass される — Server Components / Server Actions でも user を確認する。
- Server Actions が肥大化する — `items/queries.ts`、`items/actions.ts`、`items/validation.ts` に責務を分ける。
- 日付判定がUIごとにばらつく — `src/lib/items/date-logic.ts` に期限切れ・今週中・今日やる判定を集約する。

## References

- [Next.js App Router forms](https://github.com/vercel/next.js/blob/v16.2.2/docs/01-app/02-guides/forms.mdx) — Server Actions とフォーム送信の設計。
- [Next.js Form component API](https://github.com/vercel/next.js/blob/v16.2.2/docs/01-app/03-api-reference/02-components/form.mdx) — Server Actions と redirect の参考。
- [Next.js authentication guide](https://github.com/vercel/next.js/blob/v16.2.2/docs/01-app/02-guides/authentication.mdx) — cookies と server-only session の参考。
- [Supabase SSR design](https://github.com/supabase/ssr/blob/main/docs/design.md) — cookie handling と session refresh の参考。
- [Supabase RLS examples](https://github.com/supabase/supabase) — `auth.uid()` と `user_id` による policy 例。

