"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LuArrowLeft, LuSearch, LuShoppingCart, LuMinus, LuPlus, LuX } from "react-icons/lu"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  addItem, removeItem,
  selectCartTotal, selectCartCount, selectItemQty,
} from "@/lib/store/slices/cartSlice"

// ── Full Dhaba Junction menu ──────────────────────────────────────────────────
const MENU = [
  // Soups
  { _id: "s1",  category: "Soups",           dietType: "veg",     name: "Tomato Soup",               price: 60 },
  { _id: "s2",  category: "Soups",           dietType: "veg",     name: "Sweet Corn Soup",           price: 70 },
  { _id: "s3",  category: "Soups",           dietType: "veg",     name: "Hot & Sour Soup",           price: 70 },
  { _id: "s4",  category: "Soups",           dietType: "veg",     name: "Manchow Soup",              price: 75 },
  // Starters
  { _id: "st1", category: "Starters",        dietType: "veg",     name: "Paneer Tikka",              price: 160, description: "Marinated paneer grilled in tandoor" },
  { _id: "st2", category: "Starters",        dietType: "veg",     name: "Hara Bhara Kabab",          price: 120 },
  { _id: "st3", category: "Starters",        dietType: "veg",     name: "Veg Seekh Kabab",           price: 130 },
  { _id: "st4", category: "Starters",        dietType: "veg",     name: "Mushroom Tikka",            price: 150 },
  { _id: "st5", category: "Starters",        dietType: "veg",     name: "Paneer Malai Tikka",        price: 170 },
  { _id: "st6", category: "Starters",        dietType: "veg",     name: "Aloo Tikki",                price: 80 },
  { _id: "st7", category: "Starters",        dietType: "non-veg", name: "Chicken Tikka",             price: 180, description: "Tandoor-grilled chicken pieces" },
  { _id: "st8", category: "Starters",        dietType: "non-veg", name: "Chicken Seekh Kabab",       price: 190 },
  { _id: "st9", category: "Starters",        dietType: "non-veg", name: "Tangdi Kabab",              price: 220 },
  // Paneer
  { _id: "p1",  category: "Paneer Dishes",   dietType: "veg",     name: "Paneer Butter Masala",      price: 180, description: "Rich tomato-butter gravy with soft paneer" },
  { _id: "p2",  category: "Paneer Dishes",   dietType: "veg",     name: "Kadai Paneer",              price: 175, description: "Paneer with capsicum in kadai masala" },
  { _id: "p3",  category: "Paneer Dishes",   dietType: "veg",     name: "Shahi Paneer",              price: 185 },
  { _id: "p4",  category: "Paneer Dishes",   dietType: "veg",     name: "Matar Paneer",              price: 160 },
  { _id: "p5",  category: "Paneer Dishes",   dietType: "veg",     name: "Palak Paneer",              price: 170 },
  { _id: "p6",  category: "Paneer Dishes",   dietType: "veg",     name: "Paneer Do Pyaza",           price: 175 },
  { _id: "p7",  category: "Paneer Dishes",   dietType: "veg",     name: "Paneer Lababdar",           price: 185 },
  // Dal
  { _id: "d1",  category: "Dal",             dietType: "veg",     name: "Dal Makhani",               price: 150, description: "Slow-cooked black lentils in buttery gravy" },
  { _id: "d2",  category: "Dal",             dietType: "veg",     name: "Dal Tadka",                 price: 130 },
  { _id: "d3",  category: "Dal",             dietType: "veg",     name: "Dal Fry",                   price: 120 },
  { _id: "d4",  category: "Dal",             dietType: "veg",     name: "Dal Dhaba Style",           price: 140 },
  // Veg Curries
  { _id: "v1",  category: "Veg Curries",     dietType: "veg",     name: "Mix Veg",                   price: 150 },
  { _id: "v2",  category: "Veg Curries",     dietType: "veg",     name: "Aloo Gobi",                 price: 130 },
  { _id: "v3",  category: "Veg Curries",     dietType: "veg",     name: "Aloo Matar",                price: 130 },
  { _id: "v4",  category: "Veg Curries",     dietType: "veg",     name: "Baingan Bharta",            price: 140 },
  { _id: "v5",  category: "Veg Curries",     dietType: "veg",     name: "Chana Masala",              price: 140 },
  { _id: "v6",  category: "Veg Curries",     dietType: "veg",     name: "Rajma Masala",              price: 145 },
  { _id: "v7",  category: "Veg Curries",     dietType: "veg",     name: "Veg Kofta",                 price: 160 },
  { _id: "v8",  category: "Veg Curries",     dietType: "veg",     name: "Mushroom Masala",           price: 165 },
  // Chicken
  { _id: "c1",  category: "Chicken",         dietType: "non-veg", name: "Butter Chicken",            price: 220, description: "Creamy tomato-based chicken curry" },
  { _id: "c2",  category: "Chicken",         dietType: "non-veg", name: "Chicken Curry",             price: 200 },
  { _id: "c3",  category: "Chicken",         dietType: "non-veg", name: "Kadai Chicken",             price: 215 },
  { _id: "c4",  category: "Chicken",         dietType: "non-veg", name: "Chicken Do Pyaza",          price: 210 },
  { _id: "c5",  category: "Chicken",         dietType: "non-veg", name: "Chicken Masala",            price: 210 },
  { _id: "c6",  category: "Chicken",         dietType: "non-veg", name: "Dhaba Chicken",             price: 225, description: "Rustic dhaba-style spicy chicken" },
  // Mutton
  { _id: "m1",  category: "Mutton",          dietType: "non-veg", name: "Mutton Curry",              price: 280 },
  { _id: "m2",  category: "Mutton",          dietType: "non-veg", name: "Mutton Rogan Josh",         price: 295, description: "Slow-cooked Kashmiri mutton" },
  { _id: "m3",  category: "Mutton",          dietType: "non-veg", name: "Mutton Kadai",              price: 285 },
  { _id: "m4",  category: "Mutton",          dietType: "non-veg", name: "Mutton Do Pyaza",           price: 285 },
  // Breads
  { _id: "b1",  category: "Breads",          dietType: "veg",     name: "Tandoori Roti",             price: 15 },
  { _id: "b2",  category: "Breads",          dietType: "veg",     name: "Butter Roti",               price: 20 },
  { _id: "b3",  category: "Breads",          dietType: "veg",     name: "Plain Naan",                price: 30 },
  { _id: "b4",  category: "Breads",          dietType: "veg",     name: "Butter Naan",               price: 35 },
  { _id: "b5",  category: "Breads",          dietType: "veg",     name: "Garlic Naan",               price: 40 },
  { _id: "b6",  category: "Breads",          dietType: "veg",     name: "Stuffed Paratha",           price: 60, description: "Aloo, Gobhi or Paneer" },
  { _id: "b7",  category: "Breads",          dietType: "veg",     name: "Lachha Paratha",            price: 45 },
  { _id: "b8",  category: "Breads",          dietType: "veg",     name: "Puri (4 pcs)",              price: 40 },
  // Rice & Biryani
  { _id: "r1",  category: "Rice & Biryani",  dietType: "veg",     name: "Steamed Rice",              price: 60 },
  { _id: "r2",  category: "Rice & Biryani",  dietType: "veg",     name: "Jeera Rice",                price: 80 },
  { _id: "r3",  category: "Rice & Biryani",  dietType: "veg",     name: "Veg Biryani",               price: 150, description: "Fragrant basmati with mixed vegetables" },
  { _id: "r4",  category: "Rice & Biryani",  dietType: "veg",     name: "Veg Pulao",                 price: 120 },
  { _id: "r5",  category: "Rice & Biryani",  dietType: "non-veg", name: "Chicken Biryani",           price: 220, description: "Dum-cooked chicken biryani" },
  { _id: "r6",  category: "Rice & Biryani",  dietType: "non-veg", name: "Mutton Biryani",            price: 280 },
  // Chinese
  { _id: "ch1", category: "Chinese",         dietType: "veg",     name: "Veg Fried Rice",            price: 120 },
  { _id: "ch2", category: "Chinese",         dietType: "veg",     name: "Veg Hakka Noodles",         price: 120 },
  { _id: "ch3", category: "Chinese",         dietType: "veg",     name: "Paneer Chilli (Dry)",       price: 160 },
  { _id: "ch4", category: "Chinese",         dietType: "veg",     name: "Gobi Manchurian (Dry)",     price: 140 },
  { _id: "ch5", category: "Chinese",         dietType: "veg",     name: "Gobi Manchurian (Gravy)",   price: 145 },
  { _id: "ch6", category: "Chinese",         dietType: "non-veg", name: "Chicken Fried Rice",        price: 160 },
  { _id: "ch7", category: "Chinese",         dietType: "non-veg", name: "Chicken Chilli (Dry)",      price: 180 },
  { _id: "ch8", category: "Chinese",         dietType: "non-veg", name: "Chicken Hakka Noodles",     price: 160 },
  // Thali
  { _id: "th1", category: "Thali",           dietType: "veg",     name: "Veg Thali (Small)",         price: 120, description: "Dal, sabzi, roti, rice, salad" },
  { _id: "th2", category: "Thali",           dietType: "veg",     name: "Veg Thali (Full)",          price: 180, description: "Dal, 2 sabzi, paneer, roti, rice, salad, sweet" },
  { _id: "th3", category: "Thali",           dietType: "veg",     name: "Dhaba Special Thali",       price: 220, description: "Chef's special full thali" },
  { _id: "th4", category: "Thali",           dietType: "non-veg", name: "Non-Veg Thali",             price: 260, description: "Chicken curry, dal, roti, rice, salad" },
  // Raita & Salad
  { _id: "ra1", category: "Raita & Salad",   dietType: "veg",     name: "Plain Raita",               price: 40 },
  { _id: "ra2", category: "Raita & Salad",   dietType: "veg",     name: "Boondi Raita",              price: 50 },
  { _id: "ra3", category: "Raita & Salad",   dietType: "veg",     name: "Green Salad",               price: 50 },
  { _id: "ra4", category: "Raita & Salad",   dietType: "veg",     name: "Onion Salad",               price: 30 },
  // Desserts
  { _id: "de1", category: "Desserts",        dietType: "veg",     name: "Gulab Jamun (2 pcs)",       price: 60 },
  { _id: "de2", category: "Desserts",        dietType: "veg",     name: "Rasgulla (2 pcs)",          price: 60 },
  { _id: "de3", category: "Desserts",        dietType: "veg",     name: "Kheer",                     price: 70 },
  { _id: "de4", category: "Desserts",        dietType: "veg",     name: "Ice Cream",                 price: 80, description: "Vanilla / Chocolate / Strawberry" },
  // Beverages
  { _id: "bv1", category: "Beverages",       dietType: "veg",     name: "Lassi (Sweet)",             price: 60 },
  { _id: "bv2", category: "Beverages",       dietType: "veg",     name: "Lassi (Salted)",            price: 60 },
  { _id: "bv3", category: "Beverages",       dietType: "veg",     name: "Mango Lassi",               price: 70 },
  { _id: "bv4", category: "Beverages",       dietType: "veg",     name: "Chaas",                     price: 40 },
  { _id: "bv5", category: "Beverages",       dietType: "veg",     name: "Cold Drink (Bottle)",       price: 40 },
  { _id: "bv6", category: "Beverages",       dietType: "veg",     name: "Water Bottle",              price: 20 },
]

