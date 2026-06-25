"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function SplashScreen() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show only on fresh page load (not on client-side navigation)
    if (!sessionStorage.getItem("splashShown")) {
      sessionStorage.setItem("splashShown", "1")
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2500)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src="/logo.png"
                alt="WhatsLocal"
                width={96}
                height={96}
                className="rounded-2xl shadow-xl"
                onError={(e) => { e.currentTarget.style.display = "none" }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="text-5xl font-black text-black tracking-tight"
            >
              Hello Gondia!!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
              className="text-xl font-medium text-black/80 flex items-center gap-1"
            >
              Let&apos;s order
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
              >
                →
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
