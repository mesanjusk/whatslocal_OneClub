"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LuHeart, LuTrash2, LuArrowRight } from "react-icons/lu"

const STORAGE_KEY = "wl_favourites"

export function getFavourites() {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function toggleFavourite(restaurant) {
  const favs = getFavourites()
  const idx = favs.findIndex(f => f.slug === restaurant.slug)
  let next
  if (idx >= 0) {
    next = favs.filter((_, i) => i !== idx)
  } else {
    next = [...favs, { slug: restaurant.slug, name: restaurant.name, image: restaurant.image || null }]
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  return next
}

export function isFavourite(slug) {
  return getFavourites().some(f => f.slug === slug)
}

export default function FavouritesPage() {
  const router = useRouter()
  const [favs, setFavs] = useState([])

  useEffect(() => { setFavs(getFavourites()) }, [])

  const remove = (slug) => {
    const next = favs.filter(f => f.slug !== slug)
    setFavs(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-5 pb-28">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <LuHeart size={20} className="text-[#e23744]" />
            Saved Restaurants
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">{favs.length} saved</p>
        </div>
        {favs.length > 0 && (
          <button
            onClick={() => { setFavs([]); localStorage.removeItem(STORAGE_KEY) }}
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <LuTrash2 size={12} /> Clear all
          </button>
        )}
      </div>

      {favs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <LuHeart size={28} className="text-[#e23744]" />
          </div>
          <div>
            <p className="font-bold text-gray-700 text-[15px]">No saved restaurants</p>
            <p className="text-sm text-gray-400 mt-1 max-w-[220px]">
              Tap the ❤️ on any restaurant to save it here
            </p>
          </div>
          <button
            onClick={() => router.push("/home")}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#e23744] bg-red-50 px-4 py-2 rounded-full"
          >
            Explore restaurants <LuArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {favs.map((fav, i) => (
            <motion.div
              key={fav.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center gap-3"
            >
              {fav.image ? (
                <img src={fav.image} alt={fav.name}
                  className="w-20 h-20 object-cover shrink-0" />
              ) : (
                <div className="w-20 h-20 bg-gray-100 shrink-0 flex items-center justify-center">
                  <LuHeart size={20} className="text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0 py-3">
                <p className="font-bold text-[15px] text-gray-900 truncate">{fav.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Gondia</p>
              </div>
              <div className="flex items-center gap-2 pr-4">
                <button
                  onClick={() => router.push(`/restaurant/${fav.slug}`)}
                  className="text-xs font-semibold text-[#e23744] border border-[#e23744]/30 px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  Menu
                </button>
                <button
                  onClick={() => remove(fav.slug)}
                  className="p-1.5 text-gray-400 hover:text-red-400"
                >
                  <LuTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
