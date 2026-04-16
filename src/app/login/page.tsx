'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('login result', { data, error })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('ログイン成功。dashboardへ移動します。')
    setLoading(false)

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 p-6"
      >
        <h1 className="text-2xl font-bold">ログイン</h1>

        <div className="space-y-2">
          <label className="block text-sm">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2"
            required
          />
        </div>

        {message && <p className="text-sm text-red-400">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white px-4 py-2 font-semibold text-black disabled:opacity-50"
        >
          {loading ? 'ログイン中...' : 'ログインする'}
        </button>
      </form>
    </main>
  )
}