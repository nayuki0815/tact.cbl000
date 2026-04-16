'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type UserEmail = string | null

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState<UserEmail>(null)
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
      <main className="min-h-screen flex items-center justify-center">
        <p>読み込み中...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 p-6">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-sm text-gray-400">ログイン中: {email}</p>

        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-white px-4 py-2 font-semibold text-black"
        >
          ログアウト
        </button>
      </div>
    </main>
  )
}