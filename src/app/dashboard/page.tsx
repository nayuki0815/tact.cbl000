'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type UserEmail = string | null

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState<UserEmail>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        router.replace('/login')
        return
      }

      setEmail(data.user.email ?? null)

      // 自分の admin_users 行が存在するかで管理者判定
      // RLS: 自分の行しか見えないので空なら非管理者
      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', data.user.email)
        .maybeSingle()

      setIsAdmin(!!adminRow)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <p>読み込み中...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 p-6">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-sm text-gray-500">ログイン中: {email}</p>

        <Link
          href="/profile"
          className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700"
        >
          プロフィール編集
        </Link>

        <Link
          href="/apply"
          className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700"
        >
          申込する
        </Link>

        {isAdmin && (
          <Link
            href="/admin/applications"
            className="block w-full rounded-lg bg-amber-500 px-4 py-2 text-center font-semibold text-black hover:bg-amber-400"
          >
            管理画面
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50"
        >
          ログアウト
        </button>
      </div>
    </main>
  )
}
