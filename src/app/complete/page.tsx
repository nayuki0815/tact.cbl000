'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export default function CompletePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      setLoading(false)
    }
    checkUser()
  }, [])

  if (loading)
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <p className="p-8">読み込み中...</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 p-8 text-center">
        <h1 className="text-2xl font-bold">申込を受け付けました</h1>
        <p className="text-sm text-gray-600">
          担当者よりご連絡いたします。しばらくお待ちください。
        </p>

        <div className="space-y-3 pt-2">
          <Link
            href="/profile"
            className="block w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            プロフィールを編集する
          </Link>

          <Link
            href="/dashboard"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50"
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
