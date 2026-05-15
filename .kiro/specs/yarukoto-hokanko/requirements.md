# Requirements Document

## Introduction

「やること保管庫」は、読書・動画・勉強・人間関係・買い物など、日常生活の中で「あとでやろう」と思ったまま放置されがちなものを一箇所に集め、次に取るべき行動まで整理する個人向けWebアプリである。

主な対象ユーザーは、大学生・高校生・若手社会人など、日常的に学習・趣味・人間関係・買い物などの小さなタスクを多く抱えている個人ユーザーである。ユーザーは、情報がAmazon、YouTube、ブックマーク、LINE、Instagram、メモアプリ、スクリーンショット、検索履歴などに分散することで、「あとでやる」と思ったことを忘れたり、途中で止まっているものを把握できなくなったりしている。

本仕様は、初期リリースに含めるP0/P1機能と非機能要件を定義する。仕様情報は `docs/requirements-draft.md` の内容に基づく。

## Boundary Context

- **In scope**: ユーザー認証、アイテム登録、カテゴリ別入力補助、アイテム一覧、アイテム詳細、アイテム編集、アイテム削除、フィルター、ダッシュボード、進捗率の自動計算、今日やるリスト、URLを開くボタン、期限切れ表示、今週中に期限が来るアイテム表示、空状態表示、非機能要件。
- **Out of scope**: AI分類、URLからのタイトル・サムネイル自動取得、YouTube API連携、Googleカレンダー連携、LINE連携、友達共有機能、通知機能、スマホアプリ化、高度なグラフ表示、タグの自動生成、複数人での共同編集。
- **Adjacent expectations**: 初期リリースでは、読書・動画・勉強・人間関係・買い物をすべて「アイテム」として扱う。カテゴリごとに分離された体験ではなく、共通のアイテム管理体験として提供する。

## Requirements

### Requirement 1: ユーザー認証機能

**Priority:** P0

**Objective:** As a 個人ユーザー, I want 自分専用のアカウントで登録・ログイン・ログアウトできる, so that 他のユーザーのデータと混ざらない状態で後回し案件を管理できる

#### Acceptance Criteria

1. When ユーザーがアプリにアクセスしたとき, the system shall 未ログインの場合はログイン画面を表示する。
2. When ユーザーがメールアドレスとパスワードで新規登録するとき, the system shall アカウントを作成できる。
3. When ユーザーがメールアドレスとパスワードを入力してログインするとき, the system shall 認証済み状態にする。
4. When ログイン中のユーザーがログアウトするとき, the system shall 認証済み状態を終了する。
5. If 未ログインユーザーがアイテム一覧または登録画面にアクセスしようとしたとき, the system shall アイテム情報を表示せずログインを求める。
6. While ユーザーがログイン中である, the system shall そのユーザー自身のアイテムのみ閲覧可能にする。
7. The system shall ログイン画面にアプリ名、メールアドレス入力欄、パスワード入力欄、ログインボタン、新規登録への導線を表示する。

### Requirement 2: アイテム登録機能

**Priority:** P0

**Objective:** As a 個人ユーザー, I want 後回しにしている読書・動画・勉強・人間関係・買い物などをアイテムとして登録できる, so that 頭の中や複数アプリに散らばっている「あとでやること」を一箇所に保存できる

#### Acceptance Criteria

1. When ユーザーがアイテム追加画面を開いたとき, the system shall アイテム登録フォームを表示する。
2. The system shall アイテム登録フォームにタイトル、カテゴリ、ステータス、優先度、次にやることを必須項目として表示する。
3. The system shall アイテム登録フォームに期限、URL、メモ、総量、現在の進捗、単位、相手の名前、連絡手段を任意項目として表示する。
4. The system shall カテゴリ候補として読書、動画、勉強、人間関係、買い物、その他を選択式で表示する。
5. The system shall ステータス候補として未着手、途中、保留、完了、やめたを選択式で表示する。
6. The system shall 優先度候補として高、中、低を選択式で表示する。
7. When ユーザーが必須項目を入力して保存ボタンを押したとき, the system shall アイテムを保存する。
8. If タイトル、カテゴリ、ステータス、優先度、次にやることのいずれかが未入力のとき, the system shall 保存せずユーザーに分かる形でエラーメッセージを表示する。
9. When アイテム保存が完了したとき, the system shall 保存したアイテムを一覧画面に表示し、ダッシュボードの件数に反映する。
10. The system shall アイテム追加画面に保存ボタンとキャンセルボタンを表示する。

