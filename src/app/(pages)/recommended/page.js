"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LuArrowRight, LuSparkles, LuPlus, LuMinus, LuTrophy,
  LuShoppingCart, LuCheck,
} from "react-icons/lu"
import { TiStarFullOutline } from "react-icons/ti"
import { CATEGORIES, TASTE_ICONS, getResults, pickWinner } from "@/lib/aiData"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addItem, selectItemQty } from "@/lib/store/slices/cartSlice"
import clsx from "clsx"

// ── Typing hook ───────────────────────────────────────────────────────────────
function useTypingText(text, speed = 20) {
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

// ── AI thinking dots ──────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-center gap-2 py-1">
      {[0, 1, 2].map(i => (
        <motion.span key={i}
          className="w-2 h-2 rounded-full bg-[#e23744]"
          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }} />
      ))}
      <span className="text-xs text-gray-400 font-medium ml-0.5">AI is analysing…</span>
    </div>
  )
}

// ── Star row ──────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <TiStarFullOutline key={n} size={12}
          className={n <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"} />
      ))}
      <span className="text-[11px] font-bold text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

// ── Taste tag pill ────────────────────────────────────────────────────────────
function TasteTag({ label }) {
  const icon = TASTE_ICONS[label] || "✨"
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700">
      <span>{icon}</span>{label}
    </span>
  )
}

// ── Badge chip ────────────────────────────────────────────────────────────────
function Badge({ label }) {
  const map = {
    "Most Ordered":  "bg-orange-50 text-orange-600 border-orange-200",
    "Recommended":   "bg-red-50 text-[#e23744] border-red-200",
    "Best Value":    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Best Quantity": "bg-blue-50 text-blue-600 border-blue-200",
  }
  return (
    <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full border",
      map[label] || "bg-gray-100 text-gray-500 border-gray-200")}>
      {label}
    </span>
  )
}

