'use client'

import { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import Header from '../../../components/Header'

const PAGE_BG = '#0a1829'
const NAVY = '#0d1f3c'
const GOLD = '#c9a84c'
const BORDER = 'rgba(201, 168, 76, 0.3)'
const INPUT_BG = '#081423'
const TEXT_WHITE = '#ffffff'
const TEXT_MUTED = '#9ab0cc'

type ApplicationLite = {
  id: string
  investment_purpose: string | null
  status: string | null
  created_at: string
}

type Message = {
  id: string
  application_id: string
  sender_id: string
  content: string
  is_read: boolean | null
  created_at: string
}

export default function UserChatPage({
  params,
}: {
  params: Promise<{ applicationId: string }>
}) {
  const { applicationId } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [app, setApp] = useState<ApplicationLite | null>(null)
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
      if (!userData.user) {
        router.replace('/login')
        return
      }
      setCurrentUserId(userData.user.id)

      // RLS により、自分の申込でなければ結果は空になる
      const { data: appData } = await supabase
        .from('applications')
        .select('id, investment_purpose, status, created_at')
        .eq('id', applicationId)
        .maybeSingle()

      if (!appData) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setApp(appData as ApplicationLite)

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true })

      setMessages((msgs ?? []) as Message[])
      setLoading(false)
    }
    init()
  }, [applicationId, router])

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

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return iso
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('ja-JP')
    } catch {
      return iso
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}>
        <Header />
        <p className="p-8" style={{ color: TEXT_MUTED }}>読み込み中...</p>
      </div>
    )
  }

  if (notFound || !app) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}>
        <Header />
        <div className="max-w-md mx-auto p-8 text-center">
          <p className="mb-4" style={{ color: TEXT_MUTED }}>
            チャットを表示できませんでした
          </p>
          <Link
            href="/mypage"
            className="inline-block text-sm hover:opacity-80"
            style={{ color: GOLD }}
          >
            ← マイページへ戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: PAGE_BG, color: TEXT_WHITE }}
    >
      <Header />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col min-h-0">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/mypage"
            className="text-sm hover:opacity-80"
            style={{ color: GOLD }}
          >
            ← マイページ
          </Link>
        </div>

        <div
          className="rounded-lg p-4 mb-4"
          style={{ backgroundColor: NAVY, border: `1px solid ${BORDER}` }}
        >
          <p className="text-xs tracking-widest mb-1" style={{ color: GOLD }}>
            担当者へのご相談
          </p>
          <p className="text-sm" style={{ color: TEXT_WHITE }}>
            {app.investment_purpose ?? '投資相談'} ・ 申込日 {formatDate(app.created_at)}
          </p>
        </div>

        <div
          className="rounded-lg overflow-hidden flex flex-col flex-1 min-h-0"
          style={{ backgroundColor: NAVY, border: `1px solid ${BORDER}`, minHeight: 400 }}
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
                ご質問・ご相談をお気軽にお送りください
              </p>
            ) : (
              messages.map(m => {
                const isMine = m.sender_id === currentUserId
                return (
                  <MessageBubble
                    key={m.id}
                    body={m.content}
                    time={formatTime(m.created_at)}
                    senderName={isMine ? 'あなた' : '担当者'}
                    isMine={isMine}
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
      </div>
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