### Requirement 3: カテゴリ別の入力補助機能

**Priority:** P0

**Objective:** As a 個人ユーザー, I want 選択したカテゴリに合った入力欄だけを見られる, so that 不要な入力欄に迷わずシンプルに登録できる

#### Acceptance Criteria

1. When ユーザーがカテゴリを選択したとき, the system shall 選択されたカテゴリに応じて関連する入力欄を表示する。
2. When ユーザーが読書カテゴリを選択したとき, the system shall 総ページ数、現在のページ、単位ページに関する入力欄を表示する。
3. When ユーザーが動画カテゴリを選択したとき, the system shall URL、動画時間、視聴済み時間、単位分に関する入力欄を表示する。
4. When ユーザーが勉強カテゴリを選択したとき, the system shall 学習URL、全体の章数、現在の章、単位章に関する入力欄を表示する。
5. When ユーザーが人間関係カテゴリを選択したとき, the system shall 相手の名前、連絡手段、期限、メモに関する入力欄を表示する。
6. When ユーザーが買い物カテゴリを選択したとき, the system shall URL、メモ、優先度、期限に関する入力欄を表示する。
7. When ユーザーがカテゴリを変更したとき, the system shall タイトル、カテゴリ、ステータス、優先度、次にやることなどの共通項目の入力内容を保持する。

### Requirement 4: アイテム一覧表示機能

**Priority:** P0

**Objective:** As a 個人ユーザー, I want 登録したアイテムを一覧で確認できる, so that 現在抱えている後回し案件を一目で把握できる

#### Acceptance Criteria

1. When ログイン中のユーザーが一覧画面を開いたとき, the system shall そのユーザーが登録したアイテムをカード形式またはリスト形式で一覧表示する。
2. The system shall 各アイテムにタイトル、カテゴリ、ステータス、優先度を表示する。
3. The system shall 各アイテムに次にやることを表示する。
4. When アイテムに期限が設定されているとき, the system shall 期限を表示する。
5. When アイテムに進捗情報があるとき, the system shall 進捗率を表示する。
6. When アイテムにURLが登録されているとき, the system shall URLを開くボタンを表示する。
7. The system shall 各アイテムに詳細ボタン、編集ボタン、削除ボタンを表示する。
8. If 登録済みアイテムが0件のとき, the system shall 空状態メッセージを表示する。

### Requirement 5: アイテム詳細表示機能

**Priority:** P0

**Objective:** As a 個人ユーザー, I want 個別アイテムの詳細情報を確認できる, so that 一覧では表示しきれないメモやURL、進捗、連絡手段などを見られる

#### Acceptance Criteria

1. When ユーザーが一覧画面でアイテムを選択したとき, the system shall 選択されたアイテムの詳細情報を表示する。
2. The system shall 詳細画面にタイトル、カテゴリ、ステータス、優先度、次にやること、期限を表示する。
3. When アイテムにメモが登録されているとき, the system shall メモを表示する。
4. When アイテムにURLが登録されているとき, the system shall URLをリンクとして表示する。
5. When アイテムに進捗情報が登録されているとき, the system shall 進捗情報を表示する。
6. When アイテムのカテゴリが人間関係であるとき, the system shall 相手の名前と連絡手段を表示する。
7. When ユーザーが詳細画面で編集ボタンを押したとき, the system shall 編集画面へ移動できる。
8. When ユーザーが詳細画面で一覧へ戻る操作をしたとき, the system shall 一覧画面へ戻れる。

