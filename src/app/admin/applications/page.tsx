'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

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
  const router = useRouter()
  const [apps, setApps] = useState<Application[]>([])
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({})
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      // 管理者判定
      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle()

      if (!adminRow) { router.replace('/dashboard'); return }

      // 全申込取得（RLS により管理者は全件閲覧可）
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

      // プロフィール（氏名表示用）を一括取得
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
    init()
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
    const base = 'inline-block px-2 py-0.5 rounded text-xs font-medium'
    switch (status) {
      case 'approved':
        return <span className={`${base} bg-green-100 text-green-800`}>承認済</span>
      case 'rejected':
        return <span className={`${base} bg-red-100 text-red-800`}>否認</span>
      case 'pending':
      default:
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>保留中</span>
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

  if (loading)
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <p className="p-8">読み込み中...</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">申込一覧（管理者）</h1>
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:underline"
          >
            ← ダッシュボードへ
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {apps.length === 0 ? (
          <p className="text-gray-500">申込はまだありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-3 py-2">申込日時</th>
                  <th className="text-left px-3 py-2">氏名</th>
                  <th className="text-left px-3 py-2">投資目的</th>
                  <th className="text-left px-3 py-2">希望サービス</th>
                  <th className="text-left px-3 py-2">ステータス</th>
                  <th className="text-left px-3 py-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a.id} className="border-b align-top">
                    <td className="px-3 py-2 whitespace-nowrap">{formatDate(a.created_at)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{fullName(a.user_id)}</td>
                    <td className="px-3 py-2">{a.investment_purpose ?? '—'}</td>
                    <td className="px-3 py-2">{a.desired_services?.join(', ') ?? '—'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{statusBadge(a.status)}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(a.id, 'approved')}
                          disabled={updatingId === a.id || a.status === 'approved'}
                          className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                        >
                          承認
                        </button>
                        <button
                          onClick={() => updateStatus(a.id, 'rejected')}
                          disabled={updatingId === a.id || a.status === 'rejected'}
                          className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                        >
                          否認
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
