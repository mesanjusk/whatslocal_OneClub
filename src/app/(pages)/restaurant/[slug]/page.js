"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { LuArrowLeft, LuSearch, LuShoppingCart, LuMinus, LuPlus, LuX } from "react-icons/lu"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  addItem, removeItem,
  selectCartTotal, selectCartCount, selectItemQty,
} from "@/lib/store/slices/cartSlice"

// ── Fallback menu (shown until DB loads or if DB is empty) ────────────────────
const FALLBACK_MENU = [
  { _id: "s1",  category: "Starters",          dietType: "veg",     name: "Kurkuri Aloo Tikki",          price: 145 },
  { _id: "s2",  category: "Starters",          dietType: "veg",     name: "Corn Cheese Tikki",           price: 155 },
  { _id: "s3",  category: "Starters",          dietType: "veg",     name: "Hara Bhara Kebab",            price: 155 },
  { _id: "s4",  category: "Starters",          dietType: "veg",     name: "Manchurian",                  price: 175 },
  { _id: "s5",  category: "Starters",          dietType: "veg",     name: "Veg. Crispy",                 price: 175 },
  { _id: "s6",  category: "Starters",          dietType: "veg",     name: "Crispy Corn",                 price: 185 },
  { _id: "s7",  category: "Starters",          dietType: "veg",     name: "Chole Chilly",                price: 185 },
  { _id: "s8",  category: "Starters",          dietType: "veg",     name: "Paneer Chilly",               price: 185 },
  { _id: "s9",  category: "Starters",          dietType: "veg",     name: "Mushroom Chilly",             price: 195 },
  { _id: "s10", category: "Starters",          dietType: "veg",     name: "Paneer 65",                   price: 195 },
  { _id: "s11", category: "Starters",          dietType: "veg",     name: "Mushroom 65",                 price: 195 },
  { _id: "s12", category: "Starters",          dietType: "veg",     name: "Cheese Satay",                price: 205 },
  { _id: "b1",  category: "Bhatti Se",         dietType: "veg",     name: "Classic Paneer Tikka",        price: 195 },
  { _id: "b2",  category: "Bhatti Se",         dietType: "veg",     name: "Tandoori Soya Chaap",         price: 185 },
  { _id: "b3",  category: "Bhatti Se",         dietType: "veg",     name: "Tandoori Mushroom",           price: 195 },
  { _id: "b4",  category: "Bhatti Se",         dietType: "veg",     name: "Angara Paneer Tikka",         price: 255 },
  { _id: "t1",  category: "Tea Time",          dietType: "veg",     name: "Plain Maggi",                 price: 90  },
  { _id: "t2",  category: "Tea Time",          dietType: "veg",     name: "French Fries",                price: 95  },
  { _id: "t3",  category: "Tea Time",          dietType: "veg",     name: "Peri Peri Fries",             price: 120 },
  { _id: "t4",  category: "Tea Time",          dietType: "veg",     name: "Peri Peri Corn",              price: 165 },
  { _id: "t5",  category: "Tea Time",          dietType: "veg",     name: "Masala Maggie",               price: 130 },
  { _id: "t6",  category: "Tea Time",          dietType: "veg",     name: "Veg Fried Rice",              price: 155 },
  { _id: "pp1", category: "Papad",             dietType: "veg",     name: "Roasted Papad",               price: 15  },
  { _id: "pp2", category: "Papad",             dietType: "veg",     name: "Fry Papad",                   price: 20  },
  { _id: "pp3", category: "Papad",             dietType: "veg",     name: "Butter Papad",                price: 25  },
  { _id: "pp4", category: "Papad",             dietType: "veg",     name: "Masala Papad",                price: 35  },
  { _id: "pp5", category: "Papad",             dietType: "veg",     name: "Papad Bhurji",                price: 95  },
  { _id: "ra1", category: "Raita / Salad",     dietType: "veg",     name: "Plain Curd",                  price: 35  },
  { _id: "ra2", category: "Raita / Salad",     dietType: "veg",     name: "Tadka Dahi",                  price: 85  },
  { _id: "ra3", category: "Raita / Salad",     dietType: "veg",     name: "Boondi Raita",                price: 80  },
  { _id: "ra4", category: "Raita / Salad",     dietType: "veg",     name: "Vegetable Raita",             price: 80  },
  { _id: "ra5", category: "Raita / Salad",     dietType: "veg",     name: "Green Salad",                 price: 80  },
  { _id: "ck1", category: "Chole Kulche Combo",dietType: "veg",     name: "Chole + Aloo Pyaz Kulcha",    price: 160 },
  { _id: "ck2", category: "Chole Kulche Combo",dietType: "veg",     name: "Chole + Mix Kulcha",          price: 180 },
  { _id: "ck3", category: "Chole Kulche Combo",dietType: "veg",     name: "Chole + Paneer Kulcha",       price: 180 },
  { _id: "ck4", category: "Chole Kulche Combo",dietType: "veg",     name: "Chole + Aloo Cheese Kulcha",  price: 190 },
  { _id: "fb1", category: "Food Box",          dietType: "veg",     name: "Punjabi Thali",               price: 225, description: "Mix Veg + PBM + Dal Fry + 3 Butter Roti + Rice + Papad + Sweet + Salad" },
  { _id: "fb2", category: "Food Box",          dietType: "veg",     name: "Royal Dhaba Thali",           price: 295, description: "Chana Masala + PBM + Dal Makhani + 1 Butter Naan + 1 Laccha Paratha + Jeera Rice + Papad + Sweet + Salad" },
  { _id: "p1",  category: "Paneer Se",         dietType: "veg",     name: "PBM (Half)",                  price: 125 },
  { _id: "p2",  category: "Paneer Se",         dietType: "veg",     name: "PBM (Full)",                  price: 195 },
  { _id: "p3",  category: "Paneer Se",         dietType: "veg",     name: "Matar Paneer (Half)",         price: 125 },
  { _id: "p4",  category: "Paneer Se",         dietType: "veg",     name: "Matar Paneer (Full)",         price: 195 },
  { _id: "p5",  category: "Paneer Se",         dietType: "veg",     name: "Paneer Masala (Half)",        price: 120 },
  { _id: "p6",  category: "Paneer Se",         dietType: "veg",     name: "Paneer Masala (Full)",        price: 185 },
  { _id: "p7",  category: "Paneer Se",         dietType: "veg",     name: "Palak Paneer",                price: 195 },
  { _id: "p8",  category: "Paneer Se",         dietType: "veg",     name: "Kadhai Paneer",               price: 205 },
  { _id: "p9",  category: "Paneer Se",         dietType: "veg",     name: "Paneer Angara",               price: 225 },
  { _id: "p10", category: "Paneer Se",         dietType: "veg",     name: "Tawa Paneer Makhan Masala",   price: 215 },
  { _id: "p11", category: "Paneer Se",         dietType: "veg",     name: "Malai Kofta",                 price: 205 },
  { _id: "p12", category: "Paneer Se",         dietType: "veg",     name: "Aloo Tikki Makhani",          price: 205 },
  { _id: "p13", category: "Paneer Se",         dietType: "veg",     name: "Paneer Punjabi",              price: 195 },
  { _id: "p14", category: "Paneer Se",         dietType: "veg",     name: "Paneer Saoji",                price: 195 },
  { _id: "p15", category: "Paneer Se",         dietType: "veg",     name: "PBM Crush",                   price: 225 },
  { _id: "p16", category: "Paneer Se",         dietType: "veg",     name: "Paneer Tikka Masala",         price: 225 },
  { _id: "p17", category: "Paneer Se",         dietType: "veg",     name: "Paneer Bhurji",               price: 225 },
  { _id: "p18", category: "Paneer Se",         dietType: "veg",     name: "Dhaba Paneer",                price: 225 },
  { _id: "v1",  category: "Subziyan",          dietType: "veg",     name: "Mix Veg (Half)",              price: 110 },
  { _id: "v2",  category: "Subziyan",          dietType: "veg",     name: "Mix Veg (Full)",              price: 155 },
  { _id: "v3",  category: "Subziyan",          dietType: "veg",     name: "Sev Bhaji (Half)",            price: 100 },
  { _id: "v4",  category: "Subziyan",          dietType: "veg",     name: "Sev Bhaji (Full)",            price: 145 },
  { _id: "v5",  category: "Subziyan",          dietType: "veg",     name: "Sev Tamatar (Half)",          price: 110 },
  { _id: "v6",  category: "Subziyan",          dietType: "veg",     name: "Sev Tamatar (Full)",          price: 165 },
  { _id: "v7",  category: "Subziyan",          dietType: "veg",     name: "Punjabi Chole (Half)",        price: 110 },
  { _id: "v8",  category: "Subziyan",          dietType: "veg",     name: "Punjabi Chole (Full)",        price: 175 },
  { _id: "v9",  category: "Subziyan",          dietType: "veg",     name: "Baigan Bharta (Half)",        price: 110 },
  { _id: "v10", category: "Subziyan",          dietType: "veg",     name: "Baigan Bharta (Full)",        price: 175 },
  { _id: "v11", category: "Subziyan",          dietType: "veg",     name: "Veg Kolhapuri",               price: 165 },
  { _id: "v12", category: "Subziyan",          dietType: "veg",     name: "Tamatar Chutney",             price: 165 },
  { _id: "v13", category: "Subziyan",          dietType: "veg",     name: "Malai Sev Bhaji",             price: 185 },
  { _id: "v14", category: "Subziyan",          dietType: "veg",     name: "Veg Handi",                   price: 185 },
  { _id: "v15", category: "Subziyan",          dietType: "veg",     name: "Veg Dhaba",                   price: 205 },
  { _id: "v16", category: "Subziyan",          dietType: "veg",     name: "Aloo Gobhi Matar",            price: 165 },
  { _id: "v17", category: "Subziyan",          dietType: "veg",     name: "Jeera Aloo",                  price: 145 },
  { _id: "v18", category: "Subziyan",          dietType: "veg",     name: "Lasooni Palak",               price: 195 },
  { _id: "v19", category: "Subziyan",          dietType: "veg",     name: "Soya Chaap Tikka Masala",     price: 215 },
  { _id: "v20", category: "Subziyan",          dietType: "veg",     name: "Mushroom Masala",             price: 195 },
  { _id: "v21", category: "Subziyan",          dietType: "veg",     name: "Veg Keema Kastoori",          price: 195 },
  { _id: "v22", category: "Subziyan",          dietType: "veg",     name: "Lasooni Veg",                 price: 195 },
  { _id: "v23", category: "Subziyan",          dietType: "veg",     name: "Mushroom Keema",              price: 225 },
  { _id: "v24", category: "Subziyan",          dietType: "veg",     name: "Special Tawa Chaap",          price: 225 },
  { _id: "d1",  category: "Dal",               dietType: "veg",     name: "Dal Fry (Half)",              price: 90  },
  { _id: "d2",  category: "Dal",               dietType: "veg",     name: "Dal Fry (Full)",              price: 135 },
  { _id: "d3",  category: "Dal",               dietType: "veg",     name: "Dal Tadka (Half)",            price: 115 },
  { _id: "d4",  category: "Dal",               dietType: "veg",     name: "Dal Tadka (Full)",            price: 165 },
  { _id: "d5",  category: "Dal",               dietType: "veg",     name: "Dal Makhani (Half)",          price: 120 },
  { _id: "d6",  category: "Dal",               dietType: "veg",     name: "Dal Makhani (Full)",          price: 185 },
  { _id: "d7",  category: "Dal",               dietType: "veg",     name: "Dhaba Dal",                   price: 180 },
  { _id: "d8",  category: "Dal",               dietType: "veg",     name: "Tadka Extra",                 price: 30  },
  { _id: "d9",  category: "Dal",               dietType: "veg",     name: "Butter Tadka",                price: 50  },
  { _id: "r1",  category: "Rotiyaan",          dietType: "veg",     name: "Tawa / Tandoori Roti",        price: 15  },
  { _id: "r2",  category: "Rotiyaan",          dietType: "veg",     name: "Butter Roti",                 price: 20  },
  { _id: "r3",  category: "Rotiyaan",          dietType: "veg",     name: "Butter Naan",                 price: 50  },
  { _id: "r4",  category: "Rotiyaan",          dietType: "veg",     name: "Butter Garlic Naan",          price: 55  },
  { _id: "r5",  category: "Rotiyaan",          dietType: "veg",     name: "Cheese Garlic Naan",          price: 75  },
  { _id: "r6",  category: "Rotiyaan",          dietType: "veg",     name: "Amritsari Kulcha",            price: 80  },
  { _id: "r7",  category: "Rotiyaan",          dietType: "veg",     name: "Laccha Paratha",              price: 50  },
  { _id: "r8",  category: "Rotiyaan",          dietType: "veg",     name: "Aloo Paratha",                price: 80  },
  { _id: "ri1", category: "Rice",              dietType: "veg",     name: "Plain Rice (Half)",           price: 65  },
  { _id: "ri2", category: "Rice",              dietType: "veg",     name: "Plain Rice (Full)",           price: 105 },
  { _id: "ri3", category: "Rice",              dietType: "veg",     name: "Jeera Rice (Half)",           price: 85  },
  { _id: "ri4", category: "Rice",              dietType: "veg",     name: "Jeera Rice (Full)",           price: 125 },
  { _id: "ri5", category: "Rice",              dietType: "veg",     name: "Butter Jeera Rice",           price: 145 },
  { _id: "ri6", category: "Rice",              dietType: "veg",     name: "Onion Garlic Rice",           price: 145 },
  { _id: "ri7", category: "Rice",              dietType: "veg",     name: "Veg. Pulav",                  price: 160 },
  { _id: "ri8", category: "Rice",              dietType: "veg",     name: "Masala Rice",                 price: 155 },
  { _id: "ri9", category: "Rice",              dietType: "veg",     name: "Dal Khichdi",                 price: 165 },
  { _id: "ri10",category: "Rice",              dietType: "veg",     name: "Veg. Biryani",                price: 190 },
  { _id: "ri11",category: "Rice",              dietType: "veg",     name: "Masala Khichdi",              price: 190 },
  { _id: "sw1", category: "Sweet",             dietType: "veg",     name: "Gulab Jamun (2 Pc)",          price: 40  },
  { _id: "sw2", category: "Sweet",             dietType: "veg",     name: "Rabdi (150g)",                price: 100 },
  { _id: "sw3", category: "Sweet",             dietType: "veg",     name: "Rabdi - Gulab Jamun",         price: 100 },
  { _id: "bv1", category: "Beverages",         dietType: "veg",     name: "Cold Drink (250ml)",          price: 25  },
  { _id: "bv2", category: "Beverages",         dietType: "veg",     name: "Mineral Water",               price: 20  },
  { _id: "bv3", category: "Beverages",         dietType: "veg",     name: "Masala Soda",                 price: 50  },
  { _id: "bv4", category: "Beverages",         dietType: "veg",     name: "Masala Chach",                price: 30  },
  { _id: "bv5", category: "Beverages",         dietType: "veg",     name: "Masala Cold Drink",           price: 50  },
  { _id: "bv6", category: "Beverages",         dietType: "veg",     name: "Lassi",                       price: 55  },
]