### Requirement 6: アイテム編集機能

**Priority:** P0

**Objective:** As a 個人ユーザー, I want 登録済みアイテムを編集できる, so that 進捗状況や次にやることが変わった場合に情報を更新できる

#### Acceptance Criteria

1. When ユーザーが編集ボタンを押したとき, the system shall 現在の登録内容が入力済みの編集フォームを表示する。
2. The system shall ユーザーがタイトル、カテゴリ、ステータス、優先度、次にやることを編集できるようにする。
3. The system shall ユーザーが期限、URL、メモ、進捗情報を編集できるようにする。
4. When ユーザーが編集内容を保存したとき, the system shall 該当アイテムのデータを更新する。
5. When 編集内容の保存が完了したとき, the system shall 一覧画面と詳細画面に変更内容を反映する。
6. If 編集内容に入力エラーがあるとき, the system shall 保存せずユーザーに分かる形でエラーメッセージを表示する。
7. The system shall 編集画面に保存ボタンとキャンセルボタンを表示する。

### Requirement 7: アイテム削除機能

**Priority:** P0

**Objective:** As a 個人ユーザー, I want 不要になったアイテムを削除できる, so that 誤って登録したものや不要になった後回し案件を整理できる

#### Acceptance Criteria

1. When ユーザーが削除ボタンを押したとき, the system shall 削除確認ダイアログを表示する。
2. When ユーザーが削除をキャンセルしたとき, the system shall 該当アイテムを削除しない。
3. When ユーザーが削除を確定したとき, the system shall 該当アイテムを削除する。
4. When アイテム削除が完了したとき, the system shall 一覧画面から該当アイテムを消す。
5. If 削除に失敗したとき, the system shall ユーザーに削除失敗を表示する。

### Requirement 8: フィルター機能

**Priority:** P0

**Objective:** As a 個人ユーザー, I want カテゴリ・ステータス・優先度で絞り込める, so that 登録数が増えても必要なアイテムを素早く見つけられる

#### Acceptance Criteria

1. When ユーザーがカテゴリのフィルター条件を選択したとき, the system shall 条件に一致するアイテムのみを一覧表示する。
2. When ユーザーがステータスのフィルター条件を選択したとき, the system shall 条件に一致するアイテムのみを一覧表示する。
3. When ユーザーが優先度のフィルター条件を選択したとき, the system shall 条件に一致するアイテムのみを一覧表示する。
4. When ユーザーが複数のフィルター条件を選択したとき, the system shall すべての条件に一致するアイテムのみを一覧表示する。
5. When ユーザーがフィルターを解除したとき, the system shall 絞り込み前の一覧表示に戻す。
6. If フィルター条件に一致するアイテムがないとき, the system shall その旨を表示する。

### Requirement 9: ダッシュボード機能

**Priority:** P0

**Objective:** As a 個人ユーザー, I want 現在の後回し案件の全体状況を確認できる, so that 未着手・途中・完了などの件数を把握し、放置されているものに気づける

#### Acceptance Criteria

1. When ユーザーがダッシュボードを開いたとき, the system shall 登録済みアイテムの状態別・優先度別・期限別の件数を表示する。
2. The system shall 総アイテム数を表示する。
3. The system shall 未着手、途中、保留、完了の件数を表示する。
4. The system shall 優先度高の件数を表示する。
5. The system shall 今週中に期限が来る件数を表示する。
6. The system shall 期限切れの件数を表示する。
7. The system shall ダッシュボードに今日やるリストを表示する。
8. The system shall ダッシュボードにアイテム追加ボタンを表示する。
9. If データが0件のとき, the system shall 画面レイアウトを崩さず表示する。

### Requirement 10: 進捗率の自動計算機能

**Priority:** P1

