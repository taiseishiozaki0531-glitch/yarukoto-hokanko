# Supabase SQL 準備メモ

このディレクトリのSQLは、Task 4で作成した実行前レビュー用のSQLです。まだSupabaseには適用しません。

## 実行前のルール

- ユーザーが「実行して」と明示するまで、SQLを実行しない。
- 実行前に [items_setup.sql](./items_setup.sql) の全文を提示し、内容確認を受ける。
- Supabase MCP、SQL Editor、CLIのどれを使う場合でも、同じ承認ルールを守る。
- `service_role` key はフロントエンドでは使わない。

## SQLに含めている内容

- `public.items` テーブル作成
- `user_id` と `auth.users(id)` の外部キー
- カテゴリ、ステータス、優先度のチェック制約
- `title` と `next_action` の必須・空文字防止制約
- `total_amount` と `current_amount` の非負数制約
- `current_amount <= total_amount` 制約
- 初期リリースで使うインデックス
- Row Level Security の有効化
- `authenticated` ロールへのData API用権限付与
- `anon` ロールからの `items` テーブル権限取り消し
- SELECT / INSERT / UPDATE / DELETE の操作別RLS policy

## 承認後の適用手順

1. [items_setup.sql](./items_setup.sql) の全文をユーザーに提示する。
2. ユーザーが「実行して」と明示したことを確認する。
3. Supabase SQL Editor、Supabase CLI、またはSupabase MCPでSQLを適用する。
4. 実行結果にエラーがないことを確認する。
5. SupabaseのTable Editorで `items` テーブル、制約、インデックス、RLS policyが作成されていることを確認する。

## RLS確認方法

SQL Editorの管理者実行だけでは、実際のログインユーザーとしてのRLS挙動を完全には確認できません。SQL適用後は、ログイン済みユーザーのJWTを使うREST API、SupabaseのRLS Tester、または後続Taskで作る画面・Server Actionから確認します。

確認する観点:

- ログインユーザーAは、自分の `user_id` のアイテムをSELECTできる。
- ログインユーザーAは、自分の `user_id` のアイテムをINSERTできる。
- ログインユーザーAは、自分の `user_id` のアイテムをUPDATEできる。
- ログインユーザーAは、自分の `user_id` のアイテムをDELETEできる。
- ログインユーザーAは、ユーザーBの `user_id` のアイテムをSELECT / UPDATE / DELETEできない。
- 未ログインユーザーは `items` テーブルを操作できない。

## 注意点

`updated_at` は現在のdesign.mdとtasks.mdに合わせ、初期リリースではDB triggerを作りません。後続の更新処理でServer Action側から現在時刻を設定します。
