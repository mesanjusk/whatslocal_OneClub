"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ── TasteLocal logo SVG (location pin + cloche + steam) ──────────────────────
function TasteLocalLogo({ size = 160 }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      {/* Steam wisps */}
      <motion.path
        d="M82 38 Q78 28 82 18 Q86 8 82 0"
        fill="none" stroke="#e8321a" strokeWidth="4.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 1, 0.4] }}
        transition={{ duration: 1.2, delay: 0.3, repeat: Infinity, repeatDelay: 0.6 }}
      />
      <motion.path
        d="M100 34 Q96 22 100 12 Q104 2 100 -6"
        fill="none" stroke="#e8321a" strokeWidth="4.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 1, 0.4] }}
        transition={{ duration: 1.2, delay: 0.5, repeat: Infinity, repeatDelay: 0.6 }}
      />
      <motion.path
        d="M118 38 Q114 28 118 18 Q122 8 118 0"
        fill="none" stroke="#e8321a" strokeWidth="4.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 1, 0.4] }}
        transition={{ duration: 1.2, delay: 0.7, repeat: Infinity, repeatDelay: 0.6 }}
      />

      {/* Location pin body */}
      <defs>
        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ff4500" />
          <stop offset="100%" stopColor="#c8200a" />
        </linearGradient>
        <linearGradient id="clochGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ff5722" />
          <stop offset="100%" stopColor="#e8321a" />
        </linearGradient>
      </defs>

      {/* Pin shape */}
      <path
        d="M100 185 L56 115 Q40 95 40 78 A60 60 0 1 1 160 78 Q160 95 144 115 Z"
        fill="url(#pinGrad)"
      />

      {/* Pin inner highlight */}
      <path
        d="M100 175 L60 112 Q46 94 46 78 A54 54 0 0 1 154 78 Q154 94 140 112 Z"
        fill="url(#clochGrad)" opacity="0.6"
      />

      {/* Cloche dome */}
      <ellipse cx="100" cy="78" rx="52" ry="38" fill="url(#clochGrad)" />

      {/* Cloche lid highlight */}
      <path d="M68 62 Q85 50 105 55" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.45" />

      {/* Cloche handle (knob) */}
      <ellipse cx="100" cy="43" rx="9" ry="6" fill="#c8200a" />
      <ellipse cx="100" cy="41" rx="7" ry="4" fill="#e8321a" />

      {/* Cloche base line */}
      <ellipse cx="100" cy="108" rx="52" ry="7" fill="#b81c08" opacity="0.55" />

      {/* Smiling mouth + tongue (licking lips) */}
      <path
        d="M76 95 Q100 115 124 95"
        fill="none" stroke="#3b1007" strokeWidth="5" strokeLinecap="round"
      />
      {/* Tongue */}
      <path
        d="M113 107 Q120 118 112 120 Q104 122 108 112"
        fill="#e8321a" stroke="none"
      />
      <ellipse cx="111" cy="118" rx="6" ry="5" fill="#e8321a" />

      {/* Shadow under pin */}
      <ellipse cx="100" cy="190" rx="30" ry="6" fill="#c8200a" opacity="0.25" />
    </svg>
  )
}

// ── Main splash ───────────────────────────────────────────────────────────────
export default function SplashScreen() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const navType = performance?.getEntriesByType?.("navigation")?.[0]?.type
    if (navType === "navigate" || navType === "reload" || !navType) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2800)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ pointerEvents: visible ? "all" : "none" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-6"
          >
            <TasteLocalLogo size={160} />
          </motion.div>

          {/* "TasteLocal" wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="flex items-baseline"
            style={{ fontFamily: "sans-serif" }}
          >
            {/* "Taste" — dark brown, bold rounded */}
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#3b1007",
                letterSpacing: "-1px",
                lineHeight: 1,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Taste
            </span>
            {/* "Local" — red gradient, same weight */}
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#e8321a",
                letterSpacing: "-1px",
                lineHeight: 1,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Local
            </span>
          </motion.div>

          {/* Tagline: — LOCAL FOOD, MADE EASY — */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            className="flex items-center gap-2 mt-2"
          >
            {/* Left dash */}
            <div style={{ width: 28, height: 2.5, background: "#e8321a", borderRadius: 2 }} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#3b1007",
                letterSpacing: "3px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              LOCAL FOOD, MADE EASY
            </span>
            {/* Right dash */}
            <div style={{ width: 28, height: 2.5, background: "#e8321a", borderRadius: 2 }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
