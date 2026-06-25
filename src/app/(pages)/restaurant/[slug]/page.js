"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { LuArrowLeft, LuSearch, LuShoppingCart, LuMinus, LuPlus, LuX, LuHeart, LuSend, LuStar } from "react-icons/lu"
import { toast } from "react-toastify"
import { toggleFavourite, isFavourite } from "@/app/(pages)/favourites/page"
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

// ── Star selector ─────────────────────────────────────────────────────────────
function StarSelector({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <LuStar size={24}
            fill={n <= value ? "#facc15" : "none"}
            strokeWidth={n <= value ? 0 : 1.5}
            style={{ color: n <= value ? "#facc15" : "#d1d5db" }} />
        </button>
      ))}
    </div>
  )
}

// ── Reviews section ────────────────────────────────────────────────────────────
function ReviewsSection({ slug }) {
  const [reviews, setReviews]     = useState([])
  const [form, setForm]           = useState({ userName: "", rating: 0, comment: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    axios.get(`/api/review/${slug}`).then(r => setReviews(r.data)).catch(() => {})
  }, [slug])

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rating) { toast.error("Please select a star rating"); return }
    setSubmitting(true)
    try {
      await axios.post(`/api/review/${slug}`, form)
      setSubmitted(true)
      toast.success("Review submitted! It will appear after approval.")
    } catch {
      toast.error("Could not submit review. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: "20px 16px", borderTop: "8px solid #f8f8f8" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1c1c1c", margin: 0 }}>Reviews</h2>
        {avg && (
          <span style={{ background: "#48c479", color: "#fff", fontWeight: 700,
            fontSize: 13, borderRadius: 6, padding: "3px 9px" }}>
            ★ {avg} ({reviews.length})
          </span>
        )}
      </div>

      {/* Existing reviews */}
      {reviews.length > 0 ? (
        <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.slice(0, 5).map((r, i) => (
            <div key={i} style={{ background: "#f8f8f8", borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#1c1c1c" }}>{r.userName || "Anonymous"}</span>
                <span style={{ background: "#48c479", color: "#fff", fontSize: 11,
                  fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>★ {r.rating}</span>
              </div>
              {r.comment && <p style={{ fontSize: 13, color: "#686b78", margin: 0, lineHeight: 1.5 }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "#aaa", marginBottom: 20 }}>No reviews yet. Be the first!</p>
      )}

      {/* Write review form */}
      {submitted ? (
        <div style={{ background: "#f0fdf4", borderRadius: 14, padding: "14px", textAlign: "center",
          color: "#16a34a", fontWeight: 600, fontSize: 13 }}>
          ✓ Thanks! Your review is pending approval.
        </div>
      ) : (
        <form onSubmit={handleSubmit}
          style={{ background: "#f8f8f8", borderRadius: 16, padding: "16px", display: "flex",
            flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1c1c1c", margin: 0 }}>Write a Review</h3>
          <input
            value={form.userName}
            onChange={e => setForm(f => ({ ...f, userName: e.target.value }))}
            placeholder="Your name"
            style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
              padding: "10px 14px", fontSize: 13, outline: "none", color: "#1c1c1c" }}
          />
          <StarSelector value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
          <textarea
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            placeholder="Share your experience…"
            rows={3}
            style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
              padding: "10px 14px", fontSize: 13, outline: "none", resize: "none", color: "#1c1c1c" }}
          />
          <button type="submit" disabled={submitting}
            style={{ background: "#e23744", color: "#fff", fontWeight: 700, fontSize: 14,
              border: "none", borderRadius: 12, padding: "12px", cursor: "pointer", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  )
}

// ── Inquiry modal ─────────────────────────────────────────────────────────────
function InquiryModal({ slug, restaurantName, onClose }) {
  const [form, setForm]           = useState({ name: "", mobile: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]           = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axios.post("/api/inquiries", { restaurantId: slug, restaurantName, ...form })
      setDone(true)
      toast.success("Your inquiry has been sent!")
      setTimeout(onClose, 1800)
    } catch {
      toast.error("Could not send inquiry. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex",
      alignItems: "flex-end", background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "20px 16px 36px",
          width: "100%", maxWidth: 512, marginInline: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1c1c1c", margin: 0 }}>
            📩 Send Inquiry to {restaurantName}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <LuX size={18} />
          </button>
        </div>
        {done ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#16a34a", fontWeight: 700, fontSize: 14 }}>
            ✓ Inquiry sent successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { key: "name", placeholder: "Your name", type: "text" },
              { key: "mobile", placeholder: "Your mobile number", type: "tel" },
            ].map(({ key, placeholder, type }) => (
              <input key={key} type={type} placeholder={placeholder} required
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ background: "#f8f8f8", border: "1px solid #e5e7eb", borderRadius: 12,
                  padding: "12px 14px", fontSize: 13, outline: "none", color: "#1c1c1c" }} />
            ))}
            <textarea placeholder="Your message or question…" required rows={3}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={{ background: "#f8f8f8", border: "1px solid #e5e7eb", borderRadius: 12,
                padding: "12px 14px", fontSize: 13, outline: "none", resize: "none", color: "#1c1c1c" }} />
            <button type="submit" disabled={submitting}
              style={{ background: "#e23744", color: "#fff", fontWeight: 700, fontSize: 14,
                border: "none", borderRadius: 12, padding: "13px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: submitting ? 0.7 : 1 }}>
              <LuSend size={15} /> {submitting ? "Sending…" : "Send Inquiry"}
            </button>
          </form>
        )}
      </motion.div>
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
  const [fav, setFav] = useState(false)
  const [showInquiry, setShowInquiry] = useState(false)
  const categoryRefs = useRef({})
  const cartTotal = useAppSelector(selectCartTotal)
  const cartCount = useAppSelector(selectCartCount)

  useEffect(() => { setFav(isFavourite(slug)) }, [])

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
        {/* Heart / Favourite button */}
        <button
          onClick={() => {
            const next = toggleFavourite({ slug, name: restaurantName || "Dhaba Junction", image: listing?.covers?.[0] || PHOTOS[0] })
            setFav(next.some(f => f.slug === slug))
            toast.success(fav ? "Removed from Saved" : "Saved to favourites ❤️")
          }}
          style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.95)",
            border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 10 }}>
          <LuHeart size={18} fill={fav ? "#e23744" : "none"}
            style={{ color: fav ? "#e23744" : "#1c1c1c" }} />
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

      {/* Inquiry button */}
      <div style={{ padding: "0 16px 8px" }}>
        <button onClick={() => setShowInquiry(true)}
          style={{ width: "100%", background: "#fff", border: "1.5px solid #e23744", borderRadius: 14,
            padding: "13px", color: "#e23744", fontWeight: 700, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <LuSend size={16} /> Send Inquiry
        </button>
      </div>

      {/* Reviews */}
      <ReviewsSection slug={slug} />

      {/* Inquiry modal */}
      <AnimatePresence>
        {showInquiry && (
          <InquiryModal
            slug={slug}
            restaurantName={restaurantName}
            onClose={() => setShowInquiry(false)}
          />
        )}
      </AnimatePresence>

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
