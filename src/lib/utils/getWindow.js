"use client"

export const getWindow = () => {
  try {
    if (typeof window !== "undefined") return window
  } catch (error) {}
  return null
}
