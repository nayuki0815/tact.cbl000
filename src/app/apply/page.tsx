'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type Application = {
  investment_experience: '' | 'yes' | 'no'
  investment_purpose: string
  investment_type: string
  self_funding: string
  existing_loan: string
  desired_services: string[]
}

const emptyApplication: Application = {
  investment_experience: '',
  investment_purpose: '',
  investment_type: '',
  self_funding: '',
  existing_loan: '',
  desired_services: [],
}

const PURPOSE_OPTIONS = ['老後の資産形成', '教育資金', '住宅購入', 'その他']
const TYPE_OPTIONS = ['株式', '投資信託', '不動産', 'FX', 'その他']
const SERVICE_OPTIONS = ['投資相談', '資産運用', '保険相談', '税務相談']

export default function ApplyPage() {
  const supabase = createClient()
  const router = useRouter()
  const [app, setApp] = useState<Application>(emptyApplication)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setLoading(false)
    }
    checkUser()
  }, [])

  const toggleService = (service: string) => {
    setApp(prev => ({
      ...prev,
      desired_services: prev.desired_services.includes(service)
        ? prev.desired_services.filter(s => s !== service)
        : [...prev.desired_services, service],
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: insertError } = await supabase.from('applications').insert({
      user_id: user.id,
      investment_experience:
        app.investment_experience === '' ? null : app.investment_experience === 'yes',
      investment_purpose: app.investment_purpose || null,
      investment_type: app.investment_type || null,
      self_funding: app.self_funding === '' ? null : Number(app.self_funding),
      existing_loan: app.existing_loan || null,
      desired_services: app.desired_services.length ? app.desired_services : null,
    })

    if (insertError) {
      setError('申込の送信に失敗しました')
      setSubmitting(false)
      return
    }

    router.push('/complete')
  }

  if (loading)
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <p className="p-8">読み込み中...</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">申込フォーム</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">投資経験</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="investment_experience"
                  checked={app.investment_experience === 'yes'}
                  onChange={() => setApp({ ...app, investment_experience: 'yes' })}
                />
                <span>あり</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="investment_experience"
                  checked={app.investment_experience === 'no'}
                  onChange={() => setApp({ ...app, investment_experience: 'no' })}
                />
                <span>なし</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">投資目的</label>
            <select
              value={app.investment_purpose}
              onChange={e => setApp({ ...app, investment_purpose: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">選択してください</option>
              {PURPOSE_OPTIONS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">投資種別</label>
            <select
              value={app.investment_type}
              onChange={e => setApp({ ...app, investment_type: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">選択してください</option>
              {TYPE_OPTIONS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">自己資金 (円)</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={app.self_funding}
              onChange={e => setApp({ ...app, self_funding: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="1000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">既存ローン</label>
            <textarea
              value={app.existing_loan}
              onChange={e => setApp({ ...app, existing_loan: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="住宅ローン 残高 XXXX 万円 など"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">希望サービス（複数選択可）</label>
            <div className="space-y-2">
              {SERVICE_OPTIONS.map(s => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={app.desired_services.includes(s)}
                    onChange={() => toggleService(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? '送信中...' : '申込を送信'}
          </button>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}
