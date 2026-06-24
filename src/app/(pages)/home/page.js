"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import clsx from "clsx"
import { LuSearch, LuX, LuSlidersHorizontal } from "react-icons/lu"
import useDebounce from "@/lib/hooks/useDebounce"
import RestaurantCard from "@/components/RestaurantCard"

// ── Sample restaurant data (grows as you add more entries) ────────────────────
const SAMPLE_RESTAURANTS = [
  {
    name: "Dhaba Junction",
    slug: "dhaba-junction",
    photos: [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=85",
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=600&q=80",
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    ],
    rating: 4.2,
    cuisines: ["Punjabi", "North Indian"],
    location: "Gondia, Maharashtra",
    priceRange: { min: 15, max: 295 },
    dietType: "veg",
    tags: ["Pure Veg", "Family Friendly", "Thali"],
    isNew: false,
  },
  {
    name: "The Spice Route",
    slug: "the-spice-route",
    photos: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=85",
      "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80",
    ],
    rating: 4.0,
    cuisines: ["Indian", "Chinese", "Continental"],
    location: "Gondia, Maharashtra",
    priceRange: { min: 80, max: 400 },
    dietType: "non-veg",
    tags: ["Multi-Cuisine", "Biryani"],
    isNew: true,
  },
  {
    name: "Punjabi Tadka",
    slug: "punjabi-tadka",
    photos: [
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=85",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80",
    ],
    rating: 4.5,
    cuisines: ["Punjabi", "Dal Makhani", "Chole"],
    location: "Gondia, Maharashtra",
    priceRange: { min: 60, max: 350 },
    dietType: "veg",
    tags: ["Pure Veg", "Lassi", "Paratha"],
    isNew: false,
  },
  {
    name: "Bombay Bites",
    slug: "bombay-bites",
    photos: [
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=85",
    ],
    rating: 3.9,
    cuisines: ["Street Food", "Maharashtrian"],
    location: "Gondia, Maharashtra",
    priceRange: { min: 30, max: 180 },
    dietType: "veg",
    tags: ["Vada Pav", "Misal Pav", "Quick Bites"],
    isNew: false,
  },
  {
    name: "Chicken Hut",
    slug: "chicken-hut",
    photos: [
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=800&q=85",
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
    ],
    rating: 4.3,
    cuisines: ["Chicken", "Kebabs", "Biryani"],
    location: "Gondia, Maharashtra",
    priceRange: { min: 120, max: 450 },
    dietType: "non-veg",
    tags: ["Chicken Special", "Kebabs"],
    isNew: true,
  },
  {
    name: "Green Bowl",
    slug: "green-bowl",
    photos: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=85",
    ],
    rating: 4.1,
    cuisines: ["Salads", "Healthy", "Wraps"],
    location: "Gondia, Maharashtra",
    priceRange: { min: 90, max: 280 },
    dietType: "veg",
    tags: ["Healthy", "Light Meals"],
    isNew: false,
  },
]

const DIET_FILTERS = [
  { label: "Veg",     value: "veg",     activeClass: "bg-green-50 border-green-600 text-green-700" },
  { label: "Non-Veg", value: "non-veg", activeClass: "bg-red-50 border-red-500 text-red-600" },
]
const COST_FILTERS = [
  { label: "Under ₹200", value: 200 },
  { label: "Under ₹500", value: 500 },
]

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 animate-pulse">
      <div className="bg-gray-200" style={{ aspectRatio: "16/9" }} />
      <div className="px-3.5 py-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-3 bg-gray-100 rounded-full w-2/3" />
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Page() {
  const [searchQuery, setSearchQuery]   = useState("")
  const [dietFilter,  setDietFilter]    = useState(null)
  const [costFilter,  setCostFilter]    = useState(null)
  const [loading, setLoading]           = useState(true)
  const [dynamicInfoText, setDynamicInfoText] = useState(null)

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    axios.get("/api/constants")
      .then(r => setDynamicInfoText(r?.data?.dynamicInfoText))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const clearSearch = () => {
    setSearchQuery("")
    setDietFilter(null)
    setCostFilter(null)
  }

  const isFiltered = !!(debouncedQuery || dietFilter || costFilter)

  // Filter sample restaurants client-side
  const filtered = SAMPLE_RESTAURANTS.filter(r => {
    if (debouncedQuery && !r.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      && !r.cuisines.some(c => c.toLowerCase().includes(debouncedQuery.toLowerCase()))
      && !r.tags.some(t => t.toLowerCase().includes(debouncedQuery.toLowerCase()))) return false
    if (dietFilter && r.dietType !== dietFilter) return false
    if (costFilter && r.priceRange?.min > costFilter) return false
    return true
  })

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Announcement banner ── */}
      {dynamicInfoText && (
        <div className="bg-[#e23744] text-white text-xs text-center py-1.5 px-4 font-medium tracking-wide">
          {dynamicInfoText}
        </div>
      )}

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-50 bg-white shadow-sm px-4 pt-4 pb-3 space-y-3">

        {/* Headline */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Explore</h1>
          <p className="text-xs text-gray-400 mt-0.5">Restaurants in Gondia</p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
          <LuSearch size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines, dishes…"
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          {isFiltered && (
            <button onClick={clearSearch} className="shrink-0">
              <LuX size={15} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {DIET_FILTERS.map(f => (
            <button key={f.value}
              onClick={() => setDietFilter(dietFilter === f.value ? null : f.value)}
              className={clsx(
                "shrink-0 text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all",
                dietFilter === f.value ? f.activeClass : "border-gray-200 text-gray-500 bg-white"
              )}>
              {f.label}
            </button>
          ))}
          {COST_FILTERS.map(f => (
            <button key={f.value}
              onClick={() => setCostFilter(costFilter === f.value ? null : f.value)}
              className={clsx(
                "shrink-0 text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all",
                costFilter === f.value
                  ? "bg-[#e23744]/10 border-[#e23744]/50 text-[#e23744]"
                  : "border-gray-200 text-gray-500 bg-white"
              )}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESTAURANT LIST (scrolls under sticky header) ── */}
      <div className="px-4 pt-4 pb-28 space-y-4">

        {/* Result count */}
        <p className="text-xs text-gray-400 font-medium">
          {isFiltered
            ? `${filtered.length} restaurant${filtered.length !== 1 ? "s" : ""} found`
            : `${SAMPLE_RESTAURANTS.length} restaurants near you`}
        </p>

        {/* Skeleton while loading */}
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <LuSearch size={36} strokeWidth={1.2} />
            <p className="text-sm font-medium">No restaurants found</p>
            <p className="text-xs">Try a different search or clear filters</p>
            <button onClick={clearSearch}
              className="mt-2 text-xs text-[#e23744] font-semibold underline underline-offset-2">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(restaurant => (
              <RestaurantCard key={restaurant.slug} {...restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
