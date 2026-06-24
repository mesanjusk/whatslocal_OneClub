"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LuShoppingCart, LuHistory, LuThumbsUp, LuHome } from "react-icons/lu"

const NAV_ITEMS = [
  { label: "Home",        href: "/home",        icon: LuHome },
  { label: "Recommended", href: "/recommended", icon: LuThumbsUp },
  { label: "Cart",        href: "/cart",        icon: LuShoppingCart },
  { label: "History",     href: "/history",     icon: LuHistory },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-[999]"
      style={{
        background: "#fff",
        borderTop: "1px solid #f0f0f0",
        borderRadius: "16px 16px 0 0",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        height: 70,
      }}
    >
      <div className="grid grid-cols-4 h-full">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-1 select-none"
            >
              {/* Sliding top indicator */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="active-bar"
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full"
                    style={{ background: "#e23744" }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <motion.div
                animate={{
                  scale: active ? 1.18 : 1,
                  y: active ? -1 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.7}
                  style={{ color: active ? "#e23744" : "#9ca3af", transition: "color 0.2s ease" }}
                />
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{ color: active ? "#e23744" : "#9ca3af" }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: 10,
                  fontWeight: active ? 700 : 500,
                  letterSpacing: "0.03em",
                  lineHeight: 1,
                }}
              >
                {label}
              </motion.span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
