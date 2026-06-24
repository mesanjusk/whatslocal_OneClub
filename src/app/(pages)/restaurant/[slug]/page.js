"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { LuArrowLeft, LuSearch, LuShoppingCart, LuMinus, LuPlus, LuX } from "react-icons/lu"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  addItem, removeItem,
  selectCartItems, selectCartTotal, selectCartCount, selectItemQty,
} from "@/lib/store/slices/cartSlice"

// ── Veg/Non-veg dot indicator (Zomato style) ─────────────────────────────────
function DietDot({ type }) {
  const color = type === "veg" ? "#0f9b58" : "#e43b4f"
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 16, height: 16, border: `1.5px solid ${color}`, borderRadius: 3, flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
    </span>
  )
}

// ── Add / Qty button ──────────────────────────────────────────────────────────
function AddButton({ item, slug }) {
  const dispatch = useAppDispatch()
  const qty = useAppSelector(selectItemQty(item._id))

  if (qty === 0) return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={() => dispatch(addItem({ id: item._id, name: item.name, price: item.price,
        category: item.category, dietType: item.dietType, restaurantSlug: slug }))}
      style={{ background: "#fff", border: "1.5px solid #e23744", borderRadius: 8,
        color: "#e23744", fontWeight: 700, fontSize: 13, padding: "6px 22px",
        letterSpacing: "0.05em", cursor: "pointer" }}
    >
      ADD
    </motion.button>
  )

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, background: "#e23744",
      borderRadius: 8, overflow: "hidden" }}>
      <button onClick={() => dispatch(removeItem(item._id))}
        style={{ background: "none", border: "none", color: "#fff", padding: "6px 10px",
          cursor: "pointer", display: "flex", alignItems: "center" }}>
        <LuMinus size={13} strokeWidth={3} />
      </button>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, minWidth: 16,
        textAlign: "center" }}>{qty}</span>
      <button onClick={() => dispatch(addItem({ id: item._id, name: item.name,
        price: item.price, category: item.category, dietType: item.dietType, restaurantSlug: slug }))}
        style={{ background: "none", border: "none", color: "#fff", padding: "6px 10px",
          cursor: "pointer", display: "flex", alignItems: "center" }}>
        <LuPlus size={13} strokeWidth={3} />
      </button>
    </div>
  )
}

