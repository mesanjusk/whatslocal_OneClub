"use client"

import { getWindow } from "@/lib/utils/getWindow"
import { useEffect, useRef } from "react"
import { HiLocationMarker } from "react-icons/hi"

export default function Header() {
  const headerRef = useRef(null)

  useEffect(() => {
    if (!getWindow() || !headerRef.current) return
    const controller = new AbortController()
    const signal = controller.signal

    const handleScroll = () => {
      const isScrolled = getWindow().scrollY > 0
      headerRef.current?.classList.toggle("bg-background/70", isScrolled)
      headerRef.current?.classList.toggle("backdrop-blur-3xl", isScrolled)
    }

    getWindow().addEventListener("scroll", handleScroll, { signal })
    return () => controller.abort()
  }, [])

  return (
    <header
      ref={headerRef}
      className="sticky -top-[1px] flex justify-between items-center px-hr py-5 z-[1000] transition-all duration-300 ease-in-out"
    >
      <div className="w-full flex items-center gap-2">
        <div className="h-8 overflow-hidden font-bold text-2xl w-full tracking-tight">
          <span className="block whitespace-nowrap">WhatsLocal</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <HiLocationMarker className="text-white" size={22} />
        <span>Gondia</span>
      </div>
    </header>
  )
}
