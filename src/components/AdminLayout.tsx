'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase/client'

const SIDEBAR_BG = '#081423'
const SIDEBAR_BORDER = 'rgba(201, 168, 76, 0.2)'
const MAIN_BG = '#0a1829'
const GOLD = '#c9a84c'
const TEXT_MUTED = '#9ab0cc'
const TEXT_WHITE = '#ffffff'
const ACTIVE_BG = 'rgba(201, 168, 76, 0.08)'
const HOVER_BG = 'rgba(255, 255, 255, 0.05)'

const MENU = [
  { href: '/admin', label: 'ダッシュボード' },
  { href: '/admin/applications', label: '申込一覧' },
  { href: '/admin/users', label: 'ユーザー一覧' },
  { href: '/admin/settings', label: '設定' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle()

      if (!adminRow) { router.replace('/mypage'); return }

      setEmail(user.email ?? null)
      setLoading(false)
    }

    check()
  }, [router])

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: MAIN_BG, color: TEXT_WHITE }}
      >
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: MAIN_BG }}>
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          backgroundColor: SIDEBAR_BG,
          borderRight: `1px solid ${SIDEBAR_BORDER}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
          <Link
            href="/admin"
            style={{
              color: GOLD,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textDecoration: 'none',
            }}
          >
            CBL 管理
          </Link>
        </div>
        <nav style={{ flex: 1, paddingTop: 12, paddingBottom: 12 }}>
          {MENU.map(item => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </aside>

      <div style={{ marginLeft: 240 }}>
        <header
          style={{
            backgroundColor: SIDEBAR_BG,
            borderBottom: `1px solid ${SIDEBAR_BORDER}`,
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: TEXT_MUTED, fontSize: 14 }}>
            管理者:{' '}
            <span style={{ color: TEXT_WHITE, fontWeight: 500 }}>{email}</span>
          </span>
          <Link
            href="/mypage"
            className="hover:opacity-80 transition"
            style={{ color: GOLD, fontSize: 14, textDecoration: 'none' }}
          >
            マイページへ →
          </Link>
        </header>
        <main style={{ padding: '24px', color: TEXT_WHITE }}>{children}</main>
      </div>
    </div>
  )
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const bg = active ? ACTIVE_BG : hovered ? HOVER_BG : 'transparent'
  const color = active ? GOLD : TEXT_MUTED

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        padding: '12px 20px',
        color,
        backgroundColor: bg,
        borderLeft: active ? `3px solid ${GOLD}` : '3px solid transparent',
        fontSize: 14,
        textDecoration: 'none',
        transition: 'background-color 0.15s',
      }}
    >
      {label}
    </Link>
  )
}
