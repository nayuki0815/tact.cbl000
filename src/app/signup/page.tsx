'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const response = await supabase.auth.signUp({
      email,
      password,
    })

    console.log('signUp response:', response)

    const { data, error } = response

    if (error) {
      console.error('signUp error object:', error)
      console.error('signUp error details:', {
        message: error.message,
        status: error.status,
        name: error.name,
        code: (error as { code?: string }).code,
      })
      setMessage(`${error.message} (status=${error.status ?? 'n/a'})`)
      setLoading(false)
      return
    }

    console.log('signUp success. user:', data.user, 'session:', data.session)

    setMessage('登録できました。次にログインしてください。')
    setLoading(false)
    router.push('/login')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 p-6"
      >
        <h1 className="text-2xl font-bold">新規登録</h1>

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
          {loading ? '登録中...' : '登録する'}
        </button>
      </form>
    </main>
  )
}