"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LuShoppingCart, LuHistory, LuThumbsUp, LuLayoutGrid } from "react-icons/lu"

const NAV_ITEMS = [
  { label: "Cart",        href: "/cart",        icon: LuShoppingCart },
  { label: "History",     href: "/history",     icon: LuHistory },
  { label: "Recommended", href: "/recommended", icon: LuThumbsUp },
  { label: "4",           href: "/four",        icon: LuLayoutGrid },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-[999] bg-background/80 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 flex-1 py-1 relative"
            >
              {/* Active pill indicator */}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-orange-400"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              <motion.div
                animate={{ scale: active ? 1.15 : 1, y: active ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon
                  size={22}
                  className={active ? "text-orange-400" : "text-foreground/40"}
                  strokeWidth={active ? 2.2 : 1.6}
                />
              </motion.div>

              <span
                className={`text-[10px] font-medium tracking-wide transition-colors ${
                  active ? "text-orange-400" : "text-foreground/40"
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Safe area spacer for mobile */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  )
}
