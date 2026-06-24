"use client"

import axios from "axios"
import clsx from "clsx"
import { useEffect, useState, useCallback } from "react"
import { dateString } from "@/lib/utils/dateString"
import { LuCalendar, LuSearch, LuX } from "react-icons/lu"
import Image from "next/image"
import Link from "next/link"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { CgDetailsLess } from "react-icons/cg"
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setNavigationIds } from "@/lib/store/slices/navigationSlice"
import { FiArrowUpRight } from "react-icons/fi"
import useDebounce from "@/lib/hooks/useDebounce"

const DIET_FILTERS = [
  { label: "Veg", value: "veg", className: "border-green-700/50 text-green-400" },
  { label: "Non-Veg", value: "non-veg", className: "border-red-700/50 text-red-400" },
]
const COST_FILTERS = [
  { label: "Under ₹200", value: 200 },
  { label: "Under ₹500", value: 500 },
]

function StarRating({ rating, size = 14 }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) =>
        n <= Math.round(rating) ? (
          <TiStarFullOutline key={n} size={size} className="text-yellow-400" />
        ) : (
          <TiStarOutline key={n} size={size} className="opacity-40" />
        )
      )}
      <span className="text-xs opacity-60 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function FoodBadges({ food }) {
  if (!food) return null
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {food.dietType && (
        <span
          className={clsx(
            "text-xs px-2 py-0.5 rounded-full border",
            food.dietType === "veg" ? "border-green-700/50 text-green-400" : "border-red-700/50 text-red-400"
          )}
        >
          {food.dietType === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
        </span>
      )}
      {food.cuisines?.[0] && (
        <span className="text-xs px-2 py-0.5 rounded-full border border-secondary-border opacity-70">
          {food.cuisines[0]}
        </span>
      )}
      {food.priceRange?.avgCostForTwo && (
        <span className="text-xs px-2 py-0.5 rounded-full border border-secondary-border opacity-70">
          ₹{food.priceRange.avgCostForTwo} for 2
        </span>
      )}
    </div>
  )
}

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [listings, setListings] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()
  const [searchQuery, setSearchQuery] = useState("")
  const [dietFilter, setDietFilter] = useState(null)
  const [costFilter, setCostFilter] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigationState = useAppSelector((state) => state.navigation)
  const [dynamicInfoText, setDynamicInfoText] = useState()

  const debouncedQuery = useDebounce(searchQuery, 400)
  const isSearchActive = !!(debouncedQuery || dietFilter || costFilter)

  const scrollIntoView = (id, options) => {
    let timerId
    const ivlId = setInterval(() => {
      const elem = document.getElementById(id)
      if (!elem) return
      elem?.scrollIntoView?.(options)
      clearInterval(ivlId)
      clearTimeout(timerId)
    })
    timerId = setTimeout(() => clearTimeout(ivlId), 1000)
  }

  const fetchListings = async (_id, isManualCall = true) => {
    try {
      setLoading(true)
      scrollIntoView(_id, {
        behavior: isManualCall ? "smooth" : "instant",
        block: "nearest",
        inline: "center",
      })
      const response = await axios.get(`/api/listing/sub_categories/${_id}`)
      setListings(response.data)
      if (isManualCall) setSelectedCategory(categories.find((i) => i._id === _id))
      else if (navigationState.subCategory) {
        for (const subCat of response.data) {
          if (![subCat._id, subCat.slug].includes(navigationState.subCategory)) continue
          if (subCat.slug === navigationState.subCategory)
            dispatch(setNavigationIds({ subCategory: subCat._id }))
          scrollIntoView(subCat._id, { behavior: "instant", block: "nearest", inline: "center" })
        }
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const runSearch = useCallback(async () => {
    if (!isSearchActive) { setSearchResults(null); return }
    setSearchLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set("q", debouncedQuery)
      if (dietFilter) params.set("dietType", dietFilter)
      if (costFilter) params.set("maxCost", costFilter)
      const { data } = await axios.get(`/api/listing/search?${params}`)
      setSearchResults(data)
    } catch (err) {
      console.error(err)
    }
    setSearchLoading(false)
  }, [debouncedQuery, dietFilter, costFilter, isSearchActive])

  useEffect(() => { runSearch() }, [runSearch])

  useEffect(() => {
    axios.get(`/api/constants`).then((r) => setDynamicInfoText(r?.data?.dynamicInfoText)).catch(console.error)
    ;(async () => {
      try {
        let response = await axios.get(`/api/category?listings=true`)
        const _categories = response.data
        const catId = navigationState.category
          ? _categories.find((i) => [i._id, i.slug].includes(navigationState.category))?._id || _categories[0]?._id
          : _categories[0]?._id

        if (catId !== navigationState.category) dispatch(setNavigationIds({ category: catId }))
        setSelectedCategory(_categories.find((i) => i._id === catId))
        setCategories(_categories)
        fetchListings(catId, false)

        if (navigationState.listing) {
          scrollIntoView(navigationState.listing, { behavior: "instant", block: "nearest", inline: "center" })
          dispatch(setNavigationIds({ listing: "" }))
        }
      } catch (error) {
        console.error(error.message)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearSearch = () => {
    setSearchQuery("")
    setDietFilter(null)
    setCostFilter(null)
    setSearchResults(null)
  }

  return (
    <div>
      {dynamicInfoText && (
        <span className="py-1.5 bg-secondary border-y border-border block text-center opacity-60 text-sm">
          {dynamicInfoText}
        </span>
      )}

      {/* Search bar */}
      <div className="px-hr mt-3 mb-2">
        <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-2">
          <LuSearch size={18} className="opacity-40 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
          />
          {(searchQuery || dietFilter || costFilter) && (
            <button onClick={clearSearch}>
              <LuX size={16} className="opacity-40" />
            </button>
          )}
        </div>

        {/* Quick filter chips */}
        <div className="no-scrollbar flex gap-2 mt-2 overflow-auto whitespace-nowrap pb-1">
          {DIET_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setDietFilter(dietFilter === f.value ? null : f.value)}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                dietFilter === f.value ? f.className + " bg-secondary" : "border-secondary-border opacity-60"
              )}
            >
              {f.label}
            </button>
          ))}
          {COST_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setCostFilter(costFilter === f.value ? null : f.value)}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                costFilter === f.value ? "border-accent bg-secondary font-semibold" : "border-secondary-border opacity-60"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      {!isSearchActive && (
        <div className="px-hr mt-1 mb-4 no-scrollbar flex gap-2 items-center overflow-auto whitespace-nowrap">
          {categories?.length > 0 ? (
            categories.map((i) => (
              <button
                key={i._id}
                id={i._id}
                className={clsx(
                  "rounded-full border border-secondary-border py-2 px-3 font-medium",
                  selectedCategory?._id === i._id ? "bg-primary text-secondary" : "bg-secondary"
                )}
                onClick={() => fetchListings(i._id)}
              >
                {i.title}
              </button>
            ))
          ) : (
            [0, 1, 2].map((n) => (
              <span key={n} className="bg-secondary rounded-full py-2 px-3 text-base">
                <span className="block h-6 w-[4.5em]" />
              </span>
            ))
          )}
        </div>
      )}

      {/* Search results */}
      {isSearchActive ? (
        <div className="px-hr mt-2">
          {searchLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className="bg-secondary rounded-xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : searchResults?.length === 0 ? (
            <p className="text-center opacity-50 py-10">No restaurants found. Try a different search.</p>
          ) : (
            <>
              <p className="text-sm opacity-50 mb-3">
                {searchResults?.length} restaurant{searchResults?.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-2 gap-3">
                {searchResults?.map((i) => (
                  <Link key={i._id} href={`/${i.category}/${i.subCategory}/${i.slug}`}>
                    <ListingCard i={i} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {listings?.length > 0 ? (
            listings
              .filter((subCat) => subCat?.listings?.length > 0)
              .map((subCat) => (
                <div key={subCat._id} id={subCat._id}>
                  <span className="px-hr block mt-8 mb-6 font-bold text-xl">{subCat.title}</span>
                  <div className="scroll-container flex gap-2 px-hr w-full">
                    {subCat.listings.map((i) => (
                      <Link
                        key={i._id}
                        id={i._id}
                        href={`/${selectedCategory?.slug}/${subCat.slug}/${i.slug}`}
                        className="scroll-element"
                      >
                        <ListingCard i={i} />
                      </Link>
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <div className={clsx("transition-opacity ease-in-out duration-500", loading ? "opacity-100" : "opacity-0")}>
              {[0, 1].map((n) => (
                <div key={n} className="h-full">
                  <span className="mt-8 mb-6 block w-3/5 h-[1.4rem] bg-secondary rounded-full mx-hr" />
                  <div className="flex gap-2 px-hr overflow-auto w-full">
                    <div className="listing-card aspect-[3/5] bg-secondary h-full flex flex-col shrink-0 text-secondary-foreground rounded-3xl overflow-hidden" />
                    <div className="listing-card aspect-[3/5] bg-secondary h-full flex flex-col shrink-0 text-secondary-foreground rounded-3xl overflow-hidden" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedCategory?.connectButton && (
            <Link
              href={selectedCategory.connectButton.url}
              className="my-8 flex gap-1 items-center justify-center underline opacity-60"
            >
              <span>{selectedCategory.connectButton.text}</span>
              <FiArrowUpRight className="size-4" />
            </Link>
          )}
        </>
      )}
    </div>
  )
}

function ListingCard({ i }) {
  return (
    <div className="listing-card bg-secondary text-secondary-foreground h-full flex flex-col rounded-xl overflow-hidden drop-shadow-xl shadow-black border border-border">
      <div className="border-[4px] border-transparent relative">
        <Image
          src={i.thumbnail}
          alt="thumbnail"
          className="object-cover aspect-[4/5] rounded-[8.5px]"
          width={400}
          height={400 * (1 + 1 / 5)}
        />
        {i.food?.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-400/90 text-black text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <TiStarFullOutline size={11} /> Featured
          </span>
        )}
      </div>
      <div className="pt-3 pb-3 px-3">
        <div className="line-clamp-2">
          <span>{i.title}</span>
        </div>
        <div className="mt-2 space-y-2 text-sm">
          {i?.date && (
            <div className="flex items-center gap-3">
              <LuCalendar size={20} className="shrink-0 opacity-50" />
              <span className="font-light block truncate">{dateString(i?.date, i?.time, true)}</span>
            </div>
          )}
          {i.location?.address && (
            <div className="flex items-center gap-3 truncate">
              <HiOutlineLocationMarker size={20} className="shrink-0 opacity-50" />
              <span className="font-light">{i.location.address}</span>
            </div>
          )}
          {!i?.date && i.about?.length && !i.food ? (
            <div className="flex gap-3">
              <CgDetailsLess size={20} className="shrink-0 opacity-50" />
              <p className="font-light line-clamp-2">{i.about}</p>
            </div>
          ) : null}
          {i.food?.rating > 0 && <StarRating rating={i.food.rating} />}
          <FoodBadges food={i.food} />
        </div>
      </div>
    </div>
  )
}
