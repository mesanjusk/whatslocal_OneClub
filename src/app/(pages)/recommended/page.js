"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LuArrowRight, LuSparkles, LuPlus, LuMinus,
  LuShoppingCart, LuCheck, LuX,
} from "react-icons/lu"
import { TiStarFullOutline } from "react-icons/ti"
import { CATEGORIES, getResults, pickWinner } from "@/lib/aiData"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addItem, removeItem, selectItemQty } from "@/lib/store/slices/cartSlice"
import {
  setRecommendedState, clearRecommended,
  selectRecommendedQuery, selectRecommendedResults,
  selectRecommendedWinner, selectRecommendedActiveTab,
} from "@/lib/store/slices/recommendedSlice"
import clsx from "clsx"
import CategoryMascot from "@/components/CategoryMascot"

// ── Food grid for default (no tab) state ─────────────────────────────────────
const FOOD_GRID = [
  { label: "Biryani",  query: "biryani",  image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80" },
  { label: "Paneer",   query: "paneer",   image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80" },
  { label: "Dosa",     query: "dosa",     image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80" },
  { label: "Burger",   query: "burger",   image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
  { label: "Noodles",  query: "noodles",  image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=80" },
  { label: "Pizza",    query: "pizza",    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" },
  { label: "Idli",     query: "idli",     image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80" },
  { label: "Desserts", query: "desserts", image: "https://images.unsplash.com/photo-1601303516534-3b50cba4b08a?w=600&q=80" },
]

// ── Tag colours ───────────────────────────────────────────────────────────────
const TAG_STYLES = {
  "Most Ordered":   "bg-orange-50 text-orange-600 border-orange-200",
  "Best Value":     "bg-green-50  text-green-600  border-green-200",
  "Best Quantity":  "bg-blue-50   text-blue-600   border-blue-200",
  "Recommended":    "bg-purple-50 text-purple-600 border-purple-200",
  "Top Rated":      "bg-yellow-50 text-yellow-600 border-yellow-200",
  "Great Taste":    "bg-red-50    text-red-600    border-red-200",
  "Budget Friendly":"bg-teal-50   text-teal-600   border-teal-200",
  "Popular":        "bg-pink-50   text-pink-600   border-pink-200",
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 11 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <TiStarFullOutline size={14} className="text-yellow-400" />
      <span className="text-[13px] font-bold text-gray-700 ml-0.5">{rating.toFixed(1)}</span>
    </span>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function Bar({ pct, color }) {
  return (
    <div className="h-[7px] bg-gray-100 rounded-full overflow-hidden flex-1">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
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
      <div className="inline-flex items-center rounded-xl overflow-hidden border-2 border-[#e23744]"
        style={{ height: 40 }} onClick={e => e.stopPropagation()}>
        <button onClick={handleRemove}
          className="flex items-center justify-center bg-[#e23744] text-white"
          style={{ width: 40, height: "100%" }}>
          <LuMinus size={14} strokeWidth={2.5} />
        </button>
        <div className="px-4 flex items-center justify-center bg-white">
          <span className="font-black text-[15px] text-[#e23744] leading-none">{qty}</span>
        </div>
        <button onClick={handleAdd}
          className="flex items-center justify-center bg-[#e23744] text-white"
          style={{ width: 40, height: "100%" }}>
          <LuPlus size={14} strokeWidth={2.5} />
        </button>
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAdd}
      className={clsx(
        "flex items-center gap-2 rounded-xl font-bold text-[13px] px-4 transition-all shadow-sm",
        flashed
          ? "bg-emerald-500 text-white shadow-emerald-200"
          : "bg-[#e23744] text-white shadow-[#e23744]/25"
      )}
      style={{ height: 40 }}
    >
      <AnimatePresence mode="wait">
        {flashed ? (
          <motion.span key="done" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5">
            <LuCheck size={15} strokeWidth={2.5} /> Added!
          </motion.span>
        ) : (
          <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-1.5">
            <LuShoppingCart size={15} /> Add to Cart
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ── Restaurant card (new design) ──────────────────────────────────────────────
function RestaurantCard({ item, rank, isWinner, allItems }) {
  const router  = useRouter()
  const [open, setOpen] = useState(false)
  const slug    = item.slug || "dhaba-junction"

  // Normalize progress bars within result set
  const allPrices = allItems.map(i => i.price)
  const maxPrice  = Math.max(...allPrices)
  const minPrice  = Math.min(...allPrices)
  const pricePct  = maxPrice === minPrice ? 60
    : Math.round(((maxPrice - item.price) / (maxPrice - minPrice)) * 65 + 25)

  const tastePct = Math.round((item.tasteScore / 5) * 90)

  const allQty = allItems.map(i => parseInt(i.quantity) || 1)
  const maxQty = Math.max(...allQty)
  const qtyNum = parseInt(item.quantity) || 1
  const qtyPct = Math.round((qtyNum / maxQty) * 85 + 15)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.07, duration: 0.3 }}
      className={clsx(
        "rounded-2xl overflow-hidden border bg-white",
        isWinner ? "border-[#e23744]/25 shadow-md shadow-[#e23744]/6" : "border-gray-200"
      )}
    >
      {/* ── Top row: image + info + cart ── */}
      <div className="flex items-stretch">
        {/* Image */}
        <div className="w-[88px] shrink-0 self-stretch">
          <img
            src={item.image}
            alt={item.restaurant}
            className="w-full h-full object-cover"
            style={{ minHeight: 90 }}
          />
        </div>

        {/* Name + rating + tags */}
        <div className="flex-1 min-w-0 px-3 pt-3 pb-2">
          <button
            onClick={() => router.push(`/restaurant/${slug}`)}
            className="font-bold text-[14px] text-gray-900 hover:text-[#e23744] transition-colors text-left leading-tight w-full truncate block"
          >
            {item.restaurant}
          </button>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Stars rating={item.rating} />
          </div>
          {/* Tags */}
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {item.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className={clsx(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                  TAG_STYLES[tag] || "bg-gray-50 text-gray-500 border-gray-200"
                )}
              >
                ● {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex flex-col items-end justify-between px-3 pt-3 pb-2 shrink-0">
          <div className="text-right">
            <p className="font-black text-[17px] text-gray-900 leading-none">₹{item.price}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{item.quantity}</p>
          </div>
          <CartControl item={item} restaurantSlug={slug} restaurantName={item.restaurant} />
        </div>
      </div>

      {/* ── AI Taste Insights toggle ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 border-t border-gray-100 text-left hover:bg-gray-50/80 transition-colors"
      >
        <LuSparkles size={12} className="text-[#e23744] shrink-0" />
        <span className="text-[11px] font-bold text-gray-600">AI Taste Insights</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#e23744] font-bold text-[16px] leading-none"
        >
          +
        </motion.span>
      </button>

      {/* ── Expanded: progress bars + insights ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="insights"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 bg-gray-50/40 border-t border-gray-100 space-y-3">
              {/* Progress bars */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] font-semibold text-gray-400 shrink-0 w-12">Price</span>
                  <Bar pct={pricePct} color="bg-green-400" />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] font-semibold text-gray-400 shrink-0 w-8">Taste</span>
                  <Bar pct={tastePct} color="bg-orange-400" />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] font-semibold text-gray-400 shrink-0 w-12">Quantity</span>
                  <Bar pct={qtyPct} color="bg-blue-400" />
                </div>
              </div>

              {/* Insights */}
              {item.insights.slice(0, 2).map((ins, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-gray-600 leading-relaxed">
                  <span className="text-[#e23744] font-black mt-0.5 shrink-0">›</span>
                  {ins}
                </div>
              ))}
              {item.cons?.[0] && (
                <div className="flex items-start gap-2 text-[10px] text-gray-400">
                  <span className="shrink-0 mt-0.5">⚠</span> {item.cons[0]}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden animate-pulse">
      <div className="flex items-stretch">
        <div className="w-[88px] h-[90px] bg-gray-200 shrink-0" />
        <div className="flex-1 px-3 pt-3 pb-2 space-y-2">
          <div className="h-4 w-2/3 bg-gray-200 rounded-full" />
          <div className="h-3 w-1/3 bg-gray-100 rounded-full" />
          <div className="flex gap-1.5">
            <div className="h-4 w-20 bg-gray-100 rounded-full" />
            <div className="h-4 w-16 bg-gray-100 rounded-full" />
          </div>
        </div>
        <div className="px-3 pt-3 pb-2 flex flex-col items-end gap-3">
          <div className="h-5 w-12 bg-gray-200 rounded-full" />
          <div className="h-10 w-24 bg-gray-200 rounded-xl" />
        </div>
      </div>
      <div className="px-4 py-2.5 border-t border-gray-100">
        <div className="h-3 w-32 bg-gray-100 rounded-full" />
      </div>
    </div>
  )
}

// ── Category match helper ─────────────────────────────────────────────────────
function matchCategory(query) {
  const q = query.toLowerCase().trim()
  if (!q) return null
  return CATEGORIES.find(c =>
    c.key === q || c.label.toLowerCase() === q || c.key.includes(q) || q.includes(c.key)
  ) ?? null
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RecommendedPage() {
  const dispatch = useAppDispatch()

  const storedQuery     = useAppSelector(selectRecommendedQuery)
  const storedResults   = useAppSelector(selectRecommendedResults)
  const storedWinner    = useAppSelector(selectRecommendedWinner)
  const storedActiveTab = useAppSelector(selectRecommendedActiveTab)

  const [input,      setInput]      = useState("")
  const [thinking,   setThinking]   = useState(false)
  const [mascotMode, setMascotMode] = useState(false)
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
      dispatch(clearRecommended()); setInput(""); setThinking(false); setMascotMode(false)
    } else if (tab.key === "south indian") {
      dispatch(setRecommendedState({ activeTab: tab.key, results: null, winner: null, query: "" }))
      setInput(tab.label); setMascotMode(true); setThinking(false)
    } else {
      setMascotMode(false)
      dispatch(setRecommendedState({ activeTab: tab.key }))
      setInput(tab.label)
      triggerSearch(tab.key)
    }
  }

  const handleInputChange = (val) => {
    setInput(val)
    const matched = matchCategory(val)
    dispatch(setRecommendedState({ activeTab: matched?.key ?? null }))
    if (matched?.key !== "south indian") setMascotMode(false)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!input.trim()) return
    const matched = matchCategory(input)
    dispatch(setRecommendedState({ activeTab: matched?.key ?? null }))
    if (matched?.key === "south indian") {
      setMascotMode(true)
    } else {
      setMascotMode(false)
      triggerSearch(input.trim())
    }
  }

  const handleClear = () => {
    dispatch(clearRecommended()); setInput(""); setThinking(false); setMascotMode(false)
    inputRef.current?.focus()
  }

  const results      = storedResults
  const winner       = storedWinner
  const activeTab    = storedActiveTab
  const currentQuery = storedQuery
  const hasContent   = thinking || results || mascotMode

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
      <div className="px-4 pt-5 pb-28 space-y-4">

        {/* Default state: food grid */}
        {!hasContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            className="space-y-3">
            <div className="space-y-0.5">
              <p className="font-bold text-gray-800 text-[15px]">What are you feeling today?</p>
              <p className="text-[12px] text-gray-400">Tell us what you&apos;re craving, we&apos;ll recommend the best for you!</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FOOD_GRID.map((item, i) => (
                <motion.button
                  key={item.query}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.28 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { handleInputChange(item.query); triggerSearch(item.query) }}
                  className="relative rounded-2xl overflow-hidden text-left"
                  style={{ height: 140 }}
                >
                  <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 px-3 py-2.5">
                    <p className="font-black text-white text-[15px] leading-tight capitalize">{item.label}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* South Indian mascot — stays visible while South Indian tab is active */}
        <AnimatePresence>
          {mascotMode && (
            <motion.div key="mascot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CategoryMascot
                categoryKey={activeTab}
                onSelectFood={(key) => {
                  setInput(key)
                  triggerSearch(key)
                  // mascotMode stays true — results appear below the character
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thinking skeletons */}
        <AnimatePresence>
          {thinking && (
            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-3">
              <ThinkingDots />
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
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
                  {/* Section header */}
                  <div className="flex items-center gap-2">
                    <LuSparkles size={14} className="text-yellow-400" />
                    <div>
                      <p className="font-black text-[15px] text-gray-900">AI Recommended for You</p>
                      <p className="text-[11px] text-gray-400">Based on taste, ratings &amp; popularity</p>
                    </div>
                  </div>

                  {/* Cards */}
                  {results.results.map((item, i) => (
                    <RestaurantCard
                      key={item.restaurant + i}
                      item={item}
                      rank={i + 1}
                      isWinner={winner?.restaurant === item.restaurant && winner?.price === item.price}
                      allItems={results.results}
                    />
                  ))}

                  {/* Loading more indicator */}
                  <div className="flex items-center justify-center gap-2 py-3 text-[12px] text-gray-400 font-medium">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="w-3.5 h-3.5 border-2 border-gray-200 border-t-[#e23744] rounded-full"
                    />
                    Loading more…
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
