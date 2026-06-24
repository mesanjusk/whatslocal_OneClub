"use client"

import { useState } from "react"
import Link from "next/link"
import { TiStarFullOutline } from "react-icons/ti"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { LuClock, LuUsers } from "react-icons/lu"
import clsx from "clsx"

// ── Diet badge ────────────────────────────────────────────────────────────────
function DietBadge({ type }) {
  if (!type) return null
  const isVeg = type === "veg"
  return (
    <span className={clsx(
      "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
      isVeg ? "border-green-600/40 text-green-500 bg-green-500/10"
             : "border-red-500/40 text-red-500 bg-red-500/10"
    )}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", isVeg ? "bg-green-500" : "bg-red-500")} />
      {isVeg ? "Pure Veg" : "Non-Veg"}
    </span>
  )
}

export default function RestaurantCard({ name, slug, photos = [], rating, cuisines = [], location, priceRange, dietType, tags = [], isNew = false }) {
  const [imgIdx, setImgIdx] = useState(0)
  const thumb = photos[imgIdx] || photos[0] || "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80"

  return (
    <Link href={`/restaurant/${slug || "dhaba-junction"}`}
      className="block group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">

      {/* Photo area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <img
          src={thumb}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {isNew && (
            <span className="bg-[#e23744] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
          <DietBadge type={dietType} />
        </div>

        {/* Rating chip */}
        {rating > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
            <TiStarFullOutline size={11} className="text-yellow-400" />
            <span className="text-xs font-bold text-gray-800">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Multiple photo dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 flex gap-1">
            {photos.map((_, i) => (
              <button key={i} onMouseEnter={() => setImgIdx(i)}
                onClick={e => { e.preventDefault(); setImgIdx(i) }}
                className={clsx("w-1.5 h-1.5 rounded-full transition-all",
                  i === imgIdx ? "bg-white w-3" : "bg-white/60")} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3.5 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[15px] text-gray-900 leading-tight line-clamp-1">{name}</h3>
        </div>

        {cuisines.length > 0 && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{cuisines.join(", ")}</p>
        )}

        {location && (
          <div className="flex items-center gap-1 mt-1.5">
            <HiOutlineLocationMarker size={11} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-400 truncate">{location}</span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {priceRange && (
          <p className="text-xs text-gray-400 mt-2">
            ₹{priceRange.min}–₹{priceRange.max} per item
          </p>
        )}
      </div>
    </Link>
  )
}
