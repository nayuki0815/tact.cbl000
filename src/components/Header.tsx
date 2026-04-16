'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase/client'

const NAVY = '#0d1f3c'
const GOLD = '#c9a84c'

export default function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <header style={{ backgroundColor: NAVY }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-widest"
          style={{ color: GOLD }}
        >
          CBL
        </Link>

        <Link
          href="/mypage"
          className="text-sm hover:opacity-80 transition"
          style={{ color: '#ffffff' }}
        >
          マイページ
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-md px-3 sm:px-4 py-1.5 text-sm hover:opacity-80 transition"
          style={{ border: `1px solid ${GOLD}`, color: GOLD, backgroundColor: 'transparent' }}
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}
