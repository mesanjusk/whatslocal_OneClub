"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LuArrowRight, LuSparkles, LuChevronRight, LuTrophy, LuSearch } from "react-icons/lu"
import { TiStarFullOutline } from "react-icons/ti"
import { CATEGORIES, getResults, pickWinner } from "@/lib/aiData"
import clsx from "clsx"

// ── Typing animation hook ─────────────────────────────────────────────────────
function useTypingText(text, speed = 18) {
  const [displayed, setDisplayed] = useState("")
  useEffect(() => {
    setDisplayed("")
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return displayed
}

// ── Pulsing AI dots ───────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map(i => (
        <motion.span key={i} className="w-2 h-2 rounded-full bg-[#e23744]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
      ))}
      <span className="text-xs text-gray-400 ml-1 font-medium">AI is thinking…</span>
    </div>
  )
}

// ── Rating stars ──────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <TiStarFullOutline key={n} size={11}
          className={n <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"} />
      ))}
      <span className="text-xs font-semibold text-gray-700 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

// ── Tag chip ──────────────────────────────────────────────────────────────────
function Tag({ label }) {
  const styles = {
    "Most Ordered":  "bg-orange-50 text-orange-600 border-orange-200",
    "Recommended":   "bg-[#e23744]/10 text-[#e23744] border-[#e23744]/20",
    "Best Value":    "bg-green-50 text-green-700 border-green-200",
    "Best Quantity": "bg-blue-50 text-blue-600 border-blue-200",
    "Cheapest":      "bg-emerald-50 text-emerald-700 border-emerald-200",
  }
  return (
    <span className={clsx("text-[10px] font-semibold px-2 py-0.5 rounded-full border",
      styles[label] || "bg-gray-100 text-gray-500 border-gray-200")}>
      {label}
    </span>
  )
}

// ── Score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, max = 5, color = "bg-[#e23744]" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-14 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <motion.div className={clsx("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-5 text-right">{value.toFixed ? value.toFixed(1) : value}</span>
    </div>
  )
}

