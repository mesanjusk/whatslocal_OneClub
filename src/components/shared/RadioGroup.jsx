import clsx from "clsx"
import React from "react"
import LabelWrapper from "./LabelWrapper"

export default function RadioGroup({ isSmall, isRounded, options = [], value, setValue, label }) {
  const hPosition = value ? (options.findIndex((i) => i.value === value) * 100) / options.length : 0

  return (
    <LabelWrapper label={label}>
      <div
        className={clsx(
          "overflow-hidden flex border border-border relative",
          isRounded ? "rounded-full" : "rounded-lg",
          isSmall ? "text-sm w-fit" : null
        )}
      >
        {options.map((i) => (
          <button
            key={i.value}
            type="button"
            onClick={() => setValue(i.value)}
            className={clsx(
              "flex-1 px-4 text-sm",
              isSmall ? "py-2.5" : "py-3.5",
              value === i.value ? "text-black" : null
            )}
          >
            {i.label}
          </button>
        ))}
        <div className={clsx("h-full w-full absolute top-0 z-[-1]", !isSmall ? "p-[3px]" : "")}>
          <div className="w-full h-full relative">
            <div
              className={clsx(
                "bg-primary transition-all duration-300 h-full absolute",
                isRounded ? "rounded-full" : "rounded-md"
              )}
              style={{
                width: 100 / options.length + "%",
                left: hPosition + "%",
              }}
            />
          </div>
        </div>
      </div>
    </LabelWrapper>
  )
}
