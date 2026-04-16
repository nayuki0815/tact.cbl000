'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold">Phase 1 start</h1>
        <p className="text-sm text-gray-400">
          Supabase auth training app
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-4 py-2 text-black font-semibold"
          >
            新規登録
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white px-4 py-2 text-white"
          >
            ログイン
          </Link>
        </div>
      </div>
    </main>
  )
}