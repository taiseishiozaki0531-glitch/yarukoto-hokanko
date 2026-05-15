# リリース前確認メモ

作成日: 2026-05-15  
対象: やること保管庫 Task 18

## 実行した確認

- `npm run lint`: 成功
- `npm run build`: 成功
- `npm run test`: 成功
- `.env.local`: `.gitignore` の `.env*` によりGit管理対象外
- Git管理対象のenvファイル: なし
- `.env.local`: `NEXT_PUBLIC_SUPABASE_URL` 設定あり
- `.env.local`: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 設定あり
- `.env.local`: service role key、secret key、DB接続文字列に該当する名前の設定なし
- 公開対象ファイル: Supabase service key、JWT形式の秘密情報、OpenAI形式の秘密情報に見える値なし

## Supabase確認

Supabaseプロジェクト `yarukoto-hokanko` を確認した。

- `public.items` テーブル: 存在する
- `public.items` RLS: 有効
- `public.items` 行数: 6件
- `user_id`: `auth.users.id` への外部キーあり
- `category`、`status`、`priority`: 制約あり
- `title`、`next_action`: 空文字制約あり

## Supabase Advisor

Security Advisorで次の警告が出ている。

- Leaked Password Protectionが無効。ただし有効化にはSupabase Proプランが必要なため、初期リリースでは見送る。

対応済み:

- `public.rls_auto_enable()` が `anon` role から実行可能だった警告は、`EXECUTE` 権限を取り消して解消済み
- `public.rls_auto_enable()` が `authenticated` role から実行可能だった警告は、`EXECUTE` 権限を取り消して解消済み

Performance Advisorで次の情報が出ている。

- `items_user_id_status_idx` が未使用
- `items_user_id_due_date_idx` が未使用

未使用インデックスは、現時点の利用データが少ないため初期リリース前の削除対象とは判断しない。

## 手動確認が必要な項目

この環境では、実ブラウザでの全主要フロー確認は未実施。

初期リリース前に、READMEの「手動確認チェックリスト」に沿って次を確認する。

- 新規登録、ログイン、ログアウト
- アイテム登録、一覧、詳細、編集、削除
- フィルター
- ダッシュボード
- 進捗率
- 今日やるリスト
- 期限切れ、今週中期限
- URLを開くボタン
- 空状態
- 別ユーザーで他ユーザーのアイテムを扱えないこと

## Vercel準備

Vercelには次の環境変数を設定する。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Supabase AuthのRedirect URLsには、本番ドメインの `https://<本番ドメイン>/auth/callback` を追加する。

この確認ではVercelへの本番デプロイは実行していない。
