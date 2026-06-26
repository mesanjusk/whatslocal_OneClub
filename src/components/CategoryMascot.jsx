"use client"

import { motion } from "framer-motion"

// ── Food SVG illustrations (hand-drawn style) ─────────────────────────────────

function IdliSVG() {
  return (
    <svg viewBox="0 0 64 48" width="50" height="38">
      <ellipse cx="32" cy="43" rx="26" ry="4" fill="#86efac" opacity="0.55" />
      <ellipse cx="32" cy="39" rx="24" ry="3.5" fill="#d97706" opacity="0.25" />
      <ellipse cx="19" cy="32" rx="13" ry="9" fill="#fef3c7" stroke="#d5b577" strokeWidth="1.5" />
      <ellipse cx="19" cy="29" rx="11" ry="7" fill="#fffdf8" />
      <ellipse cx="16" cy="27" rx="3" ry="2" fill="#fff" opacity="0.55" />
      <ellipse cx="43" cy="32" rx="13" ry="9" fill="#fef3c7" stroke="#d5b577" strokeWidth="1.5" />
      <ellipse cx="43" cy="29" rx="11" ry="7" fill="#fffdf8" />
      <ellipse cx="40" cy="27" rx="3" ry="2" fill="#fff" opacity="0.55" />
      <circle cx="32" cy="35" r="4.5" fill="#4ade80" opacity="0.75" />
      <circle cx="32" cy="35" r="2.5" fill="#22c55e" opacity="0.6" />
    </svg>
  )
}

function DosaSVG() {
  return (
    <svg viewBox="0 0 70 56" width="56" height="44">
      <ellipse cx="35" cy="50" rx="28" ry="5" fill="#d4a574" opacity="0.3" />
      <path d="M10 50 L35 8 L60 50 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 44 Q35 22 48 44" fill="none" stroke="#b45309" strokeWidth="1.2" opacity="0.45" />
      <path d="M27 48 Q35 32 43 48" fill="none" stroke="#b45309" strokeWidth="1" opacity="0.35" />
      <path d="M30 14 L35 8 L40 14" fill="#fbbf24" strokeWidth="0" />
      <ellipse cx="35" cy="32" rx="8" ry="5.5" fill="#f97316" opacity="0.55" />
      <circle cx="16" cy="47" r="4.5" fill="#4ade80" opacity="0.85" />
    </svg>
  )
}

function SambarSVG() {
  return (
    <svg viewBox="0 0 64 60" width="52" height="48">
      <path d="M10 34 Q10 54 32 54 Q54 54 54 34 L50 26 Q32 30 14 26 Z" fill="#d97706" />
      <ellipse cx="32" cy="26" rx="22" ry="6" fill="#f59e0b" />
      <ellipse cx="32" cy="26" rx="20" ry="5" fill="#b45309" />
      <path d="M22 18 Q20 12 22 7" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M32 16 Q30 10 32 5" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M42 18 Q40 12 42 7" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <circle cx="25" cy="26" r="2.5" fill="#16a34a" opacity="0.85" />
      <circle cx="38" cy="25" r="2" fill="#dc2626" opacity="0.75" />
      <circle cx="32" cy="28" r="1.5" fill="#f97316" opacity="0.85" />
    </svg>
  )
}