**Objective:** As a 個人ユーザー, I want 総量と現在の進捗から進捗率が自動計算される, so that 読書・動画・勉強などの進み具合を視覚的に把握できる

#### Acceptance Criteria

1. When ユーザーが総量と現在の進捗を入力したとき, the system shall 進捗率を自動計算して表示する。
2. The system shall 進捗率を0から100%の範囲で表示する。
3. If 現在の進捗が総量を超えるとき, the system shall エラーを表示する。
4. If 総量が0または未入力のとき, the system shall 進捗率を表示しない。
5. Where 読書・動画・勉強の進捗情報が含まれる, the system shall 現在量を総量で割った割合を進捗率として扱う。

### Requirement 11: 今日やるリスト機能

**Priority:** P1

**Objective:** As a 個人ユーザー, I want 登録済みアイテムから今日取り組むものを選べる, so that 登録しただけで終わらせず、その日に実行する行動へつなげられる

#### Acceptance Criteria

1. When ユーザーがアイテムの「今日やる」ボタンを押したとき, the system shall そのアイテムを今日やるリストに追加する。
2. When ユーザーがダッシュボードを開いたとき, the system shall 今日やるリストに追加されたアイテムを表示する。
3. When ユーザーが今日やるリストから外す操作をしたとき, the system shall 対象アイテムを今日やるリストから外す。
4. The system shall 今日やるリスト内のアイテムにタイトル、カテゴリ、次にやることを表示する。
5. When 今日やるリスト内のアイテムが完了ステータスになったとき, the system shall そのアイテムを今日やるリストから外す。

### Requirement 12: URLを開くボタン機能

**Priority:** P1

**Objective:** As a 個人ユーザー, I want URL付きアイテムから外部ページをすぐ開ける, so that 動画・学習ページ・記事・商品ページなどにすぐアクセスできる

#### Acceptance Criteria

1. When アイテムにURLが登録されているとき, the system shall URLを開くボタンを表示する。
2. When ユーザーがURLを開くボタンを押したとき, the system shall 新しいタブで該当URLを開く。
3. If アイテムにURLが登録されていないとき, the system shall URLを開くボタンを表示しない。
4. If ユーザーが不正なURL形式を保存しようとしたとき, the system shall 警告を表示する。

### Requirement 13: 期限切れ表示機能

**Priority:** P1

**Objective:** As a 個人ユーザー, I want 期限を過ぎた未完了アイテムが分かる, so that 放置されている後回し案件を見落としにくくなる

#### Acceptance Criteria

1. When アイテムの期限が現在日付より前であり、かつステータスが完了またはやめた以外のとき, the system shall そのアイテムを期限切れとして表示する。
2. The system shall 期限切れアイテムの件数をダッシュボードに表示する。
3. The system shall 一覧画面で期限切れアイテムが分かりやすく表示されるようにする。
4. If アイテムのステータスが完了であるとき, the system shall そのアイテムを期限切れとして扱わない。
5. If アイテムのステータスがやめたであるとき, the system shall そのアイテムを期限切れとして扱わない。
6. If アイテムに期限が設定されていないとき, the system shall そのアイテムを期限切れとして扱わない。

### Requirement 14: 今週中に期限が来るアイテム表示機能

**Priority:** P1

**Objective:** As a 個人ユーザー, I want 期限が近い未完了アイテムを確認できる, so that 近いうちに対応すべきものを早めに把握できる

#### Acceptance Criteria

1. When ユーザーがダッシュボードを開いたとき, the system shall 今日から7日以内に期限が来る未完了アイテムを表示する。
2. If アイテムのステータスが完了であるとき, the system shall そのアイテムを今週中に期限が来るアイテムとして表示しない。
3. If アイテムのステータスがやめたであるとき, the system shall そのアイテムを今週中に期限が来るアイテムとして表示しない。
4. If 対象アイテムがないとき, the system shall 「今週中の期限はありません」と表示する。

