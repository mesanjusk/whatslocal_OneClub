import React from "react"

export default function Overlay({ children, className = "" }) {
  return (
    <div
      className={
        "z-50 fixed top-0 left-1/2 w-full h-screen overflow-hidden max-w-lg -translate-x-1/2 " +
        " " +
        className
      }
    >
      {children}
    </div>
  )
}
