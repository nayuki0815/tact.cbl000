'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import Header from '../../components/Header'

const NAVY = '#0d1f3c'
const GOLD = '#c9a84c'
const PAGE_BG = '#0a1829'
const CARD_BG = '#0d1f3c'
const LABEL_BG = '#081423'
const CARD_BORDER = 'rgba(201, 168, 76, 0.3)'
const TEXT_WHITE = '#ffffff'
const TEXT_MUTED = '#9ab0cc'
const FOOTER_TEXT = '#4a6080'

type AppStatus = 'pending' | 'approved' | 'rejected' | null

type LatestApplication = {
  id: string
  status: AppStatus
} | null

export default function MyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState<string>('会員')
  const [hasProfile, setHasProfile] = useState(false)
  const [latestApp, setLatestApp] = useState<LatestApplication>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const init = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.replace('/login')
        return
      }

      const userId = data.user.id
      const userEmail = data.user.email

      const [{ data: profile }, { data: apps }, { data: adminRow }] = await Promise.all([
        supabase
          .from('profiles')
          .select('last_name, first_name')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('applications')
          .select('id, status')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('admin_users')
          .select('id')
          .eq('email', userEmail)
          .maybeSingle(),
      ])

      if (profile?.last_name) {
        const name = [profile.last_name, profile.first_name].filter(Boolean).join(' ')
        setDisplayName(name || '会員')
        setHasProfile(true)
      }

      if (apps && apps.length > 0) {
        const a = apps[0]
        setLatestApp({ id: a.id as string, status: (a.status as AppStatus) ?? 'pending' })
      }

      setIsAdmin(!!adminRow)
      setLoading(false)
    }

    init()
  }, [router])

  const loanBadge = () => {
    if (!latestApp) return badge('未申込', '#e5e7eb', '#4b5563')
    switch (latestApp.status) {
      case 'approved':
        return badge('承認済', '#dcfce7', '#166534')
      case 'rejected':
        return badge('否認', '#fee2e2', '#991b1b')
      case 'pending':
      default:
        return badge('審査中', '#fef3c7', '#92400e')
    }
  }

  const profileBadge = () =>
    hasProfile
      ? badge('登録済', '#dcfce7', '#166534')
      : badge('未登録', '#e5e7eb', '#4b5563')

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}
      >
        <p>読み込み中...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}>
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8 sm:mb-10 flex items-end justify-between flex-wrap gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">
            <span style={{ color: GOLD }}>{displayName}</span>
            <span style={{ color: TEXT_WHITE }}> さまのご利用状況</span>
          </h1>
          {isAdmin && (
            <Link
              href="/admin/applications"
              className="text-sm hover:opacity-80 transition"
              style={{ color: GOLD, borderBottom: `1px solid ${GOLD}` }}
            >
              管理画面へ →
            </Link>
          )}
        </div>

        <div className="space-y-4 sm:space-y-5">
          <ServiceCard
            label="SERVICE 01"
            title="ローン紹介"
            description="複数の金融機関から最適なローンをご紹介します"
            badgeEl={loanBadge()}
            actionHref="/apply"
            actionLabel={latestApp ? 'もう一度申込む' : '申込む'}
            secondaryHref={latestApp ? `/chat/${latestApp.id}` : undefined}
            secondaryLabel="担当者へ連絡"
          />

          <ServiceCard
            label="SERVICE 02"
            title="プロフィール"
            description="お客様情報を登録・更新できます"
            badgeEl={profileBadge()}
            actionHref="/profile"
            actionLabel="編集する"
          />
        </div>

        <p className="mt-10 text-xs" style={{ color: FOOTER_TEXT }}>
          ご不明点はサポート窓口までお問い合わせください。
        </p>
      </div>
    </main>
  )
}

function badge(text: string, bg: string, fg: string) {
  return (
    <span
      className="inline-block px-2.5 py-1 rounded text-xs font-semibold"
      style={{ backgroundColor: bg, color: fg }}
    >
      {text}
    </span>
  )
}

function ServiceCard({
  label,
  title,
  description,
  badgeEl,
  actionHref,
  actionLabel,
  secondaryHref,
  secondaryLabel,
}: {
  label: string
  title: string
  description: string
  badgeEl: React.ReactNode
  actionHref: string
  actionLabel: string
  secondaryHref?: string
  secondaryLabel?: string
}) {
  return (
    <div
      className="rounded-lg overflow-hidden flex flex-col sm:flex-row"
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
      }}
    >
      <div
        className="hidden sm:flex items-center justify-center px-6"
        style={{ backgroundColor: LABEL_BG, color: GOLD, width: '160px' }}
      >
        <span className="text-xs tracking-[0.2em] font-semibold">{label}</span>
      </div>
      <div
        className="sm:hidden px-5 py-2 text-xs tracking-[0.2em] font-semibold"
        style={{ backgroundColor: LABEL_BG, color: GOLD }}
      >
        {label}
      </div>

      <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: TEXT_WHITE }}>
              {title}
            </h2>
            {badgeEl}
          </div>
          <p className="text-sm" style={{ color: TEXT_MUTED }}>
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="rounded-md px-5 py-2.5 text-center text-sm font-semibold hover:opacity-80 transition whitespace-nowrap"
              style={{
                border: `1px solid ${GOLD}`,
                color: GOLD,
                backgroundColor: 'transparent',
              }}
            >
              {secondaryLabel}
            </Link>
          )}
          <Link
            href={actionHref}
            className="rounded-md px-5 py-2.5 text-center text-sm font-semibold hover:opacity-90 transition whitespace-nowrap"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}
