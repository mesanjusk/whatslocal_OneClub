"use client"

import { motion } from "framer-motion"

// ── South Indian man holding two thali plates ─────────────────────────────────
function CharacterSVG({ onLeft, onRight }) {
  return (
    <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }}>
      {/* Shadow */}
      <ellipse cx="160" cy="264" rx="60" ry="7" fill="#d1d5db" opacity="0.5" />

      {/* Sandals */}
      <ellipse cx="133" cy="253" rx="19" ry="7" fill="#5c3d1e" />
      <ellipse cx="187" cy="253" rx="19" ry="7" fill="#5c3d1e" />
      <rect x="127" y="244" width="12" height="6" rx="3" fill="#7c4d28" />
      <rect x="181" y="244" width="12" height="6" rx="3" fill="#7c4d28" />

      {/* Dhoti (white veshti) */}
      <path d="M120 148 Q110 190 112 253 L208 253 Q210 190 200 148 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      {/* Gold border stripes */}
      <line x1="113" y1="240" x2="207" y2="240" stroke="#d97706" strokeWidth="3.5" />
      <line x1="114" y1="246" x2="206" y2="246" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
      {/* Dhoti center fold */}
      <path d="M142 152 Q160 166 178 152" fill="none" stroke="#e2e8f0" strokeWidth="1.2" opacity="0.7" />

      {/* Shirt (white kurta) */}
      <path d="M120 100 Q106 110 104 148 L216 148 Q214 110 200 100 Z" fill="#f8fafc" stroke="#e5e7eb" strokeWidth="1" />
      {/* Collar V */}
      <path d="M152 100 L160 120 L168 100" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      {/* Buttons */}
      <circle cx="160" cy="126" r="1.8" fill="#d1d5db" />
      <circle cx="160" cy="134" r="1.8" fill="#d1d5db" />
      <circle cx="160" cy="142" r="1.8" fill="#d1d5db" />
      {/* Pocket */}
      <rect x="170" y="117" width="15" height="13" rx="2.5" fill="none" stroke="#e5e7eb" strokeWidth="1" />

      {/* Angavastram (shoulder cloth with gold stripe) */}
      <path d="M138 102 Q128 118 126 148" fill="none" stroke="#f1f5f9" strokeWidth="7" strokeLinecap="round" />
      <path d="M138 102 Q128 118 126 148" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,9" />

      {/* LEFT ARM */}
      <path d="M120 110 Q88 106 56 102 Q44 101 42 109 Q42 117 54 119 Q86 122 120 118"
        fill="#c8845a" stroke="#a86840" strokeWidth="1" />
      {/* Left hand */}
      <ellipse cx="46" cy="112" rx="11" ry="9" fill="#c8845a" stroke="#a86840" strokeWidth="1" />

      {/* LEFT PLATE — clickable Idli thali */}
      <g onClick={onLeft} style={{ cursor: "pointer" }}>
        <motion.g whileHover={{ scale: 1.08 }} style={{ transformOrigin: "22px 100px" }}>
          {/* Steel rim */}
          <ellipse cx="22" cy="100" rx="23" ry="18" fill="#9ca3af" stroke="#6b7280" strokeWidth="1.5" />
          {/* Plate surface */}
          <ellipse cx="22" cy="100" rx="21" ry="16" fill="#e5e7eb" />
          {/* Banana leaf */}
          <ellipse cx="22" cy="100" rx="18" ry="13" fill="#86efac" opacity="0.65" />
          {/* Idli 1 */}
          <ellipse cx="13" cy="94" rx="7.5" ry="5.5" fill="#fef3c7" stroke="#e8d5a0" strokeWidth="1" />
          <ellipse cx="13" cy="92" rx="6" ry="4" fill="#fffdf8" />
          <ellipse cx="11" cy="91" rx="2" ry="1.5" fill="white" opacity="0.5" />
          {/* Idli 2 */}
          <ellipse cx="27" cy="94" rx="7.5" ry="5.5" fill="#fef3c7" stroke="#e8d5a0" strokeWidth="1" />
          <ellipse cx="27" cy="92" rx="6" ry="4" fill="#fffdf8" />
          <ellipse cx="25" cy="91" rx="2" ry="1.5" fill="white" opacity="0.5" />
          {/* Sambar bowl */}
          <ellipse cx="16" cy="111" rx="6" ry="4.5" fill="#78350f" stroke="#92400e" strokeWidth="0.8" />
          <ellipse cx="16" cy="109.5" rx="5" ry="3.5" fill="#d97706" />
          {/* Chutney bowl */}
          <ellipse cx="29" cy="112" rx="5" ry="4" fill="#14532d" stroke="#166534" strokeWidth="0.8" />
          <ellipse cx="29" cy="110.5" rx="4" ry="3" fill="#22c55e" />
        </motion.g>
      </g>

      {/* RIGHT ARM */}
      <path d="M200 110 Q232 106 264 102 Q276 101 278 109 Q278 117 266 119 Q234 122 200 118"
        fill="#c8845a" stroke="#a86840" strokeWidth="1" />
      {/* Right hand */}
      <ellipse cx="274" cy="112" rx="11" ry="9" fill="#c8845a" stroke="#a86840" strokeWidth="1" />

      {/* RIGHT PLATE — clickable Dosa thali */}
      <g onClick={onRight} style={{ cursor: "pointer" }}>
        <motion.g whileHover={{ scale: 1.08 }} style={{ transformOrigin: "298px 100px" }}>
          {/* Steel rim */}
          <ellipse cx="298" cy="100" rx="23" ry="18" fill="#9ca3af" stroke="#6b7280" strokeWidth="1.5" />
          {/* Plate surface */}
          <ellipse cx="298" cy="100" rx="21" ry="16" fill="#e5e7eb" />
          {/* Banana leaf */}
          <ellipse cx="298" cy="100" rx="18" ry="13" fill="#86efac" opacity="0.65" />
          {/* Dosa (rolled) */}
          <path d="M283 92 L316 98 L283 111 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
          <path d="M285 94 L312 99 L285 109 Z" fill="#fbbf24" />
          <path d="M287 97 L309 100 L287 107 Z" fill="#fde68a" opacity="0.6" />
          {/* Dosa filling hint */}
          <ellipse cx="291" cy="102" rx="5" ry="4" fill="#f97316" opacity="0.45" />
          {/* Sambar bowl */}
          <ellipse cx="292" cy="113" rx="6" ry="4.5" fill="#78350f" stroke="#92400e" strokeWidth="0.8" />
          <ellipse cx="292" cy="111.5" rx="5" ry="3.5" fill="#d97706" />
          {/* Chutney bowl */}
          <ellipse cx="306" cy="114" rx="5" ry="4" fill="#14532d" stroke="#166534" strokeWidth="0.8" />
          <ellipse cx="306" cy="112.5" rx="4" ry="3" fill="#22c55e" />
        </motion.g>
      </g>

      {/* Neck */}
      <rect x="148" y="84" width="24" height="18" rx="11" fill="#c8845a" stroke="#a86840" strokeWidth="0.8" />

      {/* Head */}
      <ellipse cx="160" cy="55" rx="36" ry="38" fill="#c8845a" stroke="#a86840" strokeWidth="1.5" />

      {/* Hair sides */}
      <path d="M126 46 Q128 28 160 26 Q192 28 194 46 Q188 34 160 36 Q132 34 126 46 Z" fill="#1c1917" />
      <path d="M126 46 Q122 57 124 70" stroke="#1c1917" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M194 46 Q198 57 196 70" stroke="#1c1917" strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* Turban — white cloth with gold stripe */}
      <path d="M128 42 Q132 18 160 16 Q188 18 192 42 Q180 26 160 28 Q140 26 128 42 Z" fill="white" />
      <path d="M130 37 Q160 20 190 37" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" />
      <path d="M128 43 Q160 24 192 43" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <path d="M127 50 Q160 30 193 50" fill="none" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
      {/* Turban gold stripe */}
      <path d="M130 42 Q160 24 190 42" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      {/* Top knot */}
      <ellipse cx="160" cy="20" rx="14" ry="9" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <path d="M151 20 Q160 15 169 20" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />

      {/* Ears */}
      <ellipse cx="124" cy="58" rx="5" ry="8.5" fill="#c8845a" stroke="#a86840" strokeWidth="1" />
      <ellipse cx="196" cy="58" rx="5" ry="8.5" fill="#c8845a" stroke="#a86840" strokeWidth="1" />

      {/* Tilak — red bindi + white lines */}
      <circle cx="160" cy="37" r="4" fill="#dc2626" />
      <line x1="152" y1="42" x2="168" y2="42" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
      <line x1="154" y1="47" x2="166" y2="47" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />

      {/* Eyebrows */}
      <path d="M138 56 Q145 51 153 55" fill="none" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M167 55 Q175 51 182 56" fill="none" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="145" cy="63" rx="7.5" ry="8" fill="white" />
      <ellipse cx="175" cy="63" rx="7.5" ry="8" fill="white" />
      <circle cx="146" cy="64" r="5" fill="#1c1917" />
      <circle cx="176" cy="64" r="5" fill="#1c1917" />
      <circle cx="147.5" cy="62" r="2" fill="white" />
      <circle cx="177.5" cy="62" r="2" fill="white" />

      {/* Nose */}
      <path d="M157 73 Q160 78 163 73" fill="none" stroke="#a86840" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="154" cy="74" rx="3" ry="2" fill="#b87050" opacity="0.25" />
      <ellipse cx="166" cy="74" rx="3" ry="2" fill="#b87050" opacity="0.25" />

      {/* Big Mustache */}
      <path d="M140 81 Q148 88 155 86 Q160 84 165 86 Q172 88 180 81 Q170 85 160 84 Q150 85 140 81 Z" fill="#1c1917" />
      {/* Curled ends */}
      <path d="M140 81 Q133 77 136 71" fill="none" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
      <path d="M180 81 Q187 77 184 71" fill="none" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />

      {/* Big smile (cheeks) */}
      <ellipse cx="136" cy="74" rx="6" ry="4" fill="#e07060" opacity="0.2" />
      <ellipse cx="184" cy="74" rx="6" ry="4" fill="#e07060" opacity="0.2" />
      <path d="M148 92 Q160 101 172 92" fill="none" stroke="#7c3f20" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

