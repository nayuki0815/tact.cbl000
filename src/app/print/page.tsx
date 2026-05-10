import PrintButton from './PrintButton'

const NAVY = '#0d1f3c'
const GOLD = '#c9a84c'
const DARK_NAVY = '#0a1829'
const FOOTER_BG = '#081423'
const TEXT_GRAY = '#9ab0cc'
const WHITE = '#ffffff'
const BORDER_GRAY = '#e0ddd5'

const printCss = `
  @page { size: A4 landscape; margin: 0; }
  html, body { margin: 0; padding: 0; background: #555; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif; }
  .page {
    width: 297mm;
    height: 210mm;
    overflow: hidden;
    page-break-after: always;
    position: relative;
    margin: 0 auto 12mm auto;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  }
  .page:last-of-type { page-break-after: auto; }
  @media print {
    html, body { background: #ffffff; }
    .no-print { display: none !important; }
    .page { box-shadow: none; margin: 0; }
  }
`

export default function PrintPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printCss }} />

      <div
        className="no-print"
        style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd',
        }}
      >
        <PrintButton />
      </div>

      {/* ===== Page 1: Hero ===== */}
      <div
        className="page"
        style={{
          backgroundColor: NAVY,
          color: WHITE,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top nav */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 32px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <span style={{ color: GOLD, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em' }}>
            CBL
          </span>
          <div style={{ display: 'flex', gap: 24, color: WHITE, fontSize: 10 }}>
            <span style={{ color: TEXT_GRAY }}>サービスについて</span>
            <span style={{ color: TEXT_GRAY }}>よくある質問</span>
            <span
              style={{
                color: GOLD,
                border: `1px solid ${GOLD}`,
                padding: '4px 12px',
                borderRadius: 4,
              }}
            >
              ログイン
            </span>
          </div>
        </div>

        {/* Hero center */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 40px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              border: `1px solid ${GOLD}`,
              color: GOLD,
              padding: '6px 18px',
              borderRadius: 999,
              fontSize: 11,
              letterSpacing: '0.2em',
              marginBottom: 32,
            }}
          >
            招待制・完全紹介制
          </span>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.4 }}>
            <span style={{ color: WHITE, display: 'block' }}>士業と連携した</span>
            <span style={{ color: GOLD, display: 'block' }}>信頼のローン紹介</span>
            <span style={{ color: WHITE, display: 'block' }}>プラットフォーム</span>
          </h1>
          <p
            style={{
              color: TEXT_GRAY,
              fontSize: 12,
              lineHeight: 1.8,
              marginTop: 28,
              marginBottom: 36,
              maxWidth: 480,
            }}
          >
            弁護士・会計士・税理士・司法書士と連携。厳選された専門家ネットワークが、あなたに最適なローンをご紹介します。
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span
              style={{
                backgroundColor: GOLD,
                color: NAVY,
                padding: '12px 28px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              招待コードで登録する
            </span>
            <span
              style={{
                backgroundColor: 'transparent',
                color: GOLD,
                border: `1px solid ${GOLD}`,
                padding: '12px 28px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              サービスを詳しく見る
            </span>
          </div>
        </div>

        {/* Trust bar */}
        <div
          style={{
            backgroundColor: DARK_NAVY,
            color: TEXT_GRAY,
            padding: '20px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            fontSize: 10,
          }}
        >
          {[
            '弁護士・会計士・税理士・司法書士と連携',
            '招待制による厳選された会員',
            'SSL暗号化による情報保護',
            '完全無料・手数料不要',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: GOLD,
                  flexShrink: 0,
                }}
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Page 2: Why CBL + How it works ===== */}
      <div
        className="page"
        style={{
          backgroundColor: WHITE,
          color: NAVY,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}
      >
        {/* WHY CBL */}
        <section>
          <p
            style={{
              textAlign: 'center',
              color: GOLD,
              fontSize: 11,
              letterSpacing: '0.3em',
              margin: 0,
              marginBottom: 8,
            }}
          >
            WHY CBL
          </p>
          <h2
            style={{
              textAlign: 'center',
              color: NAVY,
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              marginBottom: 28,
            }}
          >
            なぜCBLが選ばれるのか
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
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
                style={{
                  border: `1px solid ${BORDER_GRAY}`,
                  borderRadius: 8,
                  padding: 20,
                  backgroundColor: WHITE,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: 'rgba(201,168,76,0.15)',
                    border: '1px solid rgba(201,168,76,0.4)',
                    marginBottom: 14,
                  }}
                />
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, marginBottom: 8, color: NAVY }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 11, lineHeight: 1.7, margin: 0, color: 'rgba(13,31,60,0.7)' }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <p
            style={{
              textAlign: 'center',
              color: GOLD,
              fontSize: 11,
              letterSpacing: '0.3em',
              margin: 0,
              marginBottom: 8,
            }}
          >
            HOW IT WORKS
          </p>
          <h2
            style={{
              textAlign: 'center',
              color: NAVY,
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              marginBottom: 28,
            }}
          >
            ご利用の流れ
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {['招待コードを受け取る', '無料会員登録', 'プロフィール入力', '担当者よりご連絡'].map(
              (step, i) => (
                <div key={step} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      margin: '0 auto 12px auto',
                      width: 48,
                      height: 48,
                      borderRadius: 999,
                      backgroundColor: NAVY,
                      color: GOLD,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: 0, color: NAVY }}>{step}</p>
                </div>
              )
            )}
          </div>
        </section>
      </div>

      {/* ===== Page 3: CTA ===== */}
      <div
        className="page"
        style={{
          backgroundColor: NAVY,
          color: WHITE,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 40px',
          }}
        >
          <p
            style={{
              color: TEXT_GRAY,
              fontSize: 11,
              letterSpacing: '0.3em',
              margin: 0,
              marginBottom: 20,
            }}
          >
            INVITATION ONLY
          </p>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.6 }}>
            <span style={{ color: WHITE, display: 'block' }}>招待コードをお持ちの方は</span>
            <span style={{ color: GOLD, display: 'block' }}>今すぐ登録できます</span>
          </h2>
          <p
            style={{
              color: TEXT_GRAY,
              fontSize: 11,
              lineHeight: 1.8,
              margin: '28px 0 32px 0',
              maxWidth: 460,
            }}
          >
            招待コードをお持ちでない方は、担当士業または紹介者にお問い合わせください
          </p>
          <span
            style={{
              backgroundColor: GOLD,
              color: NAVY,
              padding: '14px 36px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            招待コードで登録する
          </span>
        </div>
        <div
          style={{
            backgroundColor: FOOTER_BG,
            color: '#4a6080',
            textAlign: 'center',
            padding: '20px',
            fontSize: 11,
          }}
        >
          © 2026 CBL. All rights reserved.
        </div>
      </div>

      {/* ===== Page 4: Fee structure ===== */}
      <div
        className="page"
        style={{
          backgroundColor: WHITE,
          color: NAVY,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: NAVY,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 32px',
          }}
        >
          <span style={{ color: GOLD, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em' }}>
            CBL
          </span>
          <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>手数料について</span>
          <span style={{ width: 32 }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '36px 40px' }}>
          <p
            style={{
              textAlign: 'center',
              color: GOLD,
              fontSize: 11,
              letterSpacing: '0.3em',
              margin: 0,
              marginBottom: 8,
            }}
          >
            FEE STRUCTURE
          </p>
          <h2
            style={{
              textAlign: 'center',
              color: NAVY,
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              marginBottom: 16,
            }}
          >
            手数料について
          </h2>
          <div
            style={{
              width: 56,
              height: 1,
              backgroundColor: 'rgba(201, 168, 76, 0.4)',
              margin: '0 auto 32px auto',
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 36 }}>
            <div
              style={{
                backgroundColor: NAVY,
                borderLeft: `3px solid ${GOLD}`,
                padding: 20,
                borderRadius: 4,
              }}
            >
              <h3 style={{ color: GOLD, fontSize: 13, fontWeight: 700, margin: 0, marginBottom: 10 }}>
                紹介手数料はいくらか
              </h3>
              <p style={{ color: WHITE, fontSize: 11, lineHeight: 1.8, margin: 0, marginBottom: 10 }}>
                ローン紹介では、融資承認金額（元本）の1.1%（税込）に相当する金額を紹介手数料としていただきます。
              </p>
              <p style={{ color: TEXT_GRAY, fontSize: 10, margin: 0 }}>
                ※ 下限385,000円（税込）となります。
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#f4f4f4',
                borderLeft: `3px solid ${NAVY}`,
                padding: 20,
                borderRadius: 4,
              }}
            >
              <h3 style={{ color: NAVY, fontSize: 13, fontWeight: 700, margin: 0, marginBottom: 10 }}>
                どこまでが無料か
              </h3>
              <p style={{ color: '#666666', fontSize: 11, lineHeight: 1.8, margin: 0 }}>
                ローン紹介にお申込み後、仮審査結果までは無料です。金融機関の本審査申込み後、融資承認となった時点で紹介手数料が発生します。
              </p>
            </div>
          </div>

          {/* Flow diagram */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            {[
              { label: 'お申込み', circle: NAVY, text: NAVY, badge: '無料', badgeBg: '#1f7a4d', badgeColor: WHITE },
              { label: '仮審査', circle: NAVY, text: NAVY, badge: '無料', badgeBg: '#1f7a4d', badgeColor: WHITE },
              { label: '本審査申込み', circle: '#9aa3b3', text: '#666666', badge: null },
              { label: '融資承認', circle: '#9aa3b3', text: '#666666', badge: null },
              { label: '手数料発生', circle: GOLD, text: GOLD, badge: '手数料発生', badgeBg: '#d4b13a', badgeColor: NAVY },
            ].map((step, i, arr) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      backgroundColor: step.circle,
                      color: step.circle === GOLD ? NAVY : WHITE,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 13,
                      marginBottom: 8,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p
                    style={{
                      color: step.text,
                      fontSize: 10,
                      fontWeight: 600,
                      margin: 0,
                      marginBottom: 6,
                      textAlign: 'center',
                    }}
                  >
                    {step.label}
                  </p>
                  {step.badge && (
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: step.badgeBg,
                        color: step.badgeColor,
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                      }}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{
                      width: 16,
                      height: 1,
                      backgroundColor: '#d0d0d0',
                      marginTop: 18,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: '#f0f0f0',
            color: '#888888',
            textAlign: 'center',
            padding: '14px',
            fontSize: 10,
          }}
        >
          © 2026 CBL. All rights reserved.
        </div>
      </div>
    </>
  )
}
