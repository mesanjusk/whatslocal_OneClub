import clsx from "clsx"
import Link from "next/link"

export default function ListingActionLink({
  url,
  leftIcon,
  label,
  rightIcon,
  className,
  labelCentered,
}) {
  return (
    <Link
      href={url}
      target="_blank"
      className={clsx(
        "w-full border border-secondary-border flex items-center justify-between p-5 bg-secondary rounded-xl gap-5 ",
        className
      )}
    >
      <div className="flex gap-5 items-center flex-1">
        {leftIcon}
        {
          <span
            className={clsx("block whitespace-nowrap w-full", labelCentered ? "text-center" : "")}
          >
            {label}
          </span>
        }
      </div>
      {rightIcon}
    </Link>
  )
}