// ── Add-to-cart button ────────────────────────────────────────────────────────
function AddToCartBtn({ item, restaurantSlug = "dhaba-junction", size = "md", primary = false }) {
  const dispatch = useAppDispatch()
  const qty = useAppSelector(selectItemQty(item.id || item.restaurant))
  const [flashed, setFlashed] = useState(false)

  const handleAdd = (e) => {
    e?.stopPropagation()
    dispatch(addItem({
      id: item.id || item.restaurant,
      name: item.dish ? `${item.dish} – ${item.restaurant}` : item.restaurant,
      price: item.price,
      category: "Food",
      dietType: "veg",
      restaurantSlug,
    }))
    setFlashed(true)
    setTimeout(() => setFlashed(false), 1200)
  }

  const base = primary
    ? "flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-all"
    : "flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-[13px] transition-all"

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={handleAdd}
      className={clsx(
        base,
        flashed
          ? "bg-emerald-500 text-white"
          : primary
            ? "bg-[#e23744] text-white shadow-lg shadow-[#e23744]/30 hover:bg-[#cc2f3c]"
            : "bg-[#e23744]/10 text-[#e23744] border border-[#e23744]/20 hover:bg-[#e23744] hover:text-white"
      )}
    >
      <AnimatePresence mode="wait">
        {flashed ? (
          <motion.span key="done" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5">
            <LuCheck size={15} strokeWidth={2.5} />
            {primary ? "Added to Cart!" : "Added"}
          </motion.span>
        ) : (
          <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-1.5">
            <LuShoppingCart size={size === "md" ? 14 : 16} />
            {primary ? "Add to Cart" : "Add"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ── AI Verdict card (top) ─────────────────────────────────────────────────────
function AIVerdict({ winner, query }) {
  const reasons = [
    winner.tags.includes("Most Ordered") && "Most ordered by locals",
    winner.tasteScore >= 4.3             && "Exceptional taste score",
    winner.rating >= 4.3                 && "Highly rated by customers",
    winner.tags.includes("Best Value")   && "Best price-to-quality ratio",
    winner.pros[0],
  ].filter(Boolean).slice(0, 3)

  const summaryFull = `Best balance of taste, price, and popularity for ${query}.`
  const summary = useTypingText(summaryFull, 25)
  const typing  = summary.length < summaryFull.length

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-2xl border border-[#e23744]/20 overflow-hidden shadow-xl shadow-[#e23744]/10"
    >
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-[#e23744] to-[#ff6b6b] px-4 py-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <LuTrophy size={14} color="white" />
        </div>
        <div>
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">🏆 AI Verdict</p>
          <p className="font-black text-[17px] text-white leading-tight">{winner.restaurant}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-black text-white">₹{winner.price}</p>
          <p className="text-[11px] text-white/70">{winner.quantity}</p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-gradient-to-b from-[#fff5f5] to-white px-4 py-4 space-y-3.5">
        {/* Food image */}
        <div className="rounded-xl overflow-hidden" style={{ height: 160 }}>
          <img src={winner.image} alt={winner.restaurant}
            className="w-full h-full object-cover" />
        </div>

        {/* AI typing summary */}
        <div className="bg-white rounded-xl px-3.5 py-2.5 border border-[#e23744]/10 min-h-[44px]">
          <p className="text-sm text-gray-700 leading-relaxed">
            {summary}
            {typing && <span className="inline-block w-0.5 h-3.5 bg-[#e23744] ml-0.5 animate-pulse align-middle" />}
          </p>
        </div>

        {/* Taste tags */}
        <div className="flex flex-wrap gap-1.5">
          {winner.tasteTags.map(t => <TasteTag key={t} label={t} />)}
        </div>

        {/* Reasons */}
        <ul className="space-y-1.5">
          {reasons.map((r, i) => (
            <motion.li key={r}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2 text-xs text-gray-600 font-medium">
              <span className="w-4 h-4 rounded-full bg-[#e23744]/12 text-[#e23744] flex items-center justify-center text-[9px] font-black shrink-0">✓</span>
              {r}
            </motion.li>
          ))}
        </ul>

        <Stars rating={winner.rating} />

        {/* Primary CTA */}
        <AddToCartBtn item={winner} primary size="lg" />
      </div>
    </motion.div>
  )
}

// ── Expandable insights ───────────────────────────────────────────────────────
function InsightsAccordion({ insights, cons }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
          <LuSparkles size={12} className="text-[#e23744]" />
          AI Taste Insights
        </span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <LuPlus size={14} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <ul className="px-4 pb-3.5 pt-1 space-y-2 bg-gray-50/60">
              {insights.map((ins, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                  <span className="text-[#e23744] font-bold mt-0.5 shrink-0">›</span>
                  {ins}
                </motion.li>
              ))}
              {cons?.length > 0 && (
                <li className="flex items-start gap-2 text-xs text-gray-400 pt-1.5 border-t border-gray-200">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  {cons[0]}
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Restaurant comparison card ────────────────────────────────────────────────
function RestaurantCard({ item, isWinner, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.15, duration: 0.38, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      className={clsx(
        "rounded-2xl border overflow-hidden bg-white transition-shadow",
        isWinner ? "border-[#e23744]/25 shadow-md shadow-[#e23744]/8" : "border-gray-200 shadow-sm"
      )}
    >
      {/* Food image */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <img src={item.image} alt={item.restaurant}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        {isWinner && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[#e23744] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            <LuTrophy size={9} /> TOP PICK
          </div>
        )}
        {/* Price overlay */}
        <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
          <p className="font-black text-[15px] text-gray-900 leading-none">₹{item.price}</p>
          <p className="text-[10px] text-gray-400 leading-tight">{item.quantity}</p>
        </div>
      </div>

      {/* Info block */}
      <div className="px-4 pt-3 pb-1">
        {/* Name + tags */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-[15px] text-gray-900 leading-tight">{item.restaurant}</h3>
          <div className="flex flex-wrap gap-1 shrink-0 mt-0.5">
            {item.tags.slice(0, 2).map(t => <Badge key={t} label={t} />)}
          </div>
        </div>

        {/* Stars + pros */}
        <div className="flex items-center justify-between mb-2.5">
          <Stars rating={item.rating} />
          {item.pros.length > 0 && (
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold">
              ✓ {item.pros[0]}
            </span>
          )}
        </div>

        {/* Taste tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tasteTags.map(t => <TasteTag key={t} label={t} />)}
        </div>

        {/* Add button */}
        <div className="pb-3">
          <AddToCartBtn item={item} />
        </div>
      </div>

      {/* Expandable insights */}
      <InsightsAccordion insights={item.insights} cons={item.cons} />
    </motion.div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden animate-pulse">
      <div className="bg-gray-200" style={{ height: 160 }} />
      <div className="px-4 py-3 space-y-2.5">
        <div className="h-4 w-2/3 bg-gray-200 rounded-full" />
        <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-14 bg-gray-100 rounded-full" />
        </div>
        <div className="h-9 bg-gray-100 rounded-xl" />
      </div>
    </div>
  )
}

// ── Verdict skeleton ──────────────────────────────────────────────────────────
function VerdictSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-16 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-40 bg-gray-100 rounded-xl" />
        <div className="h-10 bg-gray-100 rounded-xl" />
        <div className="flex gap-1.5">
          <div className="h-6 w-14 bg-gray-100 rounded-full" />
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>
        <div className="h-12 bg-gray-100 rounded-2xl" />
      </div>
    </div>
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
    }, 1500)
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
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-4 pt-5 pb-4 space-y-3.5">

        {/* Title row */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e23744] to-[#ff6b6b] flex items-center justify-center shadow-sm shadow-[#e23744]/30">
            <LuSparkles size={14} color="white" />
          </div>
          <div>
            <h1 className="font-black text-[18px] text-gray-900 leading-none">AI Recommended</h1>
            <p className="text-[10px] text-gray-400 mt-0.5">Smart picks, just for you</p>
          </div>
        </div>

        {/* Search input */}
        <form onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-gray-100 rounded-xl px-3.5 py-2.5">
          <LuSparkles size={15} className="text-[#e23744] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="What are you feeling today?"
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          <motion.button type="submit" whileTap={{ scale: 0.87 }} disabled={!input.trim()}
            className="w-8 h-8 rounded-lg bg-[#e23744] flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity shadow-sm shadow-[#e23744]/30">
            <LuArrowRight size={15} color="white" strokeWidth={2.5} />
          </motion.button>
        </form>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(tab => (
            <motion.button key={tab.key} whileTap={{ scale: 0.92 }}
              onClick={() => handleTabClick(tab)}
              className={clsx(
                "shrink-0 flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all",
                activeTab === tab.key
                  ? "bg-[#e23744] text-white border-[#e23744] shadow-sm shadow-[#e23744]/30"
                  : "bg-white text-gray-600 border-gray-200"
              )}>
              <span>{tab.icon}</span>{tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="px-4 pt-5 pb-28 space-y-4">

        {/* Initial empty state */}
        {!thinking && !results && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-14 space-y-4">
            <motion.div className="text-5xl select-none"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}>
              🤖
            </motion.div>
            <div>
              <p className="font-bold text-gray-800 text-[15px]">Ask me what to order</p>
              <p className="text-sm text-gray-400 mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                Type a dish or pick a category — I'll compare every restaurant and give you one clear answer.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {["idli", "paneer", "biryani", "dosa", "burger", "noodles", "pizza"].map(s => (
                <button key={s}
                  onClick={() => { setInput(s); triggerSearch(s) }}
                  className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#e23744] hover:text-[#e23744] font-medium transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Thinking skeleton */}
        <AnimatePresence>
          {thinking && (
            <motion.div key="thinking"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-4">
              <ThinkingDots />
              <VerdictSkeleton />
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">All Options</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <Skeleton />
              <Skeleton />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {!thinking && results && (
            <motion.div key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-4">

              {results.results.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-14 space-y-3">
                  <p className="text-4xl">🤔</p>
                  <p className="font-bold text-gray-700">No results for "{currentQuery}"</p>
                  <p className="text-sm text-gray-400">Try: idli · paneer · biryani · dosa · pizza</p>
                </motion.div>
              ) : (
                <>
                  {/* 1. AI Verdict at top */}
                  {winner && <AIVerdict winner={winner} query={currentQuery} />}

                  {/* Divider */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
                      All {results.results.length} Options
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* 2. Restaurant cards */}
                  {results.results.map((item, i) => (
                    <RestaurantCard
                      key={item.restaurant + i}
                      item={item}
                      isWinner={winner?.restaurant === item.restaurant && winner?.price === item.price}
                      index={i}
                    />
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