### Requirement 15: 空状態表示機能

**Priority:** P1

**Objective:** As a 個人ユーザー, I want データがない状況でも適切な案内を見られる, so that エラーなのか、データがないだけなのかを誤解しない

#### Acceptance Criteria

1. When 表示対象のアイテムが0件のとき, the system shall 状況に応じた空状態メッセージを表示する。
2. When 初回利用時にアイテムが0件のとき, the system shall 「まずはアイテムを登録しましょう」と表示する。
3. When フィルター結果が0件のとき, the system shall 「条件に一致するアイテムはありません」と表示する。
4. When 今日やるリストが空のとき, the system shall 「今日やるものはまだ選ばれていません」と表示する。
5. While 空状態を表示している, the system shall 画面レイアウトを崩さない。

### Requirement 16: パフォーマンス

**Objective:** As a 個人ユーザー, I want 通常操作がストレスなく行える速度で動作する, so that 個人利用の管理作業を中断せずに進められる

#### Acceptance Criteria

1. When ユーザーがダッシュボードを開いたとき, the system shall 通常時3秒以内に表示を完了する。
2. When ユーザーが100件以下のアイテム一覧を開いたとき, the system shall 通常時3秒以内に表示を完了する。
3. When ユーザーがアイテム登録・編集・削除を行ったとき, the system shall 通常時3秒以内に画面へ反映する。
4. When ユーザーがフィルター操作を行ったとき, the system shall 1秒以内に画面へ反映する。
5. The system shall 画像や動画ファイル本体を保存せず、過度に大きなデータ通信を発生させない。

### Requirement 17: セキュリティ

**Objective:** As a 個人ユーザー, I want 自分のデータが他人から見えない, so that 個人的な後回し案件を安全に管理できる

#### Acceptance Criteria

1. The system shall 認証済みユーザーのみがデータ取得・登録・編集・削除を行えるようにする。
2. The system shall 各アイテムに所有者を示す `user_id` を紐づける。
3. The system shall Row Level Securityを有効化し、`user_id` に基づいてログインユーザーごとにアイテムを分離する。
4. While ユーザーがログイン中である, the system shall そのユーザー自身の `user_id` に紐づくアイテムのみ取得・登録・編集・削除できるようにする。
5. If 未ログインユーザーがデータ取得・登録・編集・削除を行おうとしたとき, the system shall 操作を拒否する。
6. The system shall パスワードをアプリ側で平文保存しない。
7. The system shall 環境変数を公開リポジトリに含めない運用を前提にする。

### Requirement 18: 操作性

**Objective:** As a 個人ユーザー, I want 迷わず登録・確認・更新できる, so that 細かく管理するのが面倒な後回し案件でも続けやすくなる

#### Acceptance Criteria

1. The system shall アイテム登録画面を1分以内に入力完了できる項目量にする。
2. The system shall 主要操作へ3クリック以内で到達できるようにする。
3. When ユーザーがダッシュボードを表示しているとき, the system shall アイテム追加画面へ1クリックで移動できる導線を表示する。
4. When ユーザーが一覧画面を表示しているとき, the system shall 編集・削除・詳細表示にすぐアクセスできる導線を表示する。
5. The system shall カテゴリ・ステータス・優先度を自由入力ではなく選択式にする。
6. The system shall 必須項目と任意項目が見分けられるように表示する。
7. If エラーが発生したとき, the system shall 専門用語ではなくユーザーに分かりやすい文言で表示する。

### Requirement 19: レスポンシブ対応

**Objective:** As a 個人ユーザー, I want PCとスマホブラウザの両方で使える, so that 普段のスマホ利用と作業時のPC利用のどちらでも管理できる

#### Acceptance Criteria

