"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SplashScreen() {
  const router = useRouter()
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000)
    const navTimer = setTimeout(() => {
      router.replace("/home")
    }, 2500)
    return () => { clearTimeout(fadeTimer); clearTimeout(navTimer) }
  }, [router])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      style={{ background: "hsl(240 10% 3.9%)" }}
    >
      {/* Logo mark */}
      <div className="flex flex-col items-center gap-5 mb-16">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
          <span className="text-5xl font-black text-white tracking-tight leading-none select-none">W</span>
          <span
            className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-background"
            style={{ background: "hsl(142 71% 45%)" }}
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">WhatsLocal</h1>
          <p className="text-sm text-white/40 mt-1 font-medium">Experience the Pulse of Your Neighborhood</p>
        </div>
      </div>

      {/* Bottom loader */}
      <div className="absolute bottom-14 flex flex-col items-center gap-3">
        <div className="w-36 h-0.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-white/70"
            style={{ animation: "splash-progress 2s ease-in-out forwards" }}
          />
        </div>
        <span className="text-xs text-white/30 font-medium tracking-widest uppercase">Loading</span>
      </div>

      <style>{`
        @keyframes splash-progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  )
}
