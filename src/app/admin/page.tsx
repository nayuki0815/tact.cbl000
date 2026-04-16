'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import AdminLayout from '../../components/AdminLayout'

const NAVY = '#0d1f3c'
const GOLD = '#c9a84c'
const BORDER = 'rgba(201, 168, 76, 0.3)'
const TEXT_WHITE = '#ffffff'

type Counts = {
  total: number | null
  pending: number | null
  approved: number | null
  rejected: number | null
  users: number | null
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts>({
    total: null,
    pending: null,
    approved: null,
    rejected: null,
    users: null,
  })

  useEffect(() => {
    const supabase = createClient()

    const fetchCounts = async () => {
      const [total, pending, approved, rejected, users] = await Promise.all([
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved'),
        supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])

      setCounts({
        total: total.count,
        pending: pending.count,
        approved: approved.count,
        rejected: rejected.count,
        users: users.count,
      })
    }

    fetchCounts()
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ color: TEXT_WHITE }}>
        ダッシュボード
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="総申込件数" value={counts.total} />
        <StatCard label="保留中" value={counts.pending} />
        <StatCard label="承認済" value={counts.approved} />
        <StatCard label="否認" value={counts.rejected} />
        <StatCard label="総ユーザー数" value={counts.users} />
      </div>
    </AdminLayout>
  )
}

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div
      className="rounded-lg p-5"
      style={{ backgroundColor: NAVY, border: `1px solid ${BORDER}` }}
    >
      <p
        className="text-xs uppercase tracking-widest mb-3"
        style={{ color: GOLD }}
      >
        {label}
      </p>
      <p className="text-3xl font-bold" style={{ color: TEXT_WHITE }}>
        {value === null ? '…' : value.toLocaleString()}
      </p>
    </div>
  )
}
