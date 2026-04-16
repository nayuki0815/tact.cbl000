# CBL アプリ Phase 2 実装記録

## 概要

Next.js + Supabase を使った顧客登録・申込プラットフォームの実装記録。
Phase 1（デプロイ・Auth実装）を土台に、Phase 2 でプロフィール保存・申込フォーム・管理画面を実装した。

---

## 技術スタック

- **フロント**: Next.js 14（App Router）
- **DB・Auth**: Supabase（PostgreSQL）
- **スタイル**: Tailwind CSS（ライト系）
- **デプロイ**: Vercel

---

## 実装の流れ

### Step 1: Supabase テーブル設計・作成

#### profiles テーブル（ユーザープロフィール）

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  last_name text,
  first_name text,
  last_name_kana text,
  first_name_kana text,
  gender text,
  birth_date date,
  phone text,
  occupation text,
  years_employed integer,
  annual_income integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "プロフィールinsert許可"
  on profiles for insert
  with check (true);

create policy "自分のプロフィールのみ読み書き可"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

#### applications テーブル（申込情報）

```sql
create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  investment_experience boolean,
  investment_purpose text,
  investment_type text,
  self_funding integer,
  existing_loan text,
  desired_services text[],
  status text default 'pending',
  created_at timestamptz default now()
);

alter table applications enable row level security;

create policy "自分の申込のみ操作可"
  on applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

#### admin_users テーブル（管理者）

```sql
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

alter table admin_users enable row level security;

-- 管理者を登録
insert into admin_users (email) values ('your@email.com');
```

---

### Step 2: ページ実装

| ページ | パス | 機能 |
|--------|------|------|
| プロフィール | `/profile` | 個人情報の入力・保存（upsert） |
| 申込フォーム | `/apply` | 投資情報の入力・送信（insert） |
| 完了画面 | `/complete` | 申込完了メッセージ |
| 管理画面 | `/admin/applications` | 申込一覧・承認/否認 |
| ダッシュボード | `/dashboard` | 各ページへのナビゲーション |

---

### Step 3: 管理者機能

- `admin_users` テーブルにメールが存在するユーザーのみ管理画面を表示
- 管理者は全ユーザーの申込を閲覧・ステータス変更可能
- RLS の OR 結合により、一般ユーザーは自分のデータのみアクセス可

---

### Step 4: Vercel デプロイ

```bash
git add .
git commit -m "feat: add profile, apply, admin pages"
git push origin main
```

Vercel は GitHub の main ブランチへの push で自動デプロイ。

---

## 躓いた点と解決策

### 1. Supabase クライアントの選択ミス

**問題**  
最初の指示で `@supabase/auth-helpers-nextjs` の `createClientComponentClient` を使うコードを提示したが、プロジェクトは非推奨パッケージのため未インストールだった。

**解決**  
既存の `@supabase/ssr` を使った `src/lib/supabase/client.ts` の `createClient` に統一。Claude Code が既存コードベースを読んで指摘してくれた。

**教訓**  
- Claude（チャット）はコードベースを直接見ていない
- Claude Code はローカルファイルを読んでいる
- 矛盾があれば Claude Code の判断を優先する

---

### 2. テーブルが存在しない（404エラー）

**問題**  
`/apply` 送信時に 404 エラー。`applications` テーブルが未作成だった。

**エラー**
```
Failed to load resource: the server responded with a status of 404
```

**解決**  
SQL Editor で `applications` テーブルを作成。

**教訓**  
UI実装の前に必ずテーブル作成SQLを実行する。

---

### 3. profiles カラム不足（400エラー）

**問題**  
`/profile` 保存時に 400 エラー。`ALTER TABLE` でのカラム追加が未実行だった。

**エラー**
```
Failed to load resource: the server responded with a status of 400
```

**解決**  
`alter table profiles add column if not exists ...` を実行。

---

### 4. サインアップ 500 エラー（最大の躓き）

**問題**  
新規ユーザー登録時に `Database error saving new user` の 500 エラー。

**調査過程**
1. `handle_new_user` トリガー関数の定義を確認 → 内容は正常
2. トリガーを無効化してもエラー → トリガーは原因ではない
3. profiles の RLS ポリシーを修正 → 改善せず
4. トリガーと関数を完全削除 → Supabase ダッシュボードからのユーザー追加が成功

**原因**  
`security definer` 関数に `set search_path = public` が指定されていなかった。
`security definer` で動く関数はどのスキーマを参照するか曖昧になるため、`profiles` テーブルを見つけられずエラーになっていた。

**解決**

```sql
-- NG（search_path 未指定）
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

-- OK（search_path 明示）
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;
```

**教訓**  
Supabase のトリガー関数は必ず `security definer set search_path = public` をセットで書く。

---

### 5. RLS ポリシーの設計ミス

**問題**  
サインアップ直後はセッションが未確立のため `auth.uid()` が `null` になり、トリガー経由の profiles INSERT が RLS に弾かれた。

**解決**  
INSERT ポリシーを分離して `with check (true)` に変更。

```sql
-- INSERT は全員許可（トリガー経由のため）
create policy "プロフィールinsert許可"
  on profiles for insert
  with check (true);

-- SELECT/UPDATE/DELETE は自分のみ
create policy "自分のプロフィールのみ読み書き可"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

**教訓**  
トリガー経由の INSERT と、ユーザー操作の INSERT は分けてポリシーを設計する。

---

## 今後の拡張候補

- [ ] 申込一覧のフィルタ（ステータス別・期間別）
- [ ] ページネーション
- [ ] 承認/否認時の確認ダイアログ
- [ ] 承認操作ログ（reviewed_by / reviewed_at）
- [ ] メール通知（承認時に顧客へ送信）
- [ ] 中野アプリとの連携

---

## Supabase vs AWS 使い分け

| | Supabase | AWS |
|---|---|---|
| 向いてる規模 | 小〜中規模 | 中〜大規模 |
| 初期コスト | 無料〜低コスト | 高め |
| 管理の手間 | ほぼ不要 | 自分で管理 |
| カスタマイズ | 制限あり | 自由度高い |

今回学んだ Auth・RLS・トリガーの概念は PostgreSQL の知識なので、AWS に移行しても同じ設計思想で作れる。

