import Link from 'next/link'

const NAVY = '#0d1f3c'
const GOLD = '#c9a84c'
const DARK_NAVY = '#0a1829'
const FOOTER_BG = '#081423'
const TEXT_GRAY = '#9ab0cc'
const CARD_BG = '#f8f7f4'

export default function Home() {
  return (
    <div className="flex-1 w-full">
      <nav style={{ backgroundColor: NAVY, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-widest" style={{ color: GOLD }}>
            CBL
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="#features"
              className="hidden sm:inline text-sm hover:opacity-80 transition"
              style={{ color: TEXT_GRAY }}
            >
              サービスについて
            </a>
            <a
              href="#how"
              className="hidden sm:inline text-sm hover:opacity-80 transition"
              style={{ color: TEXT_GRAY }}
            >
              よくある質問
            </a>
            <Link
              href="/login"
              className="rounded-md px-3 sm:px-4 py-1.5 text-sm hover:opacity-80 transition"
              style={{ border: `1px solid ${GOLD}`, color: GOLD }}
            >
              ログイン
            </Link>
          </div>
        </div>
      </nav>

      <section style={{ backgroundColor: NAVY, color: '#ffffff' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <span
            className="inline-block text-xs tracking-[0.2em] px-4 py-1.5 rounded-full mb-8"
            style={{ border: `1px solid ${GOLD}`, color: GOLD }}
          >
            招待制・完全紹介制
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight sm:leading-tight mb-6">
            士業と連携した
            <br className="sm:hidden" />
            <span style={{ color: GOLD }}>信頼のローン紹介</span>
            <br/>プラットフォーム
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ color: TEXT_GRAY }}
          >
            弁護士・会計士・税理士・司法書士と連携。厳選された専門家ネットワークが、あなたに最適なローンをご紹介します。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/signup"
              className="rounded-md px-6 py-3 font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              招待コードで登録する
            </Link>
            <a
              href="#features"
              className="rounded-md px-6 py-3 font-semibold hover:opacity-80 transition"
              style={{ border: `1px solid ${GOLD}`, color: GOLD, backgroundColor: 'transparent' }}
            >
              サービスを詳しく見る
            </a>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: DARK_NAVY, color: TEXT_GRAY }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-sm">
          {[
            '弁護士・会計士・税理士・司法書士と連携',
            '招待制による厳選された会員',
            'SSL暗号化による情報保護',
            '完全無料・手数料不要',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span
                className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={{ backgroundColor: CARD_BG, color: NAVY }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <p
            className="text-center text-xs tracking-[0.3em] mb-3"
            style={{ color: GOLD }}
          >
            WHY CBL
          </p>
          <h2 className="text-center text-2xl sm:text-4xl font-bold mb-14 sm:mb-16">
            なぜCBLが選ばれるのか
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: '士業による品質保証',
                body: '弁護士・会計士・税理士・司法書士の有資格者が連携。あなたに合った信頼できる選択肢だけをご紹介します。',
              },
              {
                title: '招待制で安心',
                body: '既存会員または提携士業からの招待コードがないと登録できません。会員の質と安全性を守ります。',
              },
              {
                title: '個人情報の厳重管理',
                body: 'SSL暗号化・アクセス制御・最小権限原則。お預かりする情報は徹底して保護します。',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-lg p-7 sm:p-8 shadow-sm hover:shadow-md transition"
                style={{ backgroundColor: '#ffffff', border: `1px solid rgba(13,31,60,0.1)` }}
              >
                <div
                  className="w-10 h-10 rounded-full mb-5"
                  style={{
                    backgroundColor: 'rgba(201,168,76,0.15)',
                    border: '1px solid rgba(201,168,76,0.4)',
                  }}
                />
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(13,31,60,0.7)' }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" style={{ backgroundColor: '#ffffff', color: NAVY }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <p
            className="text-center text-xs tracking-[0.3em] mb-3"
            style={{ color: GOLD }}
          >
            HOW IT WORKS
          </p>
          <h2 className="text-center text-2xl sm:text-4xl font-bold mb-14 sm:mb-16">
            ご利用の流れ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
            {[
              '招待コードを受け取る',
              '無料会員登録',
              'プロフィール入力',
              '担当者よりご連絡',
            ].map((step, i) => (
              <div key={step} className="text-center">
                <div
                  className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-4"
                  style={{ backgroundColor: NAVY, color: GOLD }}
                >
                  {i + 1}
                </div>
                <p className="font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: NAVY, color: '#ffffff' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
          <p
            className="text-xs tracking-[0.3em] mb-4"
            style={{ color: GOLD }}
          >
            INVITATION ONLY
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 leading-relaxed">
            招待コードをお持ちの方は
            <br className="sm:hidden" />
            今すぐ登録できます
          </h2>
          <Link
            href="/signup"
            className="inline-block rounded-md px-8 py-3 font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            招待コードで登録する
          </Link>
        </div>
      </section>

      <section style={{ backgroundColor: DARK_NAVY, color: '#ffffff' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <p
            className="text-center text-xs tracking-[0.3em] mb-3"
            style={{ color: GOLD }}
          >
            fee structure
          </p>
          <h2 className="text-center text-2xl sm:text-4xl font-bold mb-6">
            手数料について
          </h2>
          <div
            className="mx-auto mb-14 sm:mb-16"
            style={{
              width: 64,
              height: 1,
              backgroundColor: 'rgba(201, 168, 76, 0.4)',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-14 sm:mb-16">
            <div
              className="rounded-lg p-7 sm:p-8"
              style={{
                backgroundColor: '#0d1f3c',
                borderLeft: `4px solid ${GOLD}`,
              }}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: GOLD }}>
                紹介手数料はいくらか
              </h3>
              <p
                className="text-sm sm:text-base leading-relaxed mb-4"
                style={{ color: '#ffffff' }}
              >
                ローン紹介では、融資承認金額（元本）の1.1%（税込）に相当する金額を紹介手数料としていただきます。
              </p>
              <p className="text-xs sm:text-sm" style={{ color: TEXT_GRAY }}>
                ※ 下限385,000円（税込）となります。
              </p>
            </div>

            <div
              className="rounded-lg p-7 sm:p-8"
              style={{
                backgroundColor: '#1a2f50',
                borderLeft: `4px solid ${NAVY}`,
              }}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#ffffff' }}>
                どこまでが無料か
              </h3>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: TEXT_GRAY }}
              >
                ローン紹介にお申込み後、仮審査結果までは無料です。金融機関の本審査申込み後、融資承認となった時点で紹介手数料が発生します。
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between gap-1 sm:gap-2 overflow-x-auto">
            {[
              { label: 'お申込み', circle: NAVY, text: '#ffffff', badge: '無料', badgeBg: '#1f7a4d', badgeColor: '#ffffff' },
              { label: '仮審査', circle: NAVY, text: '#ffffff', badge: '無料', badgeBg: '#1f7a4d', badgeColor: '#ffffff' },
              { label: '本審査申込み', circle: '#5a6a82', text: '#ffffff', badge: null },
              { label: '融資承認', circle: '#5a6a82', text: '#ffffff', badge: null },
              { label: '手数料発生', circle: GOLD, text: GOLD, badge: '手数料発生', badgeBg: '#d4b13a', badgeColor: NAVY },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold mb-3"
                    style={{ backgroundColor: step.circle, color: step.circle === GOLD ? NAVY : '#ffffff' }}
                  >
                    {i + 1}
                  </div>
                  <p
                    className="text-xs sm:text-sm font-semibold text-center mb-2 px-1"
                    style={{ color: step.text }}
                  >
                    {step.label}
                  </p>
                  {step.badge && (
                    <span
                      className="inline-block text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: step.badgeBg, color: step.badgeColor }}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>
                {i < arr.length - 1 && (
                  <div
                    className="flex-shrink-0 mt-5 sm:mt-6"
                    style={{
                      width: 16,
                      height: 1,
                      backgroundColor: 'rgba(154, 176, 204, 0.3)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: FOOTER_BG, color: 'rgba(255,255,255,0.5)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs">
          © 2026 CBL. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
