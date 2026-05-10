'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        backgroundColor: '#0d1f3c',
        color: '#ffffff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      このページを印刷 / PDFで保存
    </button>
  )
}