// ── Restaurant photos ─────────────────────────────────────────────────────────
const PHOTOS = [
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=85",
  "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400&q=80",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function DietDot({ type }) {
  const color = type === "veg" ? "#0f9b58" : "#e43b4f"
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 16, height: 16, border: `1.5px solid ${color}`, borderRadius: 3, flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
    </span>
  )
}

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
        letterSpacing: "0.05em", cursor: "pointer", whiteSpace: "nowrap" }}
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
      <button onClick={() => dispatch(addItem({ id: item._id, name: item.name, price: item.price,
        category: item.category, dietType: item.dietType, restaurantSlug: slug }))}
        style={{ background: "none", border: "none", color: "#fff", padding: "6px 10px",
          cursor: "pointer", display: "flex", alignItems: "center" }}>
        <LuPlus size={13} strokeWidth={3} />
      </button>
    </div>
  )
}

function MenuItem({ item, slug }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "14px 0", borderBottom: "1px solid #f3f3f3", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          {item.dietType && <DietDot type={item.dietType} />}
          <span style={{ fontWeight: 600, fontSize: 14, color: "#1c1c1c", lineHeight: 1.3 }}>
            {item.name}
          </span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#3d3d3d" }}>₹{item.price}</span>
        {item.description && (
          <p style={{ fontSize: 12, color: "#93959f", marginTop: 3, lineHeight: 1.5 }}>
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
  const router = useRouter()
  const slug = "dhaba-junction"
  const [activeCategory, setActiveCategory] = useState("")
  const [search, setSearch] = useState("")
  const categoryRefs = useRef({})
  const cartTotal = useAppSelector(selectCartTotal)
  const cartCount = useAppSelector(selectCartCount)

  const grouped = MENU.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})
  const categories = Object.keys(grouped)

  const filtered = search.trim()
    ? Object.fromEntries(
        Object.entries(grouped)
          .map(([cat, items]) => [cat, items.filter(i =>
            i.name.toLowerCase().includes(search.toLowerCase()))])
          .filter(([, items]) => items.length > 0)
      )
    : grouped

  useEffect(() => { setActiveCategory(categories[0] || "") }, [])

  const scrollToCategory = (cat) => {
    setActiveCategory(cat)
    categoryRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveCategory(e.target.dataset.category) })
    }, { rootMargin: "-30% 0px -60% 0px" })
    Object.values(categoryRefs.current).forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 120 }}>

      {/* 4-photo header grid */}
      <div style={{ position: "relative", height: 240, overflow: "hidden",
        display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2 }}>
        <img src={PHOTOS[0]} alt="Kadai Paneer"
          style={{ gridColumn: 1, gridRow: "1 / 3", objectFit: "cover", width: "100%", height: "100%" }} />
        <img src={PHOTOS[1]} alt="Dal Makhani"
          style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        <img src={PHOTOS[2]} alt="Roti"
          style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        <button onClick={() => router.back()}
          style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.95)",
            border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 10 }}>
          <LuArrowLeft size={18} />
        </button>
        <span style={{ position: "absolute", bottom: 12, right: 12,
          background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 20,
          fontSize: 11, fontWeight: 600, padding: "5px 12px", zIndex: 10 }}>
          See all photos
        </span>
      </div>

      {/* Restaurant info */}
      <div style={{ padding: "16px 16px 0" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1c1c1c", margin: 0 }}>
          Dhaba Junction
        </h1>
        <p style={{ fontSize: 13, color: "#686b78", margin: "4px 0 2px" }}>
          Punjabi, North Indian, Chinese
        </p>
        <p style={{ fontSize: 13, color: "#686b78", margin: 0 }}>
          Gondia, Maharashtra
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10,
          paddingBottom: 14, borderBottom: "1px solid #f3f3f3" }}>
          <span style={{ background: "#48c479", color: "#fff", fontWeight: 700, fontSize: 12,
            borderRadius: 4, padding: "2px 7px" }}>★ 4.2</span>
          <span style={{ fontSize: 12, color: "#93959f" }}>₹15 – ₹295 per item</span>
          <span style={{ fontSize: 12, color: "#93959f" }}>· {MENU.length} items</span>
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
              style={{ flexShrink: 0, padding: "11px 14px", border: "none", background: "none",
                fontSize: 12, fontWeight: activeCategory === cat ? 700 : 500,
                color: activeCategory === cat ? "#e23744" : "#686b78", cursor: "pointer",
                borderBottom: activeCategory === cat ? "2px solid #e23744" : "2px solid transparent",
                transition: "all 0.2s", whiteSpace: "nowrap" }}>
              {cat}
              <span style={{ fontSize: 11, color: "#aaa", marginLeft: 4 }}>
                ({grouped[cat].length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Menu sections */}
      <div style={{ padding: "0 16px" }}>
        {Object.entries(filtered).map(([cat, items]) => (
          <div key={cat} ref={el => { categoryRefs.current[cat] = el }}
            data-category={cat} style={{ paddingTop: 4 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1c1c1c",
              margin: "18px 0 0", paddingBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>
              {cat}
              <span style={{ fontSize: 12, color: "#93959f", fontWeight: 400 }}>
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
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>₹{cartTotal}</span>
              <LuShoppingCart size={18} color="#fff" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
