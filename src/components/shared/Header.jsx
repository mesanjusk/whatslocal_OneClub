"use client"

import { getWindow } from "@/lib/utils/getWindow"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { HiLocationMarker } from "react-icons/hi"
import { LuUser } from "react-icons/lu"
import { useAppSelector } from "@/lib/store/hooks"

export default function Header() {
  const headerRef = useRef(null)
  const user = useAppSelector(s => s.user)

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
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <HiLocationMarker className="text-white" size={18} />
          <span className="text-sm">Gondia</span>
        </div>
        {user?.token ? (
          <Link href="/dashboard"
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 rounded-full px-2.5 py-1 transition-colors">
            <LuUser size={14} />
            <span className="text-xs font-semibold truncate max-w-[60px]">{user.name?.split(" ")[0] || "Me"}</span>
          </Link>
        ) : (
          <Link href="/login"
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 rounded-full px-2.5 py-1.5 text-xs font-bold transition-colors">
            <LuUser size={14} />
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
