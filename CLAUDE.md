# CBL プロジェクト ガイドライン

## プロジェクト概要
招待制・士業連携のローン紹介プラットフォーム。
Next.js + Supabase で構築した顧客登録・申込・管理システム。

## 技術スタック
- Next.js 14（App Router、src/ ディレクトリ構成）
- Supabase（Auth + PostgreSQL + Realtime）
- Tailwind CSS（レイアウト・余白のみ）+ インラインスタイル（色指定）
- Vercel（デプロイ）

## Supabase クライアント（必ず守る）
- 必ず src/lib/supabase/client.ts の createClient を import して使う
- @supabase/auth-helpers-nextjs は存在しない・使わない
- トリガー関数は必ず security definer set search_path = public を付ける

## カラーパレット（全ページ統一）
- ページ背景: #0a1829
- カード・フォーム背景: #0d1f3c
- フッター・サイドバー背景: #081423
- ゴールド（アクセント）: #c9a84c
- メインテキスト: #ffffff
- サブテキスト: #9ab0cc
- 入力欄背景: #ffffff
- 入力欄文字: #0d1f3c
- 枠線: rgba(201, 168, 76, 0.3)

## コーディングルール
- 色指定はすべてインラインスタイルで行う（Tailwind カスタムカラーは使わない）
- レイアウト・余白・グリッドは Tailwind クラスを使ってよい
- 'use client' はインタラクションが必要なページのみ付ける
- 未ログインの場合は /login へリダイレクト
- 管理者以外が /admin にアクセスした場合は /mypage へリダイレクト

## ページ構成
| パス | 説明 |
|------|------|
| / | トップページ（静的・招待制訴求） |
| /login | ログイン |
| /signup | 新規登録 |
| /mypage | マイページ（ログイン後のホーム） |
| /profile | プロフィール編集 |
| /apply | 申込フォーム |
| /complete | 申込完了 |
| /chat/[applicationId] | ユーザー側チャット |
| /admin | 管理ダッシュボード（件数サマリ） |
| /admin/applications | 申込一覧 |
| /admin/applications/[id] | 申込詳細・管理者チャット |
| /admin/users | ユーザー一覧 |
| /admin/settings | 設定（管理者一覧） |

## コンポーネント
| ファイル | 説明 |
|----------|------|
| src/components/Header.tsx | 顧客向け共通ヘッダー |
| src/components/AdminLayout.tsx | 管理画面サイドメニューレイアウト |

## DB テーブル構成
| テーブル | 用途 |
|----------|------|
| profiles | ユーザープロフィール（auth.users と1対1） |
| applications | 申込情報 |
| messages | チャットメッセージ（application_id で紐づく） |
| admin_users | 管理者メールアドレス一覧 |

## RLS 設計方針
- profiles: 自分のレコードのみ操作可 / 管理者は全件SELECT可
- applications: 自分のレコードのみ操作可 / 管理者は全件SELECT・UPDATE可
- messages: 関係者（送信者・申込ユーザー・管理者）のみ閲覧可
- admin_users: RLS有効・ポリシーなし（service_role のみ操作可）

## 新機能追加時のチェックリスト
- [ ] カラーパレットに合わせたインラインスタイルで実装
- [ ] createClient パターンを使用
- [ ] RLS ポリシーを追加
- [ ] 未ログイン・非管理者のリダイレクト処理を追加
- [ ] Header または AdminLayout を適用