// ── Comparison card ───────────────────────────────────────────────────────────
function ComparisonCard({ item, isWinner, index }) {
  const [expanded, setExpanded] = useState(false)
  const valueScore = Math.min(5, parseFloat(((300 / item.price) * 2).toFixed(1)))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4, ease: "easeOut" }}
      className={clsx(
        "rounded-2xl border overflow-hidden",
        isWinner
          ? "border-[#e23744]/30 bg-gradient-to-br from-[#fff5f5] to-white shadow-md shadow-[#e23744]/10"
          : "border-gray-200 bg-white shadow-sm"
      )}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              {isWinner && (
                <span className="text-[10px] font-bold bg-[#e23744] text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <LuTrophy size={9} /> TOP PICK
                </span>
              )}
              {item.tags.map(t => <Tag key={t} label={t} />)}
            </div>
            <h3 className="font-bold text-[15px] text-gray-900 mt-1.5 leading-tight">{item.restaurant}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-black text-gray-900">₹{item.price}</p>
            <p className="text-xs text-gray-400">{item.quantity}</p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2">
          <Stars rating={item.rating} />
          <div className="flex gap-1.5 flex-wrap">
            {item.pros.map(p => (
              <span key={p} className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-md font-medium">
                ✓ {p}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <ScoreBar label="Taste" value={item.tasteScore} color="bg-[#e23744]" />
          <ScoreBar label="Value" value={valueScore} color="bg-emerald-500" />
          <ScoreBar label="Rating" value={item.rating} color="bg-yellow-400" />
        </div>
      </div>

      {/* Expandable insights */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full px-4 py-2.5 border-t border-gray-100 flex items-center justify-between bg-gray-50/70 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <LuSparkles size={12} className="text-[#e23744]" />
          AI Taste Insights
        </span>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <LuChevronRight size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="px-4 py-3 space-y-2 bg-white">
              {item.insights.map((ins, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-0.5 text-[#e23744] shrink-0 font-bold">›</span>
                  {ins}
                </motion.li>
              ))}
              {item.cons.length > 0 && (
                <li className="flex items-start gap-2 text-xs text-gray-400 pt-1.5 border-t border-gray-100">
                  <span className="shrink-0">⚠</span>
                  {item.cons[0]}
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Winner banner ─────────────────────────────────────────────────────────────
function WinnerBanner({ winner, query }) {
  const fullText = `Based on taste, value, and popularity — ${winner.restaurant} is our top pick for ${query}.`
  const text = useTypingText(fullText, 22)
  const isTyping = text.length < fullText.length

  const why = [
    winner.tags.includes("Most Ordered") && "Most ordered by locals",
    winner.tags.includes("Best Value")   && "Best price-to-quality ratio",
    winner.tasteScore >= 4.3             && "Exceptional taste score",
    winner.rating >= 4.4                 && "Highly rated by customers",
    winner.pros[0]                       && winner.pros[0],
  ].filter(Boolean).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-[#e23744]/25 bg-gradient-to-br from-[#fff0f0] via-white to-[#fff8f0] p-5 shadow-lg shadow-[#e23744]/10"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#e23744] flex items-center justify-center shrink-0 shadow-sm shadow-[#e23744]/40">
            <LuTrophy size={16} color="white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#e23744] uppercase tracking-widest">🏆 Best Choice For You</p>
            <p className="font-black text-[18px] text-gray-900 leading-tight">{winner.restaurant}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-gray-900">₹{winner.price}</p>
          <p className="text-xs text-gray-400">{winner.quantity}</p>
        </div>
      </div>

      <div className="bg-white/80 rounded-xl px-3.5 py-2.5 border border-[#e23744]/10 mb-3.5 min-h-[52px]">
        <p className="text-sm text-gray-700 leading-relaxed">
          {text}
          {isTyping && (
            <span className="inline-block w-0.5 h-3.5 bg-[#e23744] ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>

      {why.length > 0 && (
        <ul className="space-y-1.5 mb-3">
          {why.map((w, i) => (
            <motion.li key={w}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-2 text-xs text-gray-600 font-medium">
              <span className="w-4 h-4 rounded-full bg-[#e23744]/15 text-[#e23744] flex items-center justify-center text-[9px] shrink-0 font-bold">✓</span>
              {w}
            </motion.li>
          ))}
        </ul>
      )}

      <Stars rating={winner.rating} />
    </motion.div>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}
      className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-100 rounded-full" />
          <div className="h-5 w-36 bg-gray-200 rounded-full" />
        </div>
        <div className="h-8 w-16 bg-gray-100 rounded-xl" />
      </div>
      <div className="space-y-2 pt-1">
        <div className="h-2 bg-gray-100 rounded-full" />
        <div className="h-2 bg-gray-100 rounded-full w-4/5" />
        <div className="h-2 bg-gray-100 rounded-full w-3/5" />
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RecommendedPage() {
  const [input, setInput]               = useState("")
  const [activeTab, setActiveTab]       = useState(null)
  const [thinking, setThinking]         = useState(false)
  const [results, setResults]           = useState(null)
  const [winner, setWinner]             = useState(null)
  const [currentQuery, setCurrentQuery] = useState("")
  const inputRef = useRef(null)

  const triggerSearch = (query) => {
    if (!query.trim()) return
    setThinking(true)
    setResults(null)
    setWinner(null)
    setCurrentQuery(query)
    setTimeout(() => {
      const res = getResults(query)
      setResults(res)
      if (res?.results?.length) setWinner(pickWinner(res.results))
      setThinking(false)
    }, 1600)
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab.key)
    setInput(tab.label)
    triggerSearch(tab.key)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (input.trim()) { setActiveTab(null); triggerSearch(input.trim()) }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-50 bg-white shadow-sm px-4 pt-5 pb-4 space-y-4">

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#e23744] flex items-center justify-center shrink-0 shadow-sm shadow-[#e23744]/30">
            <LuSparkles size={14} color="white" />
          </div>
          <div>
            <h1 className="font-black text-[18px] text-gray-900 leading-none">AI Recommended</h1>
            <p className="text-[10px] text-gray-400 mt-0.5">Smart picks, just for you</p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
          <LuSparkles size={15} className="text-[#e23744] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="What are you feeling today?"
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          <motion.button type="submit" whileTap={{ scale: 0.88 }} disabled={!input.trim()}
            className="w-8 h-8 rounded-lg bg-[#e23744] flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity">
            <LuArrowRight size={15} color="white" strokeWidth={2.5} />
          </motion.button>
        </form>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(tab => (
            <motion.button key={tab.key} whileTap={{ scale: 0.93 }}
              onClick={() => handleTabClick(tab)}
              className={clsx(
                "shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all",
                activeTab === tab.key
                  ? "bg-[#e23744] text-white border-[#e23744]"
                  : "bg-white text-gray-600 border-gray-200"
              )}>
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-5 pb-28 space-y-4">

        {/* Initial empty state */}
        {!thinking && !results && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-14 space-y-4">
            <motion.div className="text-5xl select-none"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}>
              🤖
            </motion.div>
            <div>
              <p className="font-bold text-gray-700 text-base">Ask me anything</p>
              <p className="text-sm text-gray-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
                Type a dish or tap a category — I'll compare restaurants and pick the best one for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {["idli", "paneer", "biryani", "dosa", "burger", "noodles"].map(s => (
                <button key={s}
                  onClick={() => { setInput(s); triggerSearch(s) }}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#e23744] hover:text-[#e23744] transition-colors font-medium">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Thinking skeleton */}
        <AnimatePresence>
          {thinking && (
            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-4">
              <ThinkingDots />
              {[0, 1, 2].map(i => <SkeletonCard key={i} delay={i * 0.1} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {!thinking && results && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

              <div className="flex items-center gap-2">
                <LuSparkles size={13} className="text-[#e23744]" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Results for "{currentQuery}"
                </p>
                <span className="ml-auto text-xs text-gray-400 font-medium">
                  {results.results.length} match{results.results.length !== 1 ? "es" : ""}
                </span>
              </div>

              {results.results.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-14 space-y-3">
                  <p className="text-4xl">🤔</p>
                  <p className="font-semibold text-gray-700">No results for "{currentQuery}"</p>
                  <p className="text-sm text-gray-400">Try: idli, paneer, biryani, dosa, pizza…</p>
                </motion.div>
              ) : (
                <>
                  {results.results.map((item, i) => (
                    <ComparisonCard
                      key={item.id + item.restaurant}
                      item={item}
                      isWinner={winner?.restaurant === item.restaurant && winner?.price === item.price}
                      index={i}
                    />
                  ))}

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">AI Verdict</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {winner && <WinnerBanner winner={winner} query={currentQuery} />}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
