'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase/client'
import AdminLayout from '../../../components/AdminLayout'

const NAVY = '#0d1f3c'
const GOLD = '#c9a84c'
const BORDER = 'rgba(201, 168, 76, 0.3)'
const ROW_BORDER = 'rgba(201, 168, 76, 0.15)'
const HEADER_BG = '#081423'
const TEXT_WHITE = '#ffffff'
const TEXT_MUTED = '#9ab0cc'

type UserRow = {
  id: string
  last_name: string | null
  first_name: string | null
  phone: string | null
  occupation: string | null
  annual_income: number | null
  created_at: string | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    const fetchUsers = async () => {
      const { data, error: fetchErr } = await supabase
        .from('profiles')
        .select('id, last_name, first_name, phone, occupation, annual_income, created_at')
        .order('created_at', { ascending: false })

      if (fetchErr) {
        setError('ユーザーの取得に失敗しました')
        setLoading(false)
        return
      }

      setUsers((data ?? []) as UserRow[])
      setLoading(false)
    }

    fetchUsers()
  }, [])

  const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    try {
      return new Date(iso).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return iso
    }
  }

  const formatIncome = (income: number | null) => {
    if (income == null) return '—'
    return `${Math.round(income / 10000).toLocaleString()} 万円`
  }

  const fullName = (u: UserRow) => {
    const name = [u.last_name, u.first_name].filter(Boolean).join(' ')
    return name || '（未登録）'
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ color: TEXT_WHITE }}>
        ユーザー一覧
      </h1>

      {error && (
        <p className="mb-4 text-sm" style={{ color: '#fca5a5' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: TEXT_MUTED }}>読み込み中...</p>
      ) : users.length === 0 ? (
        <p style={{ color: TEXT_MUTED }}>ユーザーはまだ登録されていません</p>
      ) : (
        <div
          className="overflow-x-auto rounded-lg"
          style={{ backgroundColor: NAVY, border: `1px solid ${BORDER}` }}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: HEADER_BG, color: GOLD }}>
                <th className="text-left px-3 py-2 font-semibold">登録日</th>
                <th className="text-left px-3 py-2 font-semibold">氏名</th>
                <th className="text-left px-3 py-2 font-semibold">電話番号</th>
                <th className="text-left px-3 py-2 font-semibold">職業</th>
                <th className="text-left px-3 py-2 font-semibold">年収</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u.id}
                  style={{ borderTop: `1px solid ${ROW_BORDER}`, color: TEXT_WHITE }}
                >
                  <td className="px-3 py-2 whitespace-nowrap" style={{ color: TEXT_MUTED }}>
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{fullName(u)}</td>
                  <td className="px-3 py-2 whitespace-nowrap" style={{ color: TEXT_MUTED }}>
                    {u.phone ?? '—'}
                  </td>
                  <td className="px-3 py-2">{u.occupation ?? '—'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {formatIncome(u.annual_income)}
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
