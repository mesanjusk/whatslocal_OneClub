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
import { TiStarFullOutline } from "react-icons/ti"
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
