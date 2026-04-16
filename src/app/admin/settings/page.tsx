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

type AdminRow = {
  id: string
  email: string
}

export default function AdminSettingsPage() {
  const [admins, setAdmins] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    const fetchAdmins = async () => {
      const { data, error: fetchErr } = await supabase
        .from('admin_users')
        .select('id, email')
        .order('email', { ascending: true })

      if (fetchErr) {
        setError('管理者の取得に失敗しました')
        setLoading(false)
        return
      }

      setAdmins((data ?? []) as AdminRow[])
      setLoading(false)
    }

    fetchAdmins()
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ color: TEXT_WHITE }}>
        設定
      </h1>

      <h2 className="text-lg font-semibold mb-4" style={{ color: TEXT_WHITE }}>
        管理者メールアドレス一覧
      </h2>

      {error && (
        <p className="mb-4 text-sm" style={{ color: '#fca5a5' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: TEXT_MUTED }}>読み込み中...</p>
      ) : admins.length === 0 ? (
        <p style={{ color: TEXT_MUTED }}>登録された管理者はいません</p>
      ) : (
        <div
          className="overflow-x-auto rounded-lg max-w-2xl"
          style={{ backgroundColor: NAVY, border: `1px solid ${BORDER}` }}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: HEADER_BG, color: GOLD }}>
                <th className="text-left px-3 py-2 font-semibold">メールアドレス</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr
                  key={a.id}
                  style={{ borderTop: `1px solid ${ROW_BORDER}`, color: TEXT_WHITE }}
                >
                  <td className="px-3 py-2">{a.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