// ── Single menu item row ──────────────────────────────────────────────────────
function MenuItem({ item, slug }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "16px 0", borderBottom: "1px solid #f3f3f3", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          {item.dietType && <DietDot type={item.dietType} />}
          <span style={{ fontWeight: 600, fontSize: 14, color: "#1c1c1c", lineHeight: 1.3 }}>
            {item.name}
          </span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#3d3d3d" }}>₹{item.price}</span>
        {item.description && (
          <p style={{ fontSize: 12, color: "#93959f", marginTop: 4, lineHeight: 1.5 }}>
            {item.description}
          </p>
        )}
      </div>
      <div style={{ flexShrink: 0, marginTop: 4 }}>
        <AddButton item={item} slug={slug} />
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RestaurantPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("")
  const [search, setSearch] = useState("")
  const categoryRefs = useRef({})
  const cartItems = useAppSelector(selectCartItems)
  const cartTotal = useAppSelector(selectCartTotal)
  const cartCount = useAppSelector(selectCartCount)

  // Group menu by category
  const grouped = menu.reduce((acc, item) => {
    const cat = item.category || "Other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const categories = Object.keys(grouped)

  // Filter by search
  const filtered = search.trim()
    ? Object.fromEntries(
        Object.entries(grouped)
          .map(([cat, items]) => [cat, items.filter(i =>
            i.name.toLowerCase().includes(search.toLowerCase()))])
          .filter(([, items]) => items.length > 0)
      )
    : grouped

  useEffect(() => {
    axios.get(`/api/menu/${slug}`)
      .then(r => { setMenu(r.data); setActiveCategory(r.data[0]?.category || "") })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const scrollToCategory = (cat) => {
    setActiveCategory(cat)
    categoryRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveCategory(e.target.dataset.category) })
    }, { rootMargin: "-40% 0px -55% 0px" })
    Object.entries(categoryRefs.current).forEach(([, el]) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [categories.length])

  const PHOTOS = [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  ]

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 100 }}>

      {/* Header photos */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <div style={{ display: "flex", height: "100%", gap: 2 }}>
          <img src={PHOTOS[0]} alt="" style={{ flex: 2, objectFit: "cover", height: "100%" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <img src={PHOTOS[1]} alt="" style={{ flex: 1, objectFit: "cover", width: "100%" }} />
            <img src={PHOTOS[2]} alt="" style={{ flex: 1, objectFit: "cover", width: "100%" }} />
          </div>
        </div>
        {/* Back button */}
        <button onClick={() => router.back()}
          style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.95)",
            border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          <LuArrowLeft size={18} />
        </button>
      </div>

      {/* Restaurant info */}
      <div style={{ padding: "16px 16px 0" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1c1c1c", margin: 0 }}>
          Dhaba Junction
        </h1>
        <p style={{ fontSize: 13, color: "#686b78", margin: "4px 0 2px" }}>
          Punjabi, North Indian · Pure Veg
        </p>
        <p style={{ fontSize: 13, color: "#686b78", margin: 0 }}>
          Gondia, Maharashtra
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10,
          paddingBottom: 16, borderBottom: "1px solid #f3f3f3" }}>
          <span style={{ background: "#48c479", color: "#fff", fontWeight: 700, fontSize: 12,
            borderRadius: 4, padding: "2px 7px" }}>★ Pure Veg</span>
          <span style={{ fontSize: 12, color: "#93959f" }}>₹15 – ₹295 per item</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8f8f8",
          borderRadius: 10, padding: "10px 14px" }}>
          <LuSearch size={16} style={{ color: "#93959f", flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search within menu"
            style={{ flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 14, color: "#1c1c1c" }} />
          {search && <LuX size={14} style={{ cursor: "pointer", color: "#93959f" }}
            onClick={() => setSearch("")} />}
        </div>
      </div>

      {/* Category pills (sticky) */}
      {!search && (
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff",
          borderBottom: "1px solid #f3f3f3", overflowX: "auto", display: "flex",
          gap: 0, padding: "0 8px" }}
          className="no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => scrollToCategory(cat)}
              style={{ flexShrink: 0, padding: "12px 14px", border: "none", background: "none",
                fontSize: 13, fontWeight: activeCategory === cat ? 700 : 500,
                color: activeCategory === cat ? "#e23744" : "#686b78", cursor: "pointer",
                borderBottom: activeCategory === cat ? "2px solid #e23744" : "2px solid transparent",
                transition: "all 0.2s" }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Menu sections */}
      <div style={{ padding: "0 16px" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#93959f" }}>Loading menu…</div>
        ) : Object.entries(filtered).map(([cat, items]) => (
          <div key={cat} ref={el => { categoryRefs.current[cat] = el }}
            data-category={cat} style={{ paddingTop: 8 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1c1c1c",
              margin: "16px 0 0", paddingBottom: 4 }}>
              {cat} <span style={{ fontSize: 13, color: "#93959f", fontWeight: 400 }}>
                ({items.length})
              </span>
            </h2>
            {items.map(item => <MenuItem key={item._id} item={item} slug={slug} />)}
          </div>
        ))}
      </div>

      {/* Floating cart bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            onClick={() => router.push("/cart")}
            style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
              width: "calc(100% - 32px)", maxWidth: 468, background: "#e23744", borderRadius: 14,
              padding: "14px 20px", display: "flex", alignItems: "center",
              justifyContent: "space-between", cursor: "pointer",
              boxShadow: "0 8px 24px rgba(226,55,68,0.4)", zIndex: 998 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 6,
                padding: "2px 8px", color: "#fff", fontWeight: 700, fontSize: 14 }}>
                {cartCount}
              </span>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                {cartCount} item{cartCount !== 1 ? "s" : ""} added
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
                ₹{cartTotal}
              </span>
              <LuShoppingCart size={18} color="#fff" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
