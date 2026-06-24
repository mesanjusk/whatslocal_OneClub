import clsx from "clsx"
import React from "react"

export default function Spinner({ className }) {
  return (
    <span
      className={clsx(
        "block w-5 h-5 border-4 border-border border-r-border/50 border-b-border/50 rounded-full animate-spin",
        className
      )}
    />
  )
}
