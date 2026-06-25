"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LuArrowRight, LuSparkles, LuPlus, LuMinus, LuTrophy,
  LuShoppingCart, LuCheck, LuX, LuChevronDown,
} from "react-icons/lu"
import { TiStarFullOutline } from "react-icons/ti"
import { CATEGORIES, TASTE_ICONS, getResults, pickWinner } from "@/lib/aiData"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addItem, removeItem, selectItemQty } from "@/lib/store/slices/cartSlice"
import {
  setRecommendedState, clearRecommended,
  selectRecommendedQuery, selectRecommendedResults,
  selectRecommendedWinner, selectRecommendedActiveTab,
} from "@/lib/store/slices/recommendedSlice"
import clsx from "clsx"

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 11 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <TiStarFullOutline key={n} size={size}
          className={n <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"} />
      ))}
      <span className="text-[11px] font-bold text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </span>
  )
}

// ── Thinking dots ─────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-center gap-2 py-1">
      {[0, 1, 2].map(i => (
        <motion.span key={i} className="w-2 h-2 rounded-full bg-[#e23744]"
          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }} />
      ))}
      <span className="text-xs text-gray-400 font-medium ml-0.5">AI is analysing…</span>
    </div>
  )
}

// ── Cart control ──────────────────────────────────────────────────────────────
function CartControl({ item, restaurantSlug, restaurantName }) {
  const dispatch = useAppDispatch()
  const qty      = useAppSelector(selectItemQty(restaurantSlug, item.id || item.restaurant))
  const [flashed, setFlashed] = useState(false)
  const itemId   = item.id || item.restaurant
  const itemName = item.dish || item.restaurant

  const handleAdd = (e) => {
    e?.stopPropagation()
    dispatch(addItem({
      id: itemId, name: itemName, price: item.price,
      category: "Food", dietType: "veg",
      restaurantSlug: restaurantSlug || item.slug || "dhaba-junction",
      restaurantName: restaurantName || item.restaurant,
    }))
    setFlashed(true)
    setTimeout(() => setFlashed(false), 1000)
  }
  const handleRemove = (e) => {
    e?.stopPropagation()
    dispatch(removeItem({ restaurantSlug, id: itemId }))
  }

  if (qty > 0) {
    return (
      <div className="flex items-center rounded-xl overflow-hidden border-2 border-[#e23744]"
        style={{ height: 40 }} onClick={e => e.stopPropagation()}>
        <button onClick={handleRemove}
          className="flex items-center justify-center bg-[#e23744] text-white"
          style={{ width: 40, height: "100%" }}>
          <LuMinus size={15} strokeWidth={2.5} />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <span className="font-black text-[16px] text-[#e23744] leading-none">{qty}</span>
          <span className="text-[9px] text-gray-400 font-medium">in cart</span>
        </div>
        <button onClick={handleAdd}
          className="flex items-center justify-center bg-[#e23744] text-white"
          style={{ width: 40, height: "100%" }}>
          <LuPlus size={15} strokeWidth={2.5} />
        </button>
      </div>
    )
  }

  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={handleAdd}
      className={clsx(
        "flex items-center justify-center gap-1.5 rounded-xl font-bold text-[13px] px-4 transition-all",
        flashed
          ? "bg-emerald-500 text-white"
          : "bg-[#e23744] text-white shadow-sm shadow-[#e23744]/30"
      )}
      style={{ height: 40, minWidth: 130 }}>
      <AnimatePresence mode="wait">
        {flashed ? (
          <motion.span key="done" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5">
            <LuCheck size={15} strokeWidth={2.5} /> Added!
          </motion.span>
        ) : (
          <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-1.5">
            <LuShoppingCart size={14} /> Add to Cart
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ── Expandable restaurant row ─────────────────────────────────────────────────
function RestaurantRow({ item, rank, isWinner, allItems }) {
  const router  = useRouter()
  const [open, setOpen] = useState(false)
  const slug    = item.slug || "dhaba-junction"

  const keywords = [
    ...item.tasteTags.slice(0, 2),
    item.tags[0],
  ].filter(Boolean)

  return (
    <div className={clsx(
      "rounded-2xl overflow-hidden border bg-white transition-all",
      isWinner ? "border-[#e23744]/30 shadow-md shadow-[#e23744]/8" : "border-gray-200"
    )}>
      {/* Row header — always visible */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        {/* Rank */}
        <div className={clsx(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black",
          isWinner ? "bg-[#e23744] text-white" : "bg-gray-100 text-gray-500"
        )}>
          {isWinner ? <LuTrophy size={12} /> : rank}
        </div>

        {/* Name + stars + keywords */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[14px] text-gray-900 leading-tight truncate">
              {item.restaurant}
            </span>
            {isWinner && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#e23744] text-white shrink-0">
                TOP PICK
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <Stars rating={item.rating} />
            <span className="text-[11px] text-gray-400">·</span>
            {keywords.map((k, i) => (
              <span key={i} className="text-[10px] text-gray-500 font-medium">{k}</span>
            ))}
          </div>
        </div>

        {/* Price + chevron */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="font-black text-[15px] text-gray-900 leading-none">₹{item.price}</p>
            <p className="text-[10px] text-gray-400">{item.quantity}</p>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
            <LuChevronDown size={16} className="text-gray-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-4 py-3 space-y-3 bg-gray-50/50">
              {/* Insights */}
              <ul className="space-y-1.5">
                {item.insights.slice(0, 3).map((ins, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-gray-600 leading-relaxed">
                    <span className="text-[#e23744] font-black mt-0.5 shrink-0">›</span>
                    {ins}
                  </li>
                ))}
                {item.cons?.[0] && (
                  <li className="flex items-start gap-2 text-[11px] text-gray-400 border-t border-gray-200 pt-1.5">
                    <span className="shrink-0 mt-0.5">⚠</span> {item.cons[0]}
                  </li>
                )}
              </ul>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-0.5">
                <CartControl item={item} restaurantSlug={slug} restaurantName={item.restaurant} />
                <button
                  onClick={() => router.push(`/restaurant/${slug}`)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#e23744] px-3 py-2 rounded-xl border border-[#e23744]/30 bg-white hover:bg-[#fff5f5] transition-colors"
                >
                  View Menu <LuArrowRight size={11} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Dish hero image ───────────────────────────────────────────────────────────
function DishHero({ query, imageUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden relative"
      style={{ height: 180 }}
    >
      <img
        src={imageUrl}
        alt={query}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 px-4 py-3">
        <p className="font-black text-white text-[22px] capitalize leading-tight">{query}</p>
        <p className="text-[12px] text-white/70 font-medium">Best places in Gondia</p>
      </div>
    </motion.div>
  )
}

// ── AI Verdict banner ─────────────────────────────────────────────────────────
function VerdictBanner({ winner, query }) {
  const router = useRouter()
  const slug   = winner.slug || "dhaba-junction"
  const reason = [
    winner.tags.includes("Most Ordered") && "Most ordered",
    winner.tasteScore >= 4.3             && "Top taste score",
    winner.tags.includes("Best Value")   && "Best value",
    winner.pros[0],
  ].filter(Boolean)[0] || "Best overall"

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.35 }}
      onClick={() => router.push(`/restaurant/${slug}`)}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
      style={{ background: "linear-gradient(135deg, #e23744, #ff6b6b)" }}
    >
      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        <LuTrophy size={15} color="white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">🏆 AI Verdict</p>
        <p className="font-black text-[15px] text-white leading-tight">{winner.restaurant}</p>
        <p className="text-[11px] text-white/80 font-medium">{reason} · ₹{winner.price} · {winner.quantity}</p>
      </div>
      <LuArrowRight size={16} color="white" className="shrink-0 opacity-70" />
    </motion.button>
  )
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white animate-pulse px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-2/5 bg-gray-200 rounded-full" />
          <div className="h-3 w-1/3 bg-gray-100 rounded-full" />
        </div>
        <div className="text-right space-y-1">
          <div className="h-4 w-10 bg-gray-200 rounded-full" />
          <div className="h-3 w-8 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ── Category match helper ─────────────────────────────────────────────────────
function matchCategory(query) {
  const q = query.toLowerCase().trim()
  if (!q) return null
  return CATEGORIES.find(c =>
    c.key === q ||
    c.label.toLowerCase() === q ||
    c.key.includes(q) ||
    q.includes(c.key)
  ) ?? null
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RecommendedPage() {
  const dispatch = useAppDispatch()

  const storedQuery     = useAppSelector(selectRecommendedQuery)
  const storedResults   = useAppSelector(selectRecommendedResults)
  const storedWinner    = useAppSelector(selectRecommendedWinner)
  const storedActiveTab = useAppSelector(selectRecommendedActiveTab)

  const [input,    setInput]    = useState("")
  const [thinking, setThinking] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { if (storedQuery) setInput(storedQuery) }, [])

  const triggerSearch = (query) => {
    if (!query.trim()) return
    setThinking(true)
    dispatch(setRecommendedState({ query, results: null, winner: null }))
    setTimeout(() => {
      const res    = getResults(query)
      const picked = res?.results?.length ? pickWinner(res.results) : null
      dispatch(setRecommendedState({ results: res, winner: picked }))
      setThinking(false)
    }, 900)
  }

  const handleTabClick = (tab) => {
    if (storedActiveTab === tab.key) {
      dispatch(clearRecommended()); setInput(""); setThinking(false)
    } else {
      dispatch(setRecommendedState({ activeTab: tab.key }))
      setInput(tab.label)
      triggerSearch(tab.key)
    }
  }

  const handleInputChange = (val) => {
    setInput(val)
    const matched = matchCategory(val)
    dispatch(setRecommendedState({ activeTab: matched?.key ?? null }))
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!input.trim()) return
    const matched = matchCategory(input)
    dispatch(setRecommendedState({ activeTab: matched?.key ?? null }))
    triggerSearch(input.trim())
  }

  const handleClear = () => {
    dispatch(clearRecommended()); setInput(""); setThinking(false)
    inputRef.current?.focus()
  }

  const results      = storedResults
  const winner       = storedWinner
  const activeTab    = storedActiveTab
  const currentQuery = storedQuery
  const hasContent   = thinking || results

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-4 pt-5 pb-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e23744] to-[#ff6b6b] flex items-center justify-center shadow-sm shadow-[#e23744]/30">
              <LuSparkles size={14} color="white" />
            </div>
            <div>
              <h1 className="font-black text-[18px] text-gray-900 leading-none">AI Recommended</h1>
              <p className="text-[10px] text-gray-400 mt-0.5">Smart picks, just for you</p>
            </div>
          </div>
          <AnimatePresence>
            {hasContent && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-full transition-colors"
              >
                <LuX size={11} /> Reset
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-100 rounded-xl px-3.5 py-2.5">
          <LuSparkles size={15} className="text-[#e23744] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder="What are you feeling today?"
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          {input && (
            <button type="button" onClick={handleClear} className="shrink-0 p-0.5">
              <LuX size={14} className="text-gray-400" />
            </button>
          )}
          <motion.button type="submit" whileTap={{ scale: 0.87 }} disabled={!input.trim()}
            className="w-8 h-8 rounded-lg bg-[#e23744] flex items-center justify-center shrink-0 disabled:opacity-30 shadow-sm shadow-[#e23744]/30">
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
                  ? "bg-[#e23744] text-white border-[#e23744] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200"
              )}>
              <span>{tab.icon}</span>{tab.label}
              {activeTab === tab.key && <LuX size={10} className="ml-0.5 opacity-80" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-5 pb-28 space-y-3">

        {/* Default state */}
        {!hasContent && (
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
                Type a dish or pick a category — I'll find the best spots and rank them for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {["idli", "paneer", "biryani", "dosa", "burger", "noodles", "pizza"].map(s => (
                <button key={s}
                  onClick={() => { handleInputChange(s); triggerSearch(s) }}
                  className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#e23744] hover:text-[#e23744] font-medium transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Thinking */}
        <AnimatePresence>
          {thinking && (
            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-3">
              <ThinkingDots />
              {/* Hero skeleton */}
              <div className="rounded-2xl bg-gray-200 animate-pulse" style={{ height: 180 }} />
              {/* Verdict skeleton */}
              <div className="rounded-2xl bg-gray-200 animate-pulse" style={{ height: 64 }} />
              <SkeletonRow /><SkeletonRow /><SkeletonRow />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {!thinking && results && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {results.results.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-14 space-y-3">
                  <p className="text-4xl">🤔</p>
                  <p className="font-bold text-gray-700">No results for &ldquo;{currentQuery}&rdquo;</p>
                  <p className="text-sm text-gray-400">Try: idli · paneer · biryani · dosa · pizza</p>
                  <button onClick={handleClear}
                    className="mt-2 text-sm font-semibold text-[#e23744] underline underline-offset-2">
                    Clear and try again
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Dish hero image */}
                  <DishHero
                    query={currentQuery}
                    imageUrl={winner?.image || results.results[0]?.image}
                  />

                  {/* AI verdict banner */}
                  {winner && <VerdictBanner winner={winner} query={currentQuery} />}

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {results.results.length} options compared
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Expandable rows */}
                  {results.results.map((item, i) => (
                    <motion.div key={item.restaurant + i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}>
                      <RestaurantRow
                        item={item}
                        rank={i + 1}
                        isWinner={winner?.restaurant === item.restaurant && winner?.price === item.price}
                        allItems={results.results}
                      />
                    </motion.div>
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
