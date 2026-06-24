import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react"
import { HiCheck, HiChevronDown } from "react-icons/hi"
import clsx from "clsx"
import { useState } from "react"
import LabelWrapper from "./LabelWrapper"
import { IoCloseOutline } from "react-icons/io5"

export default function ComboBox({
  options,
  label,
  value,
  setValue,
  isClearable,
  error,
  required,
}) {
  const [query, setQuery] = useState("")

  const filteredPeople =
    query === ""
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <div>
      <div className="flex gap-2 items-end">
        <LabelWrapper label={label} className={"flex-1"} required={required}>
          <Combobox
            value={value}
            onChange={(value) => setValue(value)}
            onClose={() => setQuery("")}
          >
            <ComboboxButton className="relative w-full">
              <ComboboxInput
                className={clsx(
                  "input-component w-full pr-8",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  error ? "!border-red-500 !bg-red-500/10" : null
                )}
                displayValue={(option) => option?.label}
                onChange={(event) => setQuery(event.target.value)}
              />
              <div className="group absolute inset-y-0 right-0 px-2.5 flex items-center">
                <HiChevronDown className="size-[18px] fill-white/60 group-data-[hover]:fill-white" />
              </div>
            </ComboboxButton>
            <ComboboxOptions
              anchor="bottom"
              transition
              className={clsx(
                "w-[var(--input-width)] rounded-lg border border-secondary-border bg-secondary p-1 [--anchor-gap:4px] empty:invisible",
                "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
              )}
            >
              {filteredPeople.map((option) => (
                <ComboboxOption
                  key={option.value}
                  value={option}
                  className="group flex cursor-default items-center justify-between gap-2 rounded-md py-2 px-3 select-none data-[focus]:bg-white/10"
                >
                  <div className="text-white">{option.label}</div>
                  <HiCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </LabelWrapper>
        {isClearable && (
          <button className="input-component" onClick={() => setValue({ value: null })}>
            <div className="size-6 flex items-center justify-center">
              <IoCloseOutline className="size-4.5 fill-white/60 group-data-[hover]:fill-white" />
            </div>
          </button>
        )}
      </div>
      {error && <small className="block mt-1 text-red-500">{error}</small>}
    </div>
  )
}