1. When ユーザーが横幅375px程度のスマホ画面で利用するとき, the system shall 主要操作を実行できるように表示する。
2. When ユーザーがPC画面で利用するとき, the system shall カードまたはリストを見やすく表示する。
3. When ユーザーがスマホでフォームを入力するとき, the system shall 入力欄を画面幅に収める。
4. The system shall スマホでも押しやすいサイズのボタンを表示する。
5. The system shall 主要画面で横スクロールが発生しないように表示する。

### Requirement 20: データ整合性

**Objective:** As a 個人ユーザー, I want 不正な入力や矛盾したデータが保存されない, so that アイテム情報を信頼して見返せる

#### Acceptance Criteria

1. If タイトルが空のとき, the system shall アイテムを保存しない。
2. If 次にやることが空のとき, the system shall アイテムを保存しない。
3. If 総量または現在の進捗が0未満の値であるとき, the system shall 保存しない。
4. If 現在の進捗が総量を超えるとき, the system shall 保存しない。
5. If URL形式が不正なとき, the system shall 警告を表示する。
6. The system shall カテゴリ・ステータス・優先度として定義済みの値のみ保存できるようにする。
7. The system shall 削除操作を確認後にのみ実行する。

### Requirement 21: エラー処理

**Objective:** As a 個人ユーザー, I want 通信エラーや保存失敗が起きても状況を理解できる, so that 再試行や確認の判断ができる

#### Acceptance Criteria

1. If データ取得に失敗したとき, the system shall エラーメッセージを表示する。
2. If 保存に失敗したとき, the system shall 「保存に失敗しました。時間をおいて再試行してください」と表示する。
3. If 削除に失敗したとき, the system shall 「削除に失敗しました」と表示する。
4. While データ取得・保存・削除などの処理中である, the system shall 処理中であることが分かる表示を出す。
5. If エラーが発生したとき, the system shall 画面全体が真っ白にならないようにする。

### Requirement 22: 保守性

**Objective:** As a 開発者, I want 機能追加や変更を理解しやすい構成にできる, so that 初期リリース後の機能追加時に既存機能を壊しにくくなる

#### Acceptance Criteria

1. The system shall コンポーネントを機能ごとに分割できる構成にする。
2. The system shall 型定義を整理できる構成にする。
3. The system shall カテゴリ・ステータス・優先度の定義をコード内で重複させない。
4. The system shall データ保存や取得に関する処理を専用の場所で扱える構成にする。
5. The system shall UIコンポーネントとデータ取得処理を過度に混在させない。

### Requirement 23: 拡張性

**Objective:** As a 開発者, I want 初期リリース後に機能追加しやすいデータ構造にできる, so that 将来の拡張時に既存データを大きく作り直さずに済む

#### Acceptance Criteria

1. The system shall カテゴリを増やしても既存データに大きな影響が出にくい構造を持つ。
2. The system shall 初期リリース対象外の機能を実装しなくても、既存のアイテム管理を妨げない構造を持つ。
3. The system shall 将来的に期限を使う機能を追加できるよう期限情報を保持する。
4. The system shall 将来的に外部URLに関する機能を追加できるようURL情報を保持する。

### Requirement 24: プライバシー

**Objective:** As a 個人ユーザー, I want 人間関係カテゴリを含む個人的な情報が本人以外に見えない, so that 安心して後回し案件を登録できる

#### Acceptance Criteria

1. The system shall ユーザー本人以外が人間関係カテゴリの内容を閲覧できないようにする。
2. The system shall 初期リリースで共有機能を提供しない。
3. The system shall 初期リリースで公開ページを提供しない。
4. The system shall データをログインユーザー単位で分離する。

### Requirement 25: ブラウザ対応

**Objective:** As a 個人ユーザー, I want 主要なモダンブラウザで利用できる, so that 普段使っているPCやスマホからアクセスできる

#### Acceptance Criteria

1. The system shall 最新版のGoogle Chromeで利用できる。
2. The system shall 最新版のSafariで利用できる。
3. The system shall スマホ版Safariで主要操作を実行できる。
4. The system shall JavaScriptが無効な環境をサポート対象外とする。
