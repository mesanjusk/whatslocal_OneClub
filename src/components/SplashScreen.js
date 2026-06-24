"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SplashScreen() {
  const router = useRouter()
  const [phase, setPhase] = useState("enter") // enter → hold → exit

  useEffect(() => {
    const holdTimer  = setTimeout(() => setPhase("hold"), 100)
    const exitTimer  = setTimeout(() => setPhase("exit"), 2400)
    const navTimer   = setTimeout(() => router.replace("/home"), 3000)
    return () => { clearTimeout(holdTimer); clearTimeout(exitTimer); clearTimeout(navTimer) }
  }, [router])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "hsl(240 10% 3.9%)" }}
    >
      {/* Text block */}
      <div
        className="text-center px-8 transition-all duration-700 ease-out"
        style={{
          opacity:   phase === "hold" ? 1 : 0,
          transform: phase === "hold" ? "translateY(0)" : phase === "enter" ? "translateY(24px)" : "translateY(-16px)",
        }}
      >
        <p
          className="text-white font-semibold tracking-wide"
          style={{ fontSize: "clamp(1.1rem, 5vw, 1.4rem)", opacity: 0.7 }}
        >
          Hello Gondia,
        </p>
        <p
          className="text-white font-black leading-none mt-1"
          style={{ fontSize: "clamp(2.4rem, 11vw, 3.2rem)", letterSpacing: "-0.02em" }}
        >
          Let's order.
        </p>
      </div>

      {/* Bottom dot loader */}
      <div
        className="absolute bottom-16 flex gap-2 transition-opacity duration-500"
        style={{ opacity: phase === "hold" ? 1 : 0 }}
      >
        {[0, 1, 2].map((n) => (
          <span
            key={n}
            className="w-1.5 h-1.5 rounded-full bg-white/40"
            style={{ animation: `dot-bounce 1.2s ${n * 0.2}s ease-in-out infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.4; }
          40%            { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