// ── Main exported mascot ──────────────────────────────────────────────────────
export default function CategoryMascot({ categoryKey, onSelectFood }) {
  if (categoryKey !== "south indian") return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center gap-2 py-3"
    >
      {/* Header */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="text-[15px] font-black text-gray-800 text-center"
      >
        What would you like today?
      </motion.p>

      {/* Animated character */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-full px-2"
      >
        <CharacterSVG
          onLeft={() => onSelectFood("idli")}
          onRight={() => onSelectFood("dosa")}
        />
      </motion.div>

      {/* Plate labels */}
      <div className="flex w-full px-4 justify-between -mt-1">
        {[
          { key: "idli", label: "Idli", desc: "Soft & steamed" },
          { key: "dosa", label: "Dosa", desc: "Crispy & golden" },
        ].map((item, i) => (
          <motion.button
            key={item.key}
            onClick={() => onSelectFood(item.key)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 280, damping: 20 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            className="flex flex-col items-center gap-0.5 bg-white border-2 border-gray-100 rounded-2xl px-5 py-2.5 shadow-md"
          >
            <span className="text-[13px] font-black text-gray-900">{item.label}</span>
            <span className="text-[10px] text-gray-400 font-medium">{item.desc}</span>
            <span className="text-[10px] text-[#e23744] font-bold mt-0.5">Compare →</span>
          </motion.button>
        ))}
      </div>

      {/* Full meal option */}
      <motion.button
        onClick={() => onSelectFood("south indian")}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.85, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl px-5 py-3 shadow-sm w-[calc(100%-2rem)]"
      >
        <span className="text-2xl">🍛</span>
        <div className="text-left">
          <p className="text-[13px] font-black text-gray-900">Full South Indian Meal</p>
          <p className="text-[10px] text-gray-400 font-medium">Rice · Sambar · Rasam · Poriyal</p>
        </div>
        <span className="ml-auto text-[10px] text-[#e23744] font-black">Compare →</span>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-[11px] text-gray-400 text-center mt-1"
      >
        or type any dish in the search box above
      </motion.p>
    </motion.div>
  )
}
