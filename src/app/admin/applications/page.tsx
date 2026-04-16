'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'
import AdminLayout from '../../../components/AdminLayout'

const NAVY = '#0d1f3c'
const GOLD = '#c9a84c'
const BORDER = 'rgba(201, 168, 76, 0.3)'
const ROW_BORDER = 'rgba(201, 168, 76, 0.15)'
const HEADER_BG = '#081423'
const TEXT_WHITE = '#ffffff'
const TEXT_MUTED = '#9ab0cc'

type Application = {
  id: string
  user_id: string | null
  investment_experience: boolean | null
  investment_purpose: string | null
  investment_type: string | null
  self_funding: number | null
  existing_loan: string | null
  desired_services: string[] | null
  status: string | null
  created_at: string
}

type ProfileLite = {
  id: string
  last_name: string | null
  first_name: string | null
}

export default function AdminApplicationsPage() {
  const supabase = createClient()
  const [apps, setApps] = useState<Application[]>([])
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({})
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: appsData, error: appsErr } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (appsErr) {
        setError('申込の取得に失敗しました')
        setLoading(false)
        return
      }

      const applications = (appsData ?? []) as Application[]
      setApps(applications)

      const userIds = Array.from(
        new Set(applications.map(a => a.user_id).filter((v): v is string => !!v))
      )

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, last_name, first_name')
          .in('id', userIds)

        const map: Record<string, ProfileLite> = {}
        ;(profilesData ?? []).forEach(p => { map[p.id] = p as ProfileLite })
        setProfiles(map)
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  const updateStatus = async (id: string, next: 'approved' | 'rejected') => {
    setUpdatingId(id)
    setError('')

    const { error: updateErr } = await supabase
      .from('applications')
      .update({ status: next })
      .eq('id', id)

    if (updateErr) {
      setError('ステータス更新に失敗しました')
      setUpdatingId(null)
      return
    }

    setApps(prev => prev.map(a => a.id === id ? { ...a, status: next } : a))
    setUpdatingId(null)
  }

  const fullName = (userId: string | null) => {
    if (!userId) return '—'
    const p = profiles[userId]
    if (!p) return '（未登録）'
    const name = [p.last_name, p.first_name].filter(Boolean).join(' ')
    return name || '（未登録）'
  }

  const statusBadge = (status: string | null) => {
    const base: React.CSSProperties = {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
    }
    switch (status) {
      case 'approved':
        return <span style={{ ...base, backgroundColor: '#dcfce7', color: '#166534' }}>承認済</span>
      case 'rejected':
        return <span style={{ ...base, backgroundColor: '#fee2e2', color: '#991b1b' }}>否認</span>
      case 'pending':
      default:
        return <span style={{ ...base, backgroundColor: '#fef3c7', color: '#92400e' }}>保留中</span>
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ color: TEXT_WHITE }}>
        申込一覧
      </h1>

      {error && (
        <p className="mb-4 text-sm" style={{ color: '#fca5a5' }}>{error}</p>
      )}

      {loading ? (
        <p style={{ color: TEXT_MUTED }}>読み込み中...</p>
      ) : apps.length === 0 ? (
        <p style={{ color: TEXT_MUTED }}>申込はまだありません</p>
      ) : (
        <div
          className="overflow-x-auto rounded-lg"
          style={{ backgroundColor: NAVY, border: `1px solid ${BORDER}` }}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: HEADER_BG, color: GOLD }}>
                <th className="text-left px-3 py-2 font-semibold">申込日時</th>
                <th className="text-left px-3 py-2 font-semibold">氏名</th>
                <th className="text-left px-3 py-2 font-semibold">投資目的</th>
                <th className="text-left px-3 py-2 font-semibold">希望サービス</th>
                <th className="text-left px-3 py-2 font-semibold">ステータス</th>
                <th className="text-left px-3 py-2 font-semibold">操作</th>
                <th className="text-left px-3 py-2 font-semibold">詳細</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr
                  key={a.id}
                  className="align-top"
                  style={{ borderTop: `1px solid ${ROW_BORDER}`, color: TEXT_WHITE }}
                >
                  <td className="px-3 py-2 whitespace-nowrap" style={{ color: TEXT_MUTED }}>
                    {formatDate(a.created_at)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{fullName(a.user_id)}</td>
                  <td className="px-3 py-2">{a.investment_purpose ?? '—'}</td>
                  <td className="px-3 py-2" style={{ color: TEXT_MUTED }}>
                    {a.desired_services?.join(', ') ?? '—'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{statusBadge(a.status)}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(a.id, 'approved')}
                        disabled={updatingId === a.id || a.status === 'approved'}
                        className="px-3 py-1 rounded text-xs font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: GOLD, color: NAVY }}
                      >
                        承認
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, 'rejected')}
                        disabled={updatingId === a.id || a.status === 'rejected'}
                        className="px-3 py-1 rounded text-xs font-semibold hover:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ border: `1px solid ${GOLD}`, color: GOLD, backgroundColor: 'transparent' }}
                      >
                        否認
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Link
                      href={`/admin/applications/${a.id}`}
                      className="inline-block px-3 py-1 rounded text-xs font-semibold hover:opacity-80 transition"
                      style={{ border: `1px solid ${GOLD}`, color: GOLD }}
                    >
                      詳細・チャット
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
