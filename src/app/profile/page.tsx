'use client'

import { useEffect, useState } from 'react'
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

const labelStyle = { color: TEXT_WHITE }
const inputStyle = {
  backgroundColor: '#ffffff',
  color: '#0d1f3c',
  border: '1px solid rgba(201, 168, 76, 0.4)',
}

type Profile = {
  last_name: string
  first_name: string
  last_name_kana: string
  first_name_kana: string
  phone: string
  gender: string
  birth_date: string
  occupation: string
  years_employed: string
  annual_income: string
}

const emptyProfile: Profile = {
  last_name: '',
  first_name: '',
  last_name_kana: '',
  first_name_kana: '',
  phone: '',
  gender: '',
  birth_date: '',
  occupation: '',
  years_employed: '',
  annual_income: '',
}

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select(
          'last_name, first_name, last_name_kana, first_name_kana, phone, gender, birth_date, occupation, years_employed, annual_income'
        )
        .eq('id', user.id)
        .single()

      if (data)
        setProfile({
          last_name: data.last_name ?? '',
          first_name: data.first_name ?? '',
          last_name_kana: data.last_name_kana ?? '',
          first_name_kana: data.first_name_kana ?? '',
          phone: data.phone ?? '',
          gender: data.gender ?? '',
          birth_date: data.birth_date ?? '',
          occupation: data.occupation ?? '',
          years_employed: data.years_employed == null ? '' : String(data.years_employed),
          annual_income: data.annual_income == null ? '' : String(data.annual_income),
        })
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        last_name: profile.last_name || null,
        first_name: profile.first_name || null,
        last_name_kana: profile.last_name_kana || null,
        first_name_kana: profile.first_name_kana || null,
        phone: profile.phone || null,
        gender: profile.gender || null,
        birth_date: profile.birth_date || null,
        occupation: profile.occupation || null,
        years_employed: profile.years_employed === '' ? null : Number(profile.years_employed),
        annual_income: profile.annual_income === '' ? null : Number(profile.annual_income),
        updated_at: new Date().toISOString(),
      })

    setMessage(error ? '保存に失敗しました' : '保存しました ✓')
    setSaving(false)
  }

  if (loading)
    return (
      <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}>
        <Header />
        <p className="p-8">読み込み中...</p>
      </div>
    )

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}>
      <Header />
      <div className="max-w-md mx-auto p-8">
        <div
          className="rounded-lg p-6 sm:p-8"
          style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}
        >
          <h1 className="text-2xl font-bold mb-6" style={{ color: TEXT_WHITE }}>プロフィール</h1>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>姓</label>
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                  className="w-full rounded px-3 py-2"
                  style={inputStyle}
                  placeholder="山田"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>名</label>
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                  className="w-full rounded px-3 py-2"
                  style={inputStyle}
                  placeholder="太郎"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>セイ</label>
                <input
                  type="text"
                  value={profile.last_name_kana}
                  onChange={e => setProfile({ ...profile, last_name_kana: e.target.value })}
                  className="w-full rounded px-3 py-2"
                  style={inputStyle}
                  placeholder="ヤマダ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>メイ</label>
                <input
                  type="text"
                  value={profile.first_name_kana}
                  onChange={e => setProfile({ ...profile, first_name_kana: e.target.value })}
                  className="w-full rounded px-3 py-2"
                  style={inputStyle}
                  placeholder="タロウ"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>電話番号</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
                placeholder="090-0000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>性別</label>
              <select
                value={profile.gender}
                onChange={e => setProfile({ ...profile, gender: e.target.value })}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
              >
                <option value="">選択してください</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
                <option value="回答しない">回答しない</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>生年月日</label>
              <input
                type="date"
                value={profile.birth_date}
                onChange={e => setProfile({ ...profile, birth_date: e.target.value })}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>職業</label>
              <input
                type="text"
                value={profile.occupation}
                onChange={e => setProfile({ ...profile, occupation: e.target.value })}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
                placeholder="会社員"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>勤続年数 (年)</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={profile.years_employed}
                onChange={e => setProfile({ ...profile, years_employed: e.target.value })}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>年収 (円)</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={profile.annual_income}
                onChange={e => setProfile({ ...profile, annual_income: e.target.value })}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
                placeholder="5000000"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              {saving ? '保存中...' : '保存する'}
            </button>

            {message && (
              <p className="text-center text-sm" style={{ color: TEXT_MUTED }}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
