"use client"

import { motion, AnimatePresence } from "framer-motion"

// ── Character SVG — white dhoti, turban, holding plates ───────────────────────
function CharacterSVG({ onLeft, onRight }) {
  return (
    <svg viewBox="30 10 260 250" width="100%" style={{ maxWidth: 320 }}>
      {/* Shadow */}
      <ellipse cx="160" cy="258" rx="52" ry="6" fill="#d1d5db" opacity="0.4" />

      {/* Sandals */}
      <ellipse cx="135" cy="250" rx="18" ry="6.5" fill="#5c3d1e" />
      <ellipse cx="185" cy="250" rx="18" ry="6.5" fill="#5c3d1e" />
      <rect x="129" y="242" width="11" height="5" rx="2.5" fill="#7c4d28" />
      <rect x="183" y="242" width="11" height="5" rx="2.5" fill="#7c4d28" />

      {/* Dhoti */}
      <path d="M122 148 Q112 192 114 250 L206 250 Q208 192 198 148 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <line x1="115" y1="238" x2="205" y2="238" stroke="#d97706" strokeWidth="3.5" />
      <line x1="116" y1="244" x2="204" y2="244" stroke="#f59e0b" strokeWidth="1.5" opacity="0.55" />
      <path d="M144 152 Q160 165 176 152" fill="none" stroke="#e2e8f0" strokeWidth="1.2" opacity="0.6" />

      {/* Shirt */}
      <path d="M122 100 Q108 110 106 148 L214 148 Q212 110 198 100 Z" fill="#f8fafc" stroke="#e5e7eb" strokeWidth="1" />
      <path d="M152 100 L160 118 L168 100" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <circle cx="160" cy="126" r="1.8" fill="#d1d5db" />
      <circle cx="160" cy="134" r="1.8" fill="#d1d5db" />
      <circle cx="160" cy="142" r="1.8" fill="#d1d5db" />
      <rect x="171" y="117" width="15" height="13" rx="2.5" fill="none" stroke="#e5e7eb" strokeWidth="1" />
      {/* Angavastram */}
      <path d="M140 102 Q130 117 128 148" fill="none" stroke="#f1f5f9" strokeWidth="7" strokeLinecap="round" />
      <path d="M140 102 Q130 117 128 148" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,9" />

      {/* LEFT ARM */}
      <path d="M122 110 Q90 107 58 103 Q46 102 44 110 Q44 118 56 120 Q88 123 122 118" fill="#c8845a" stroke="#a86840" strokeWidth="1" />
      <ellipse cx="48" cy="112" rx="11" ry="9" fill="#c8845a" stroke="#a86840" strokeWidth="1" />
      {/* Left plate — clickable */}
      <g onClick={onLeft} style={{ cursor: "pointer" }}>
        <ellipse cx="24" cy="104" rx="23" ry="18" fill="#9ca3af" stroke="#6b7280" strokeWidth="1.5" />
        <ellipse cx="24" cy="104" rx="21" ry="16" fill="#e5e7eb" />
        <ellipse cx="24" cy="104" rx="18" ry="13" fill="#86efac" opacity="0.6" />
        <ellipse cx="15" cy="97" rx="7.5" ry="5.5" fill="#fef3c7" stroke="#e8d5a0" strokeWidth="1" />
        <ellipse cx="15" cy="95" rx="6" ry="4" fill="#fffdf8" />
        <ellipse cx="28" cy="98" rx="7.5" ry="5.5" fill="#fef3c7" stroke="#e8d5a0" strokeWidth="1" />
        <ellipse cx="28" cy="96" rx="6" ry="4" fill="#fffdf8" />
        <ellipse cx="18" cy="114" rx="5.5" ry="4" fill="#78350f" />
        <ellipse cx="18" cy="112.5" rx="4.5" ry="3" fill="#d97706" />
        <ellipse cx="30" cy="115" rx="4.5" ry="3.5" fill="#14532d" />
        <ellipse cx="30" cy="113.5" rx="3.5" ry="2.5" fill="#22c55e" />
      </g>

      {/* RIGHT ARM */}
      <path d="M198 110 Q230 107 262 103 Q274 102 276 110 Q276 118 264 120 Q232 123 198 118" fill="#c8845a" stroke="#a86840" strokeWidth="1" />
      <ellipse cx="272" cy="112" rx="11" ry="9" fill="#c8845a" stroke="#a86840" strokeWidth="1" />
      {/* Right plate — clickable */}
      <g onClick={onRight} style={{ cursor: "pointer" }}>
        <ellipse cx="296" cy="104" rx="23" ry="18" fill="#9ca3af" stroke="#6b7280" strokeWidth="1.5" />
        <ellipse cx="296" cy="104" rx="21" ry="16" fill="#e5e7eb" />
        <ellipse cx="296" cy="104" rx="18" ry="13" fill="#86efac" opacity="0.6" />
        <path d="M282 95 L314 101 L282 112 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
        <path d="M284 97 L311 102 L284 110 Z" fill="#fbbf24" />
        <path d="M286 100 L308 103 L286 108 Z" fill="#fde68a" opacity="0.6" />
        <ellipse cx="289" cy="103" rx="4.5" ry="3.5" fill="#f97316" opacity="0.4" />
        <ellipse cx="291" cy="115" rx="5.5" ry="4" fill="#78350f" />
        <ellipse cx="291" cy="113.5" rx="4.5" ry="3" fill="#d97706" />
        <ellipse cx="304" cy="116" rx="4.5" ry="3.5" fill="#14532d" />
        <ellipse cx="304" cy="114.5" rx="3.5" ry="2.5" fill="#22c55e" />
      </g>

      {/* Neck */}
      <rect x="149" y="84" width="22" height="18" rx="10" fill="#c8845a" stroke="#a86840" strokeWidth="0.8" />

      {/* Head */}
      <ellipse cx="160" cy="55" rx="35" ry="37" fill="#c8845a" stroke="#a86840" strokeWidth="1.5" />

      {/* Hair */}
      <path d="M127 45 Q130 26 160 24 Q190 26 193 45 Q186 32 160 34 Q134 32 127 45 Z" fill="#1c1917" />
      <path d="M127 45 Q123 56 125 70" stroke="#1c1917" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M193 45 Q197 56 195 70" stroke="#1c1917" strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* Turban */}
      <path d="M129 40 Q134 17 160 15 Q186 17 191 40 Q180 24 160 27 Q140 24 129 40 Z" fill="white" />
      <path d="M131 37 Q160 18 189 37" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" />
      <path d="M129 43 Q160 23 191 43" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <path d="M128 50 Q160 29 192 50" fill="none" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
      <path d="M131 41 Q160 22 189 41" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      <ellipse cx="160" cy="19" rx="13" ry="9" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <path d="M152 19 Q160 14 168 19" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />

      {/* Ears */}
      <ellipse cx="125" cy="58" rx="5" ry="8" fill="#c8845a" stroke="#a86840" strokeWidth="1" />
      <ellipse cx="195" cy="58" rx="5" ry="8" fill="#c8845a" stroke="#a86840" strokeWidth="1" />

      {/* Tilak */}
      <circle cx="160" cy="37" r="3.8" fill="#dc2626" />
      <line x1="153" y1="42" x2="167" y2="42" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
      <line x1="155" y1="47" x2="165" y2="47" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />

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
      <ellipse cx="154" cy="73.5" rx="3" ry="2" fill="#b87050" opacity="0.25" />
      <ellipse cx="166" cy="73.5" rx="3" ry="2" fill="#b87050" opacity="0.25" />

      {/* Big mustache */}
      <path d="M140 81 Q148 88 155 86 Q160 84 165 86 Q172 88 180 81 Q170 85 160 84 Q150 85 140 81 Z" fill="#1c1917" />
      <path d="M140 81 Q133 77 136 71" fill="none" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
      <path d="M180 81 Q187 77 184 71" fill="none" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />

      {/* Smile + cheeks */}
      <ellipse cx="136" cy="74" rx="6" ry="4" fill="#e07060" opacity="0.18" />
      <ellipse cx="184" cy="74" rx="6" ry="4" fill="#e07060" opacity="0.18" />
      <path d="M149 92 Q160 101 171 92" fill="none" stroke="#7c3f20" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

// ── Main exported mascot banner ───────────────────────────────────────────────
export default function CategoryMascot({ categoryKey, onSelectFood }) {
  if (categoryKey !== "south indian") return null

  const foods = [
    { key: "idli", label: "Idli", desc: "Soft, Steamed & Healthy" },
    { key: "dosa", label: "Dosa", desc: "Crispy, Golden & Classic" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative rounded-3xl overflow-hidden"
      style={{ background: "#fdf8f0", minHeight: 340 }}
    >
      {/* Thought bubble — top left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 280, damping: 22 }}
        className="absolute top-5 left-4 z-10"
        style={{ maxWidth: 155 }}
      >
        <div className="bg-white rounded-[22px] px-4 py-3 shadow-lg border border-gray-100">
          <p className="text-[13px] font-bold text-gray-800 leading-snug text-center">
            Craving something<br />delicious from<br />South India?
          </p>
        </div>
        {/* Thought dots */}
        <div className="flex flex-col items-end gap-[5px] pr-5 mt-1.5">
          {[10, 7, 5].map((s, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="rounded-full bg-white shadow-sm border border-gray-200"
              style={{ width: s, height: s }}
            />
          ))}
        </div>
      </motion.div>

      {/* Character */}
      <motion.div
        className="flex justify-center px-2 pt-2"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <CharacterSVG
          onLeft={() => onSelectFood("idli")}
          onRight={() => onSelectFood("dosa")}
        />
      </motion.div>

      {/* Clickable food cards */}
      <div className="flex gap-3 px-4 pb-5 -mt-3">
        {foods.map((food, i) => (
          <motion.button
            key={food.key}
            onClick={() => onSelectFood(food.key)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.14, type: "spring", stiffness: 300, damping: 24 }}
            whileHover={{ scale: 1.04, y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.13)" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 px-4 py-3 text-left"
          >
            <p className="font-black text-[16px] text-gray-900">{food.label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{food.desc}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[12px] text-[#e23744] font-bold">Compare Now</span>
              <span className="text-[12px] text-[#e23744]">→</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