// ── Cartoon South Indian man (thinking pose) ──────────────────────────────────
function CharacterSVG() {
  return (
    <svg viewBox="0 0 120 185" width="120" height="185">
      {/* Shadow */}
      <ellipse cx="57" cy="183" rx="30" ry="6" fill="#e5e7eb" opacity="0.6" />
      {/* Veshti (white dhoti) */}
      <path d="M28 97 Q22 145 25 175 L50 175 L52 132 L58 132 L60 175 L88 175 Q91 145 84 97 Z"
        fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* Veshti gold border */}
      <line x1="25" y1="97" x2="87" y2="97" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="25" y1="102" x2="87" y2="102" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
      {/* Kurta/shirt */}
      <path d="M30 68 Q20 76 20 97 L90 97 Q90 76 82 68 Z" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.2" />
      {/* Collar */}
      <path d="M50 68 L56 82 L62 68" fill="#fff" stroke="#f59e0b" strokeWidth="1" />
      {/* Left arm – raised, thinking */}
      <path d="M30 74 Q15 80 12 68 Q10 58 22 56 Q28 60 34 70" fill="#c8956c" stroke="#a87050" strokeWidth="1.2" />
      {/* Right arm */}
      <path d="M82 74 Q96 82 98 94 Q98 100 90 98 Q86 90 80 82" fill="#c8956c" stroke="#a87050" strokeWidth="1.2" />
      {/* Hand at chin */}
      <ellipse cx="18" cy="55" rx="8" ry="6" fill="#c8956c" stroke="#a87050" strokeWidth="1" />
      {/* Finger lines */}
      <line x1="13" y1="54" x2="23" y2="54" stroke="#a87050" strokeWidth="0.8" opacity="0.5" />
      <line x1="13" y1="57" x2="23" y2="57" stroke="#a87050" strokeWidth="0.8" opacity="0.5" />
      {/* Neck */}
      <rect x="48" y="56" width="16" height="14" rx="7" fill="#c8956c" stroke="#a87050" strokeWidth="0.8" />
      {/* Head */}
      <ellipse cx="56" cy="36" rx="28" ry="28" fill="#c8956c" stroke="#a87050" strokeWidth="1.5" />
      {/* Hair */}
      <path d="M29 28 Q32 8 56 8 Q80 8 83 28 Q72 16 56 18 Q40 16 29 28 Z" fill="#1c1917" />
      {/* Sideburns */}
      <path d="M29 28 Q26 36 28 44" stroke="#1c1917" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M83 28 Q86 36 84 44" stroke="#1c1917" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Vibhuti/tilak */}
      <line x1="56" y1="18" x2="56" y2="26" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
      <line x1="51" y1="21" x2="61" y2="21" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* Eyebrows — one raised (thinking) */}
      <path d="M38 32 Q42 28 47 32" fill="none" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M65 30 Q69 26 73 31" fill="none" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="42" cy="38" rx="6" ry="6.5" fill="white" />
      <ellipse cx="70" cy="38" rx="6" ry="6.5" fill="white" />
      <circle cx="43" cy="39" r="3.8" fill="#1c1917" />
      <circle cx="71" cy="39" r="3.8" fill="#1c1917" />
      <circle cx="44.5" cy="37.5" r="1.4" fill="white" />
      <circle cx="72.5" cy="37.5" r="1.4" fill="white" />
      {/* Nose */}
      <path d="M54 44 Q56 48 58 44" fill="none" stroke="#a87050" strokeWidth="1.2" strokeLinecap="round" />
      {/* Mustache */}
      <path d="M45 51 Q50 55 56 53 Q62 55 67 51 Q62 53 56 52 Q50 53 45 51 Z" fill="#1c1917" />
      {/* Smile */}
      <path d="M49 58 Q56 64 63 58" fill="none" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" />
      {/* Ears */}
      <ellipse cx="28" cy="40" rx="4" ry="6.5" fill="#c8956c" stroke="#a87050" strokeWidth="1" />
      <ellipse cx="84" cy="40" rx="4" ry="6.5" fill="#c8956c" stroke="#a87050" strokeWidth="1" />
      {/* Temple flower */}
      <g transform="translate(80, 26)">
        {[0,72,144,216,288].map((angle, i) => (
          <ellipse key={i}
            cx={Math.cos((angle * Math.PI) / 180) * 4}
            cy={Math.sin((angle * Math.PI) / 180) * 4}
            rx="3.5" ry="2.2"
            transform={`rotate(${angle})`}
            fill="#fbbf24" opacity="0.9" />
        ))}
        <circle cx="0" cy="0" r="2.5" fill="#f97316" />
      </g>
      {/* Feet */}
      <ellipse cx="36" cy="177" rx="11" ry="5" fill="#c8956c" stroke="#a87050" strokeWidth="1" />
      <ellipse cx="74" cy="177" rx="11" ry="5" fill="#c8956c" stroke="#a87050" strokeWidth="1" />
    </svg>
  )
}

// ── Foods config ───────────────────────────────────────────────────────────────
const SOUTH_INDIAN_FOODS = [
  { key: "idli",         label: "Idli",         SVG: IdliSVG,    desc: "Soft & steamed" },
  { key: "dosa",         label: "Dosa",         SVG: DosaSVG,    desc: "Crispy & golden" },
  { key: "south indian", label: "Full Meal",    SVG: SambarSVG,  desc: "Sambar + more" },
]

// ── Main exported mascot ──────────────────────────────────────────────────────
export default function CategoryMascot({ categoryKey, onSelectFood }) {
  if (categoryKey !== "south indian") return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="flex flex-col items-center gap-4 py-4"
    >
      {/* Header text */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[14px] font-black text-gray-700 text-center"
      >
        🤔 What are you in the mood for?
      </motion.p>

      {/* Character + bubbles */}
      <div className="flex items-end gap-3 w-full px-2">

        {/* Animated character */}
        <motion.div
          className="shrink-0"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <CharacterSVG />
        </motion.div>

        {/* Thought bubbles */}
        <div className="flex flex-col gap-3 pb-4 flex-1">
          {SOUTH_INDIAN_FOODS.map((food, i) => {
            const FoodComp = food.SVG
            return (
              <motion.button
                key={food.key}
                onClick={() => onSelectFood(food.key)}
                initial={{ scale: 0, opacity: 0, x: 24 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                transition={{
                  delay: 0.4 + i * 0.18,
                  type: "spring",
                  stiffness: 320,
                  damping: 20,
                }}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.93 }}
                className="relative flex items-center gap-3 bg-white rounded-2xl border-2 border-gray-100 shadow-md px-3 py-2.5 text-left w-full"
              >
                {/* Thought dots connecting to character */}
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
                  {[4, 6, 8].map((s, j) => (
                    <motion.span
                      key={j}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.36 + i * 0.18 + j * 0.06 }}
                      className="rounded-full bg-white border border-gray-200 shadow-sm block"
                      style={{ width: s, height: s }}
                    />
                  ))}
                </div>

                {/* Food illustration */}
                <div className="shrink-0">
                  <FoodComp />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="text-[14px] font-black text-gray-900 leading-tight">{food.label}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{food.desc}</p>
                  <p className="text-[10px] text-[#e23744] font-bold mt-1">Compare restaurants →</p>
                </div>

                {/* Sparkle decoration */}
                <motion.span
                  className="absolute -top-2 -right-1 text-yellow-400 text-xs select-none"
                  animate={{ rotate: [0, 18, -12, 0], scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.38 }}
                >
                  ✦
                </motion.span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="text-[11px] text-gray-400 text-center"
      >
        or type any dish in the search box above
      </motion.p>
    </motion.div>
  )
}
