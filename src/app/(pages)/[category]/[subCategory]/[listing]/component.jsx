"use client"

import { HiOutlineLocationMarker } from "react-icons/hi"
import { dateString, timeString } from "@/lib/utils/dateString"
import InstagramIcon from "@/assets/svg/InstagramIcon"
import WhatsAppIcon from "@/assets/svg/WhatsAppIcon"
import GoogleMapsIcon from "@/assets/svg/GoogleMapsIcon"
import { LuCalendar, LuCalendarClock } from "react-icons/lu"
import ListingActionLink from "@/components/shared/ListingActionLink"
import { IoCall, IoCopyOutline } from "react-icons/io5"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import Image from "next/image"
import { PiArrowBendDoubleUpRight } from "react-icons/pi"
import { BiCategory } from "react-icons/bi"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setNavigationIds } from "@/lib/store/slices/navigationSlice"
import { getWindow } from "@/lib/utils/getWindow"
import ImageCarousel from "@/components/shared/ImageCarousel"
import { FiClock } from "react-icons/fi"
import Spinner from "@/components/shared/Spinner"
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"
import { MdLocalOffer } from "react-icons/md"
import Overlay from "@/components/layout/Overlay"
import Input from "@/components/shared/Input"
import { GoArrowRight } from "react-icons/go"
import Login from "@/components/shared/Login"
import axios from "axios"
import { toast } from "react-toastify"

const actionLinksConfig = {
  mobileNumber: {
    icon: <IoCall className="size-[26px] fill-blue-400" />,
    urlPrefix: "tel:",
    label: "Connect on call",
  },
  instagram: {
    icon: <InstagramIcon className="size-[26px]" />,
    label: "Follow on Instagram",
  },
  whatsapp: {
    icon: <WhatsAppIcon className="size-[26px]" />,
    label: "Contact on WhatsApp",
  },
}

