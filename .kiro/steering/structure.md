# Project Structure

最終更新: 2026-05-13  
更新理由: 「やること保管庫」の機能境界、Supabase 境界、items 共通モデル方針を反映。

## Organization Philosophy

このプロジェクトは Next.js App Router を中心に、個人向けの「後回し案件」管理体験を段階的に実装します。構造は、画面ルート、再利用 UI、ドメインロジック、Supabase 連携を混ぜずに分けます。

初期リリースの中心概念は `items` です。読書・動画・教材・人間関係・買い物を別々の実装境界に分けるのではなく、共通の item として扱い、カテゴリ・ステータス・優先度・期限・URL などで整理します。

## Directory Patterns

### App Router

**Location**: `src/app/`  
**Purpose**: ルート、レイアウト、ページ、グローバル CSS を置く  
**Rule**: route entry は画面構成に集中し、Supabase 操作や複雑な集計処理を抱え込まない

### Feature Routes

**Location**: `src/app/...`  
**Purpose**: ダッシュボード、アイテム一覧、詳細、編集などのユーザー画面を route として表現する  
**Rule**: 認証が必要な画面と公開画面の境界は design phase で明示する

### Shared UI

**Location**: `src/components/`（必要になったら作成）  
**Purpose**: 複数画面で再利用される UI コンポーネントを置く  
**Rule**: ボタン、フィルター、空状態、カード、ステータス表示など、複数箇所で意味が一致するものだけ共有化する

### Domain and Utilities

**Location**: `src/lib/`（必要になったら作成）  
**Purpose**: items の型、日付判定、進捗率計算、Supabase client 生成、データ変換など UI から独立した処理を置く  
**Rule**: 期限切れ、今週中、進捗率、今日やるリストの判定は UI に直書きせず、再利用可能な関数として境界を作る

### Static Assets

**Location**: `public/`  
**Purpose**: ブラウザから直接参照する静的ファイルを置く  
**Rule**: 初期リリースでは画像アップロードを扱わないため、ユーザー生成画像の保存先として使わない

## Data Model Boundary

- 初期リリースの主要エンティティは `items`
- `items` はユーザーごとの後回し案件を表す
- 読書・動画・教材・人間関係・買い物はカテゴリとして扱う
- ステータス、優先度、期限、URL、進捗に関係する属性は共通 item の属性として扱う
- すべての item は `user_id` を持ち、Supabase RLS で所有者ごとに分離する

詳細なカラム、制約、インデックス、RLS policy は該当 spec の design.md で確定します。steering では「共通 items モデルで扱う」という方針だけを固定します。

## Naming Conventions

- **Files**: Next.js 規約ファイルは `layout.tsx`, `page.tsx`, `globals.css` のように規約名を使う
- **Components**: React コンポーネントは PascalCase
- **Functions / Variables**: TypeScript の通常規約に従い camelCase
- **Routes**: App Router の route segment は小文字・意味ベースで命名する
- **Domain Terms**: 「後回し案件」はコード上では原則 `item` / `items` として扱う

## Import Organization

```typescript
import { Something } from "@/lib/something";
import { LocalPart } from "./local-part";
```

**Path Aliases**:

- `@/`: `src/` に対応する。深い相対 import を避けるために使う

同じ route または同じ小さなモジュール内の近接ファイルは相対 import を許容します。共有層や離れた階層を参照するときは `@/` を優先します。

## Code Organization Principles

- route entry は画面構成に集中し、外部サービスや複雑な変換処理を抱え込まない
- Supabase 連携は、認証、DB アクセス、サーバー/クライアント境界、環境変数の責務を分ける
- `user_id` と RLS によるユーザー分離を前提に設計する
- ダッシュボード、期限表示、進捗率、今日やるリストは `items` を集計・抽出する機能として扱う
- AI 分類、通知、外部 API 連携、共有、画像アップロードは初期リリースの構造に混ぜない
- `.kiro/steering/` は長期的な判断基準、`.kiro/specs/` は個別機能の Requirements / Design / Tasks を保持する