const PHOTOS = [
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=85",
  "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400&q=80",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
]

function DietDot({ type }) {
  const color = type === "veg" ? "#0f9b58" : "#e43b4f"
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 16, height: 16, border: `1.5px solid ${color}`, borderRadius: 3, flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
    </span>
  )
}

function AddButton({ item, slug, restaurantName }) {
  const dispatch = useAppDispatch()
  const qty = useAppSelector(selectItemQty(slug, item._id))

  const add = () => dispatch(addItem({
    restaurantSlug: slug,
    restaurantName: restaurantName || slug,
    id: item._id,
    name: item.name,
    price: item.price,
    category: item.category,
    dietType: item.dietType,
  }))
  const remove = () => dispatch(removeItem({ restaurantSlug: slug, id: item._id }))

  if (qty === 0) return (
    <motion.button whileTap={{ scale: 0.93 }}
      onClick={add}
      style={{ background: "#fff", border: "1.5px solid #e23744", borderRadius: 8,
        color: "#e23744", fontWeight: 700, fontSize: 13, padding: "6px 22px",
        letterSpacing: "0.05em", cursor: "pointer", whiteSpace: "nowrap" }}>
      ADD
    </motion.button>
  )

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, background: "#e23744",
      borderRadius: 8, overflow: "hidden" }}>
      <button onClick={remove}
        style={{ background: "none", border: "none", color: "#fff", padding: "6px 10px",
          cursor: "pointer", display: "flex", alignItems: "center" }}>
        <LuMinus size={13} strokeWidth={3} />
      </button>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, minWidth: 16,
        textAlign: "center" }}>{qty}</span>
      <button onClick={add}
        style={{ background: "none", border: "none", color: "#fff", padding: "6px 10px",
          cursor: "pointer", display: "flex", alignItems: "center" }}>
        <LuPlus size={13} strokeWidth={3} />
      </button>
    </div>
  )
}

