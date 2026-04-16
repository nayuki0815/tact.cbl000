'use client'

import { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../../../lib/supabase/client'
import AdminLayout from '../../../../components/AdminLayout'

const NAVY = '#0d1f3c'
const GOLD = '#c9a84c'
const BORDER = 'rgba(201, 168, 76, 0.3)'
const INPUT_BG = '#081423'
const TEXT_WHITE = '#ffffff'
const TEXT_MUTED = '#9ab0cc'

type Application = {
  id: string
  user_id: string | null
  investment_purpose: string | null
  investment_type: string | null
  self_funding: number | null
  desired_services: string[] | null
  status: string | null
  created_at: string
}

type Profile = {
  id: string
  last_name: string | null
  first_name: string | null
  phone: string | null
  occupation: string | null
  annual_income: number | null
}

type Message = {
  id: string
  application_id: string
  sender_id: string
  content: string
  is_read: boolean | null
  created_at: string
}

export default function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: applicationId } = use(params)
  const supabase = createClient()

  const [app, setApp] = useState<Application | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) setCurrentUserId(userData.user.id)

      const { data: appData } = await supabase
        .from('applications')
        .select('id, user_id, investment_purpose, investment_type, self_funding, desired_services, status, created_at')
        .eq('id', applicationId)
        .maybeSingle()

      if (!appData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setApp(appData as Application)

      if (appData.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, last_name, first_name, phone, occupation, annual_income')
          .eq('id', appData.user_id)
          .maybeSingle()

        if (profileData) setProfile(profileData as Profile)
      }

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true })

      setMessages((msgs ?? []) as Message[])
      setLoading(false)
    }
    init()
  }, [applicationId])

  useEffect(() => {
    const channel = supabase
      .channel('messages-' + applicationId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: 'application_id=eq.' + applicationId,
        },
        payload => {
          const msg = payload.new as Message
          setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [applicationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleSend = async () => {
    const body = input.trim()
    if (!body || sending || !currentUserId) return
    setSending(true)

    const { data: inserted, error } = await supabase
      .from('messages')
      .insert({
        application_id: applicationId,
        sender_id: currentUserId,
        content: body,
      })
      .select()
      .single()

    if (!error && inserted) {
      const msg = inserted as Message
      setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]))
      setInput('')
    }
    setSending(false)
  }

  const formatDateTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('ja-JP', {
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  const userFullName = profile
    ? [profile.last_name, profile.first_name].filter(Boolean).join(' ') || '（未登録）'
    : '（未登録）'

  if (loading) {
    return (
      <AdminLayout>
        <p style={{ color: TEXT_MUTED }}>読み込み中...</p>
      </AdminLayout>
    )
  }

  if (notFound || !app) {
    return (
      <AdminLayout>
        <p style={{ color: TEXT_MUTED }}>申込が見つかりません</p>
        <Link
          href="/admin/applications"
          className="inline-block mt-4 text-sm hover:opacity-80"
          style={{ color: GOLD }}
        >
          ← 申込一覧に戻る
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/applications"
          className="text-sm hover:opacity-80"
          style={{ color: GOLD }}
        >
          ← 申込一覧
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: TEXT_WHITE }}>
          申込詳細
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <InfoCard title="申込内容">
          <InfoRow label="申込日時" value={formatDateTime(app.created_at)} />
          <InfoRow label="投資目的" value={app.investment_purpose ?? '—'} />
          <InfoRow label="投資種別" value={app.investment_type ?? '—'} />
          <InfoRow
            label="自己資金"
            value={app.self_funding == null ? '—' : `${Math.round(app.self_funding / 10000).toLocaleString()} 万円`}
          />
          <InfoRow label="希望サービス" value={app.desired_services?.join(', ') ?? '—'} />
          <InfoRow label="ステータス" value={statusLabel(app.status)} />
        </InfoCard>

        <InfoCard title="ユーザープロフィール">
          <InfoRow label="氏名" value={userFullName} />
          <InfoRow label="電話番号" value={profile?.phone ?? '—'} />
          <InfoRow label="職業" value={profile?.occupation ?? '—'} />
          <InfoRow
            label="年収"
            value={profile?.annual_income == null ? '—' : `${Math.round(profile.annual_income / 10000).toLocaleString()} 万円`}
          />
        </InfoCard>
      </div>

      <div
        className="rounded-lg overflow-hidden flex flex-col"
        style={{ backgroundColor: NAVY, border: `1px solid ${BORDER}`, height: '60vh', minHeight: 400 }}
      >
        <div
          className="px-4 py-3 text-sm font-semibold"
          style={{ backgroundColor: INPUT_BG, color: GOLD, borderBottom: `1px solid ${BORDER}` }}
        >
          担当者チャット
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-sm" style={{ color: TEXT_MUTED }}>
              メッセージはまだありません
            </p>
          ) : (
            messages.map(m => {
              const fromUser = m.sender_id === app.user_id
              return (
                <MessageBubble
                  key={m.id}
                  body={m.content}
                  time={formatTime(m.created_at)}
                  senderName={fromUser ? userFullName : '管理者'}
                  isMine={!fromUser}
                />
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div
          className="px-4 py-3 flex gap-2"
          style={{ backgroundColor: INPUT_BG, borderTop: `1px solid ${BORDER}` }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="メッセージを入力..."
            className="flex-1 rounded px-3 py-2 text-sm"
            style={{
              backgroundColor: '#ffffff',
              color: NAVY,
              border: `1px solid ${BORDER}`,
            }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="rounded px-4 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            {sending ? '送信中' : '送信'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-5"
      style={{ backgroundColor: NAVY, border: `1px solid ${BORDER}` }}
    >
      <h2 className="text-sm font-semibold mb-3 tracking-widest" style={{ color: GOLD }}>
        {title}
      </h2>
      <dl className="space-y-2 text-sm">{children}</dl>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-28 flex-shrink-0" style={{ color: TEXT_MUTED }}>{label}</dt>
      <dd style={{ color: TEXT_WHITE }}>{value}</dd>
    </div>
  )
}

function MessageBubble({
  body,
  time,
  senderName,
  isMine,
}: {
  body: string
  time: string
  senderName: string
  isMine: boolean
}) {
  const bubbleStyle: React.CSSProperties = isMine
    ? { backgroundColor: GOLD, color: NAVY }
    : { backgroundColor: NAVY, color: TEXT_WHITE, border: `1px solid ${BORDER}` }

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[75%]">
        <div
          className={`text-xs mb-1 ${isMine ? 'text-right' : 'text-left'}`}
          style={{ color: TEXT_MUTED }}
        >
          {senderName} ・ {time}
        </div>
        <div
          className="px-4 py-2 rounded-lg text-sm whitespace-pre-wrap break-words"
          style={bubbleStyle}
        >
          {body}
        </div>
      </div>
    </div>
  )
}

function statusLabel(status: string | null): string {
  switch (status) {
    case 'approved': return '承認済'
    case 'rejected': return '否認'
    case 'pending':
    default: return '保留中'
  }
}
