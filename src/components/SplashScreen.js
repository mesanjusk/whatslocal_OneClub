"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SplashScreen() {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2200)
    const t2 = setTimeout(() => router.replace("/home"), 2700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [router])

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "hsl(240 10% 3.9%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.5s ease",
        opacity: leaving ? 0 : 1,
      }}
    >
      {/* Main text */}
      <div style={{ textAlign: "center", padding: "0 2rem", animation: "splashIn 0.6s ease forwards" }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2rem", fontWeight: 600, margin: 0, letterSpacing: "0.01em" }}>
          Hello Gondia,
        </p>
        <p style={{ color: "#fff", fontSize: "3rem", fontWeight: 900, margin: "4px 0 0", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Let&apos;s order.
        </p>
      </div>

      {/* Bouncing dots */}
      <div style={{ position: "absolute", bottom: "4rem", display: "flex", gap: "8px" }}>
        {[0, 1, 2].map((n) => (
          <span
            key={n}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
              display: "block",
              animation: `dotBounce 1.2s ${n * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes splashIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.35; }
          40%            { transform: scale(1.6); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