function MenuItem({ item, slug, restaurantName }) {
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
        <AddButton item={item} slug={slug} restaurantName={restaurantName} />
      </div>
    </div>
  )
}

export default function RestaurantPage() {
  const router = useRouter()
  const slug = "dhaba-junction"
  const [menu, setMenu] = useState(FALLBACK_MENU)
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("")
  const [search, setSearch] = useState("")
  const categoryRefs = useRef({})
  const cartTotal = useAppSelector(selectCartTotal)
  const cartCount = useAppSelector(selectCartCount)

  useEffect(() => {
    Promise.all([
      axios.get(`/api/menu/${slug}`).catch(() => ({ data: [] })),
      axios.get(`/api/listing/${slug}`).catch(() => ({ data: null })),
    ]).then(([menuRes, listingRes]) => {
      if (menuRes.data?.length > 0) setMenu(menuRes.data)
      if (listingRes.data) setListing(listingRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const grouped = menu.reduce((acc, item) => {
    const cat = item.category || "Other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
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

  useEffect(() => { if (categories.length) setActiveCategory(categories[0]) }, [menu])

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
  }, [menu])

  const restaurantName = listing?.title || "Dhaba Junction"
  const cuisines = listing?.food?.cuisines?.join(", ") || "Punjabi, North Indian"
  const rating = listing?.food?.rating || 4.2
  const priceMin = listing?.food?.priceRange?.min || 15
  const priceMax = listing?.food?.priceRange?.max || 295

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 120 }}>

      {/* 4-photo header grid */}
      <div style={{ position: "relative", height: 240, overflow: "hidden",
        display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2 }}>
        <img src={listing?.covers?.[0] || PHOTOS[0]} alt={restaurantName}
          style={{ gridColumn: 1, gridRow: "1 / 3", objectFit: "cover", width: "100%", height: "100%" }} />
        <img src={listing?.covers?.[1] || PHOTOS[1]} alt=""
          style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        <img src={listing?.covers?.[2] || PHOTOS[2]} alt=""
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

      {/* Restaurant info from DB */}
      <div style={{ padding: "16px 16px 0" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1c1c1c", margin: 0 }}>
          {restaurantName}
        </h1>
        <p style={{ fontSize: 13, color: "#686b78", margin: "4px 0 2px" }}>{cuisines}</p>
        <p style={{ fontSize: 13, color: "#686b78", margin: 0 }}>
          {listing?.location?.address || "Gondia, Maharashtra"}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10,
          paddingBottom: 14, borderBottom: "1px solid #f3f3f3" }}>
          <span style={{ background: "#48c479", color: "#fff", fontWeight: 700, fontSize: 12,
            borderRadius: 4, padding: "2px 7px" }}>★ {rating}</span>
          <span style={{ fontSize: 12, color: "#93959f" }}>₹{priceMin} – ₹{priceMax} per item</span>
          <span style={{ fontSize: 12, color: "#93959f" }}>· {menu.length} items</span>
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

      {/* Category pills */}
      {!search && (
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff",
          borderBottom: "1px solid #f3f3f3", overflowX: "auto", display: "flex",
          gap: 0, padding: "0 8px" }} className="no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => scrollToCategory(cat)}
              style={{ flexShrink: 0, padding: "11px 14px", border: "none", background: "none",
                fontSize: 12, fontWeight: activeCategory === cat ? 700 : 500,
                color: activeCategory === cat ? "#e23744" : "#686b78", cursor: "pointer",
                borderBottom: activeCategory === cat ? "2px solid #e23744" : "2px solid transparent",
                transition: "all 0.2s", whiteSpace: "nowrap" }}>
              {cat}
              <span style={{ fontSize: 11, color: "#aaa", marginLeft: 4 }}>
                ({grouped[cat]?.length})
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
              <span style={{ fontSize: 12, color: "#93959f", fontWeight: 400 }}>({items.length})</span>
            </h2>
            {items.map(item => <MenuItem key={item._id} item={item} slug={slug} restaurantName={restaurantName} />)}
          </div>
        ))}
      </div>

      {/* Floating cart bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
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
