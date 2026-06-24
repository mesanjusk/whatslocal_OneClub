"use client"

import axios from "axios"
import clsx from "clsx"
import { useEffect, useState, useCallback } from "react"
import { dateString } from "@/lib/utils/dateString"
import { LuCalendar, LuSearch, LuX, LuMapPin } from "react-icons/lu"
import Image from "next/image"
import Link from "next/link"
import { FiArrowUpRight } from "react-icons/fi"
import useDebounce from "@/lib/hooks/useDebounce"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setNavigationIds } from "@/lib/store/slices/navigationSlice"

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [listings, setListings] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [dynamicInfoText, setDynamicInfoText] = useState()
  const dispatch = useAppDispatch()
  const navigationState = useAppSelector((state) => state.navigation)

  const debouncedQuery = useDebounce(searchQuery, 400)
  const isSearchActive = !!debouncedQuery

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
      const { data } = await axios.get(`/api/listing/search?${params}`)
      setSearchResults(data)
    } catch (err) {
      console.error(err)
    }
    setSearchLoading(false)
  }, [debouncedQuery, isSearchActive])

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

  return (
    <div>
      {dynamicInfoText && (
        <span className="py-1.5 bg-secondary border-y border-border block text-center opacity-60 text-sm">
          {dynamicInfoText}
        </span>
      )}

      {/* Search bar */}
      <div className="px-hr mt-4 mb-3">
        <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-2.5">
          <LuSearch size={18} className="opacity-40 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search businesses, events, places..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setSearchResults(null) }}>
              <LuX size={16} className="opacity-40" />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      {!isSearchActive && (
        <div className="px-hr mt-1 mb-4 no-scrollbar flex gap-2 items-center overflow-auto whitespace-nowrap">
          {categories?.length > 0 ? (
            categories.map((cat) => (
              <button
                key={cat._id}
                id={cat._id}
                onClick={() => fetchListings(cat._id)}
                className={clsx(
                  "rounded-full border py-2 px-4 text-sm font-medium transition-colors",
                  selectedCategory?._id === cat._id
                    ? "bg-primary text-secondary border-primary"
                    : "bg-secondary border-secondary-border"
                )}
              >
                {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
                {cat.title}
              </button>
            ))
          ) : (
            [0, 1, 2, 3].map((n) => (
              <span key={n} className="bg-secondary rounded-full py-2 px-4 border border-secondary-border">
                <span className="block h-5 w-16 opacity-0">·</span>
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
            <p className="text-center opacity-50 py-10">No results found. Try a different search.</p>
          ) : (
            <>
              <p className="text-sm opacity-50 mb-3">{searchResults?.length} result{searchResults?.length !== 1 ? "s" : ""}</p>
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
                <div key={subCat._id} id={subCat._id} className="mb-2">
                  <div className="px-hr mt-8 mb-4 flex items-center justify-between">
                    <span className="font-bold text-xl">{subCat.title}</span>
                  </div>
                  <div className="scroll-container flex gap-3 px-hr w-full">
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
            <div className={clsx("transition-opacity duration-500", loading ? "opacity-100" : "opacity-0")}>
              {[0, 1].map((n) => (
                <div key={n}>
                  <span className="mt-8 mb-4 block w-2/5 h-6 bg-secondary rounded-full mx-hr" />
                  <div className="flex gap-3 px-hr overflow-hidden">
                    {[0, 1].map((m) => (
                      <div key={m} className="listing-card aspect-[3/4] bg-secondary rounded-2xl shrink-0 animate-pulse" />
                    ))}
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
    <div className="listing-card bg-secondary text-secondary-foreground h-full flex flex-col rounded-2xl overflow-hidden border border-border shadow-sm">
      <div className="relative">
        <Image
          src={i.thumbnail}
          alt={i.title}
          className="object-cover aspect-[4/3] w-full"
          width={400}
          height={300}
        />
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="font-semibold text-sm line-clamp-2 leading-snug">{i.title}</span>
        <div className="space-y-1 text-xs opacity-60">
          {i?.date && (
            <div className="flex items-center gap-1.5">
              <LuCalendar size={13} className="shrink-0" />
              <span className="truncate">{dateString(i?.date, i?.time, true)}</span>
            </div>
          )}
          {i.location?.address && (
            <div className="flex items-center gap-1.5">
              <LuMapPin size={13} className="shrink-0" />
              <span className="truncate">{i.location.address}</span>
            </div>
          )}
          {!i?.date && !i.location?.address && i.about?.length > 0 && (
            <p className="line-clamp-2 leading-snug">{i.about}</p>
          )}
        </div>
      </div>
    </div>
  )
}
