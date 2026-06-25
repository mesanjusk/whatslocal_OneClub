"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { LuPlus, LuPencil, LuX, LuSave, LuLayoutDashboard } from "react-icons/lu"
import { useAppSelector } from "@/lib/store/hooks"
import { toast } from "react-toastify"

const EMPTY_FORM = { title: "", cuisines: "", priceMin: "", priceMax: "", thumbnail: "" }

function ListingForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form) }}
      className="space-y-3 bg-gray-50 rounded-2xl p-4 border border-gray-200"
    >
      {[
        { key: "title",     label: "Restaurant Name",  type: "text",   required: true },
        { key: "cuisines",  label: "Cuisine Types",    type: "text",   placeholder: "e.g. North Indian, Chinese" },
        { key: "priceMin",  label: "Min Price (₹)",    type: "number" },
        { key: "priceMax",  label: "Max Price (₹)",    type: "number" },
        { key: "thumbnail", label: "Image URL",        type: "url",    placeholder: "https://…" },
      ].map(({ key, label, type, placeholder, required }) => (
        <div key={key}>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
          <input
            type={type}
            value={form[key]}
            onChange={set(key)}
            placeholder={placeholder || ""}
            required={required}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#e23744]/40"
          />
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-[#e23744] text-white font-bold text-sm rounded-xl py-2.5 disabled:opacity-60">
          <LuSave size={14} /> {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 text-gray-500 border border-gray-200 rounded-xl text-sm font-semibold">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function DashboardPage() {
  const router  = useRouter()
  const user    = useAppSelector(s => s.user)

  const [listings, setListings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [editId, setEditId]       = useState(null)
  const [showAdd, setShowAdd]     = useState(false)
  const [saving, setSaving]       = useState(false)

  // Protect route
  useEffect(() => {
    if (user?.token === undefined) return
    if (!user?.token) router.replace("/login")
  }, [user?.token, router])

  useEffect(() => {
    axios.get("/api/listing")
      .then(r => setListings(Array.isArray(r.data) ? r.data : []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [])

  const handleEdit = async (id, form) => {
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        food: {
          cuisines: form.cuisines ? form.cuisines.split(",").map(s => s.trim()) : [],
          priceRange: { min: Number(form.priceMin) || 0, max: Number(form.priceMax) || 0 },
        },
        thumbnail: form.thumbnail || undefined,
      }
      await axios.put(`/api/listing/${id}`, { json: JSON.stringify({ _id: id, ...payload }) })
      setListings(ls => ls.map(l => l._id === id ? { ...l, ...payload } : l))
      setEditId(null)
      toast.success("Listing updated!")
    } catch {
      toast.error("Update failed.")
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = async (form) => {
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        slug: form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        type: "food",
        food: {
          cuisines: form.cuisines ? form.cuisines.split(",").map(s => s.trim()) : [],
          priceRange: { min: Number(form.priceMin) || 0, max: Number(form.priceMax) || 0 },
        },
        thumbnail: form.thumbnail || "",
      }
      const { data } = await axios.post("/api/listing", { json: JSON.stringify(payload) })
      setListings(ls => [data, ...ls])
      setShowAdd(false)
      toast.success("Restaurant added!")
    } catch {
      toast.error("Could not add restaurant.")
    } finally {
      setSaving(false)
    }
  }

  if (!user?.token) return null

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-5 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <LuLayoutDashboard size={20} className="text-[#e23744]" />
            My Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Logged in as {user.name}</p>
        </div>
        <button
          onClick={() => setShowAdd(s => !s)}
          className="flex items-center gap-1.5 bg-[#e23744] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm shadow-[#e23744]/30"
        >
          <LuPlus size={14} /> Add New
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div key="add-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4">
            <ListingForm
              onSave={handleAdd}
              onCancel={() => setShowAdd(false)}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listings */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-200" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-semibold">No restaurants yet.</p>
          <p className="text-sm mt-1">Click "Add New" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((l, i) => (
            <motion.div key={l._id || i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              {/* Listing row */}
              <div className="flex items-center gap-3 px-4 py-3">
                {l.thumbnail ? (
                  <img src={l.thumbnail} alt={l.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px] text-gray-900 truncate">{l.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {l.food?.cuisines?.join(", ") || "—"}
                    {l.food?.priceRange?.min ? ` · ₹${l.food.priceRange.min}–₹${l.food.priceRange.max}` : ""}
                  </p>
                  <p className="text-[10px] text-gray-300 mt-0.5">/{l.slug}</p>
                </div>
                <button
                  onClick={() => setEditId(editId === l._id ? null : l._id)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#e23744] border border-[#e23744]/30 px-2.5 py-1.5 rounded-lg shrink-0"
                >
                  {editId === l._id ? <LuX size={12} /> : <LuPencil size={12} />}
                  {editId === l._id ? "Close" : "Edit"}
                </button>
              </div>

              {/* Inline edit form */}
              <AnimatePresence>
                {editId === l._id && (
                  <motion.div key="edit"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24 }}
                    className="overflow-hidden px-4 pb-4">
                    <ListingForm
                      initial={{
                        title: l.title || "",
                        cuisines: l.food?.cuisines?.join(", ") || "",
                        priceMin: l.food?.priceRange?.min || "",
                        priceMax: l.food?.priceRange?.max || "",
                        thumbnail: l.thumbnail || "",
                      }}
                      onSave={(form) => handleEdit(l._id, form)}
                      onCancel={() => setEditId(null)}
                      saving={saving}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
