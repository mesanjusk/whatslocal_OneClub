import React from "react"

export default function LabelWrapper({ label, className, children, required, ...props }) {
  if (!label) return children

  return (
    <label className={className} {...props}>
      <span className="block mb-1.5 text-sm">
        <span className="opacity-60">{label}</span>
        {required ? <span className="text-red-400"> *</span> : ""}
      </span>
      {children}
    </label>
  )
}