export default function ListingComponent({ listing, pageUrl }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      setNavigationIds({
        category: listing.category,
        listing: listing._id,
      })
    )
  }, [listing])

  const whatsAppShareUrl = () => {
    const content = [
      `*${listing.title}*`,
      ``,
      listing.date ? `🗓 ${dateString(listing.date)}` : null,
      listing.time ? `🕑 ${timeString(listing.time)}` : null,
      listing.location?.address ? `📍 ${listing.location.address}` : null,
      ``,
      listing?.about
        ? `${listing?.about?.slice(0, 150)?.replaceAll(/[\uD83C-􏰀-\uDFFF]+/gi, "")}${listing?.about?.length > 20 ? "..." : ""}`
        : null,
      ``,
      `Read more about this at ${pageUrl}`,
    ]

    const text = content
      .filter((i) => i !== null)
      .join("\n")
      .replace("\n\n\n", "\n\n")

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
  }

  const size = Math.min(getWindow()?.innerWidth || 400, 512)
  const areLinksAvailable = listing?.actionLinks && Object.values(listing.actionLinks).some(Boolean)

  return (
    <div>
      <div className="relative">
        <div
          className="absolute w-full h-full left-0 top-0 blur-[10rem] bg-cover bg-no-repeat -z-[1]"
          style={{ backgroundImage: `url(${listing.thumbnail})` }}
        />

        {listing.covers?.[0] ? (
          <ImageCarousel
            imageUrls={listing.covers}
            aspectRatio={listing.coverAspectRatio}
            aesthetic={true}
            style={{ height: `${size}px` }}
            className={listing.coverAspectRatio === "4/5" ? "mx-auto !w-auto rounded-2xl" : ""}
          />
        ) : (
          <Image
            src={listing.thumbnail}
            className="mx-auto w-auto rounded-2xl opacity-0"
            onLoad={(e) => {
              const aspectRatio = e.target.naturalWidth / e.target.naturalHeight
              e.target.style.height = `${size}px`
              e.target.style.aspectRatio = aspectRatio

              if (Math.floor(aspectRatio) >= 1) {
                e.target.style.objectFit = "cover"
                e.target.classList.remove("rounded-2xl")
              } else e.target.style.scale = 0.95

              e.target.classList.remove("opacity-0")
              e.target.scrollIntoView({ behavior: "instant" })
            }}
            alt="cover"
            width={size}
            height={size}
          />
        )}
      </div>

      <div className="px-hr pb-6 space-y-8">
        <h1 className="text-2xl my-6 font-semibold">{listing?.title}</h1>

        {listing?.food?.rating > 0 && (
          <div className="flex items-center gap-2">
            <StarRatingDisplay rating={listing.food.rating} />
            <span className="text-sm opacity-60">
              {listing.food.rating.toFixed(1)} ({listing.food.reviewCount || 0} review{listing.food.reviewCount !== 1 ? "s" : ""})
            </span>
          </div>
        )}

        <div className="space-y-6">
          {listing?.categoryName && listing?.subCategoryName ? (
            <div className="flex items-center gap-4">
              <BiCategory size={24} className="opacity-50 shrink-0" />
              <div className="flex truncate">
                {[listing?.categoryName, listing?.subCategoryName]
                  .filter(Boolean)
                  .map((i, idx) => (
                    <span
                      key={i}
                      className={clsx(
                        "block px-3 first:pl-0 last:pr-0 border-white/80 even:border-l-[0.25px]",
                        idx === 1 ? "truncate" : null
                      )}
                    >
                      {i}
                    </span>
                  ))}
              </div>
            </div>
          ) : null}

          {(listing?.date || listing?.time) && (
            <div className="flex items-center gap-4">
              {listing?.date && listing?.time ? (
                <LuCalendarClock size={24} className="opacity-50 shrink-0" />
              ) : listing?.date ? (
                <LuCalendar size={24} className="opacity-50 shrink-0" />
              ) : (
                <FiClock size={24} className="opacity-50 shrink-0" />
              )}

              <div className="flex">
                {[dateString(listing?.date), timeString(listing?.time)]
                  .filter(Boolean)
                  .map((i) => (
                    <span
                      key={i}
                      className="block px-3 first:pl-0 last:pr-0 border-white/80 even:border-l-[0.25px]"
                    >
                      {i}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {listing?.location && (
            <div>
              <div className="flex gap-4">
                <HiOutlineLocationMarker size={24} className="opacity-50 shrink-0" />
                <div>
                  {listing.location?.address && <span>{listing.location.address}</span>}
                  {listing.location?.googleMapLink && (
                    <Link
                      href={listing.location.googleMapLink}
                      target="_blank"
                      className="mt-2 w-fit whitespace-nowrap flex items-center gap-2 rounded-xl bg-secondary border border-secondary-border py-2 px-3 pr-4"
                    >
                      <GoogleMapsIcon className={"size-5 shrink-0"} />
                      <span>Get Directions</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {listing?.about && (
          <div>
            <span className="text-lg font-semibold">About</span>
            <About content={listing.about} />
          </div>
        )}

        {listing?.food?.openingHours && Object.values(listing.food.openingHours).some((h) => h?.open) && (
          <OpeningHours hours={listing.food.openingHours} />
        )}

        {listing?.offers?.length > 0 && <OffersSection offers={listing.offers} />}

        {listing?.menu?.length > 0 && <MenuSection items={listing.menu} />}

        {listing?.type === "food" && <ReviewsSection listing={listing} />}

        <div>
          <span className="text-lg font-semibold block mb-5">
            {[areLinksAvailable ? "Connect" : null, listing?.targetSharingCount ? null : "Share"]
              .filter(Boolean)
              .join(" & ")}
          </span>

          {areLinksAvailable && (
            <div className="border border-secondary-border flex items-center justify-between py-5 bg-secondary rounded-xl">
              {(() => {
                const configKeys = Object.keys(actionLinksConfig)
                return Object.keys(listing.actionLinks)
                  .sort((a, b) => configKeys.indexOf(a) - configKeys.indexOf(b))
                  .map((key, index, all) => {
                    const { urlPrefix = "", icon, label } = actionLinksConfig[key] || {}
                    return (
                      <Link
                        key={key}
                        href={`${urlPrefix}${listing.actionLinks[key]}`}
                        className={clsx(
                          "flex-1 flex justify-center",
                          index !== all.length - 1 && "border-r border-r-secondary-border",
                          all.length === 1 ? "justify-start px-5 gap-5" : null
                        )}
                      >
                        {icon}
                        {all.length === 1 && <span className="capitalize">{label}</span>}
                      </Link>
                    )
                  })
              })()}
            </div>
          )}

          {!listing?.targetSharingCount && (
            <ListingActionLink
              url={whatsAppShareUrl()}
              label={"Share on WhatsApp"}
              leftIcon={<WhatsAppIcon className={"size-[25px] shrink-0"} />}
              rightIcon={<PiArrowBendDoubleUpRight className="size-6" />}
              className="mt-2"
            />
          )}
        </div>

        {listing?.targetSharingCount && <ShareForRewards {...{ listing, whatsAppShareUrl }} />}
      </div>

      {listing.googleFormUrl && (
        <div className="mt-2">
          <span className="text-lg font-semibold block mb-5 px-hr">Google Form</span>
          <iframe src={listing.googleFormUrl} className="block w-full h-screen" />
        </div>
      )}

      {listing?.customActionLink?.url && (
        <div className="px-hr pt-2 pb-7 sticky bottom-0 left-0 bg-background w-full">
          <ListingActionLink
            url={listing.customActionLink.url}
            label={<b>{listing.customActionLink.label}</b>}
            className="!bg-accent-foreground !text-accent !rounded-full !p-4"
            labelCentered={true}
          />
        </div>
      )}
    </div>
  )
}

const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

function StarRatingDisplay({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        if (n <= Math.floor(rating)) return <TiStarFullOutline key={n} size={size} className="text-yellow-400" />
        if (n - rating < 1 && n - rating > 0) return <TiStarHalfOutline key={n} size={size} className="text-yellow-400" />
        return <TiStarOutline key={n} size={size} className="opacity-30" />
      })}
    </div>
  )
}

function OpeningHours({ hours }) {
  const today = new Date().toLocaleString("en-US", { weekday: "short" }).toLowerCase().slice(0, 3)
  return (
    <div>
      <span className="text-lg font-semibold block mb-3">Opening Hours</span>
      <div className="bg-secondary border border-secondary-border rounded-xl overflow-hidden">
        {DAY_KEYS.filter((d) => hours[d]?.open).map((day) => (
          <div
            key={day}
            className={clsx(
              "flex justify-between px-4 py-2.5 border-b border-secondary-border last:border-0 text-sm",
              day === today ? "bg-primary/10 font-semibold" : ""
            )}
          >
            <span className={day === today ? "text-primary" : "opacity-70"}>{DAY_LABELS[day]}</span>
            <span className="opacity-80">{hours[day].open}{hours[day].close ? ` – ${hours[day].close}` : ""}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OffersSection({ offers }) {
  return (
    <div>
      <span className="text-lg font-semibold block mb-3">Offers</span>
      <div className="scroll-container flex gap-3">
        {offers.map((offer) => (
          <div key={offer._id} className="scroll-element shrink-0 bg-secondary border border-secondary-border rounded-xl p-4 space-y-1 min-w-[200px]">
            <div className="flex items-start gap-2">
              <MdLocalOffer className="size-5 text-yellow-400 shrink-0 mt-0.5" />
              <span className="font-semibold text-sm">{offer.title}</span>
            </div>
            {offer.discount && (
              <span className="inline-block bg-yellow-400/10 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full border border-yellow-400/20">
                {offer.discount}
              </span>
            )}
            {offer.description && <p className="text-xs opacity-60">{offer.description}</p>}
            {offer.validTo && (
              <p className="text-xs opacity-40">Valid till {new Date(offer.validTo).toLocaleDateString("en-IN")}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function MenuSection({ items }) {
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || "Menu"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  return (
    <div>
      <span className="text-lg font-semibold block mb-3">Menu</span>
      <div className="space-y-4">
        {Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat}>
            <span className="text-sm font-semibold opacity-50 uppercase tracking-widest block mb-2">{cat}</span>
            <div className="bg-secondary border border-secondary-border rounded-xl overflow-hidden">
              {catItems.map((item, idx) => (
                <div key={item._id} className={clsx("flex items-center gap-3 px-4 py-3 text-sm", idx < catItems.length - 1 && "border-b border-secondary-border")}>
                  <span className={clsx("size-3 rounded-sm border shrink-0", item.dietType === "veg" ? "border-green-500" : "border-red-500")}>
                    <span className={clsx("block size-1.5 rounded-full m-0.5", item.dietType === "veg" ? "bg-green-500" : "bg-red-500")} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium block">{item.name}</span>
                    {item.description && <p className="text-xs opacity-50 truncate">{item.description}</p>}
                  </div>
                  <span className="font-semibold shrink-0">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewsSection({ listing }) {
  const [reviews, setReviews] = useState(listing.reviews || [])
  const [form, setForm] = useState({ rating: 0, userName: "", comment: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const setField = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.rating) return toast.error("Please select a rating")
    setSubmitting(true)
    try {
      await axios.post(`/api/review/${listing.slug}`, form)
      setSubmitted(true)
      toast.success("Review submitted! It will appear after approval.")
      setForm({ rating: 0, userName: "", comment: "" })
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review")
    }
    setSubmitting(false)
  }

  return (
    <div>
      <span className="text-lg font-semibold block mb-3">Reviews</span>

      {reviews.length > 0 ? (
        <div className="space-y-3 mb-6">
          {reviews.map((r) => (
            <div key={r._id} className="bg-secondary border border-secondary-border rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{r.userName || "Anonymous"}</span>
                <StarRatingDisplay rating={r.rating} size={14} />
              </div>
              {r.comment && <p className="text-sm opacity-70">{r.comment}</p>}
              <p className="text-xs opacity-40">{new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm opacity-50 mb-4">No reviews yet. Be the first to review!</p>
      )}

      {submitted ? (
        <p className="text-sm opacity-60 bg-secondary border border-secondary-border rounded-xl p-4">
          Thanks for your review! It will appear after admin approval.
        </p>
      ) : (
        <div className="bg-secondary border border-secondary-border rounded-xl p-4 space-y-3">
          <span className="text-sm font-semibold block">Write a Review</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setForm((prev) => ({ ...prev, rating: n }))}>
                {n <= form.rating ? (
                  <TiStarFullOutline size={28} className="text-yellow-400" />
                ) : (
                  <TiStarOutline size={28} className="opacity-30" />
                )}
              </button>
            ))}
          </div>
          <Input label="Your name (optional)" value={form.userName} onChange={setField("userName")} />
          <div>
            <label className="text-sm opacity-60 block mb-1">Comment (optional)</label>
            <textarea
              rows={3}
              value={form.comment}
              onChange={setField("comment")}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none resize-none"
            />
          </div>
          <button
            disabled={submitting || !form.rating}
            onClick={handleSubmit}
            className="input-component justify-center bg-white text-black w-full text-center disabled:opacity-40"
          >
            <span>{submitting ? "Submitting..." : "Submit Review"}</span>
            <GoArrowRight className="size-4.5" />
          </button>
        </div>
      )}
    </div>
  )
}

function About({ content: _content }) {
  const [showAbout, setShowAbout] = useState(false)
  const content = showAbout ? _content : _content.slice(0, 140)

  return (
    <div className={"mt-5"} onClick={() => setShowAbout((i) => !i)}>
      {content.split("\n").map((i, index, arr) => (
        <React.Fragment key={"listing-about:" + index}>
          <p>
            {i}
            {index === arr.length - 1 && !showAbout ? (
              <span className="opacity-50">{_content.length >= 140 ? "...more" : ""}</span>
            ) : null}
          </p>
          {index < arr.length - 1 ? <br /> : null}
        </React.Fragment>
      ))}
    </div>
  )
}

function ShareForRewards({ listing, whatsAppShareUrl }) {
  const [isWaiting, setIsWaiting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shareProgress, setShareProgress] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const userState = useAppSelector((state) => state.user)

  const onShare = () => {
    setIsWaiting(true)
    setTimeout(() => {
      setIsWaiting(false)
      const count = shareProgress + 1
      setShareProgress(count)

      if (count === listing.targetSharingCount && userState?.token) handleClaimingReward()
    }, 8000)
  }

  const isComplete = shareProgress === listing.targetSharingCount

  const handleClaimingReward = async (token) => {
    setIsLoading(true)
    try {
      await axios.post(`/api/user/reward`, {
        headers: {
          Authentication: "Bearer " + (token || userState.token),
        },
        data: {
          listing: listing._id,
        },
      })
    } catch (error) {
      if (error.status !== 500) toast.error(error.response.data?.error)
      console.error(error)
    }
    setIsLoading(false)
  }

  const onLoginSuccess = async (token) => {
    setShowLoginModal(false)
    handleClaimingReward(token)
  }

  return (
    <div>
      <div className="mb-5 clear-start">
        <span className="text-lg font-semibold block">Unlock Your Reward</span>
      </div>

      <button
        disabled={isLoading || isWaiting}
        className={
          "text-left relative rounded-xl overflow-hidden mt-2 disabled:pointer-events-none w-full"
        }
        onClick={!isComplete ? onShare : !userState.token ? () => setShowLoginModal(true) : null}
      >
        {isLoading ? (
          <div className="border border-secondary-border rounded-xl flex gap-4 p-5 bg-secondary">
            <Spinner className="size-6 border-yellow-400 shrink-0" />
            <span className="opacity-50">Loading...</span>
          </div>
        ) : isComplete ? (
          !userState.token ? (
            <div className="border border-secondary-border rounded-xl flex gap-4 p-5 bg-secondary">
              <TiStarFullOutline className="size-6 text-yellow-400 shrink-0" />
              <span>Login to view reward</span>
            </div>
          ) : (
            <div className="border border-secondary-border rounded-xl flex gap-4 p-5 bg-secondary">
              <TiStarFullOutline className="size-6 text-yellow-400 shrink-0" />
              <span className="block flex-1 font-mono tracking-widest">SHANH500</span>
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard.writeText("SHANH500")
                  toast.success("Coupon copied successfully")
                }}
              >
                <IoCopyOutline className="size-6 shrink-0 opacity-60" />
              </button>
            </div>
          )
        ) : (
          <ListingActionLink
            url={whatsAppShareUrl()}
            label={"Share on WhatsApp"}
            leftIcon={
              <span className={"text-xl font-semibold text-yellow-400 shrink-0"}>
                {listing.targetSharingCount}x
              </span>
            }
            rightIcon={
              isWaiting ? (
                <Spinner className="size-6 border-white" />
              ) : (
                <PiArrowBendDoubleUpRight className="size-6" />
              )
            }
          />
        )}

        <div className="h-1 w-full absolute left-0 bottom-0 flex bg-primary/15">
          <span
            className="rounded-full bg-yellow-400 block w-[0%] transition-all duration-1000 ease-out"
            style={{ width: (shareProgress * 100) / listing.targetSharingCount + "%" }}
          />
        </div>
      </button>

      {!isComplete && (
        <span className="text-sm opacity-60 block mt-3">
          {listing.targetSharingCount} shares remaining to unlock your reward.
        </span>
      )}

      {showLoginModal && (
        <Login onSuccess={onLoginSuccess} close={() => setShowLoginModal(false)} />
      )}
    </div>
  )
}
