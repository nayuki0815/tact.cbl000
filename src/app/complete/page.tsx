'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import Header from '../../components/Header'

const PAGE_BG = '#0a1829'
const CARD_BG = '#0d1f3c'
const BORDER = 'rgba(201, 168, 76, 0.3)'
const GOLD = '#c9a84c'
const NAVY = '#0d1f3c'
const TEXT_WHITE = '#ffffff'
const TEXT_MUTED = '#9ab0cc'

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
      <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}>
        <Header />
        <p className="p-8">読み込み中...</p>
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}>
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md space-y-6 rounded-2xl p-8 text-center"
          style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}
        >
          <h1 className="text-2xl font-bold" style={{ color: TEXT_WHITE }}>
            申込を受け付けました
          </h1>
          <p className="text-sm" style={{ color: TEXT_MUTED }}>
            担当者よりご連絡いたします。しばらくお待ちください。
          </p>

          <div className="space-y-3 pt-2">
            <Link
              href="/profile"
              className="block w-full rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              プロフィールを編集する
            </Link>

            <Link
              href="/mypage"
              className="block w-full rounded-lg px-4 py-2 font-semibold hover:opacity-80 transition"
              style={{ border: `1px solid ${GOLD}`, color: GOLD, backgroundColor: 'transparent' }}
            >
              マイページへ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
