'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

const PAGE_BG = '#0a1829'
const CARD_BG = '#0d1f3c'
const BORDER = 'rgba(201, 168, 76, 0.3)'
const GOLD = '#c9a84c'
const NAVY = '#0d1f3c'
const TEXT_WHITE = '#ffffff'
const TEXT_MUTED = '#9ab0cc'

const inputStyle = {
  backgroundColor: '#ffffff',
  color: '#0d1f3c',
  border: '1px solid rgba(201, 168, 76, 0.4)',
}

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

    setMessage('登録できました。マイページへ移動します。')
    setLoading(false)

    if (data.session) {
      router.push('/mypage')
    } else {
      router.push('/login')
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}
    >
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-4 rounded-2xl p-6 sm:p-8"
        style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}
      >
        <h1 className="text-2xl font-bold" style={{ color: TEXT_WHITE }}>新規登録</h1>

        <div className="space-y-2">
          <label className="block text-sm" style={{ color: TEXT_WHITE }}>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg px-3 py-2"
            style={inputStyle}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm" style={{ color: TEXT_WHITE }}>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg px-3 py-2"
            style={inputStyle}
            required
          />
        </div>

        {message && <p className="text-sm" style={{ color: '#fca5a5' }}>{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition disabled:opacity-50"
          style={{ backgroundColor: GOLD, color: NAVY }}
        >
          {loading ? '登録中...' : '登録する'}
        </button>

        <p className="text-center text-sm pt-2" style={{ color: TEXT_MUTED }}>
          すでにアカウントをお持ちの方は
          <Link
            href="/login"
            className="ml-1 hover:opacity-80 transition"
            style={{ color: GOLD }}
          >
            ログイン
          </Link>
        </p>
      </form>
    </main>
  )
}
