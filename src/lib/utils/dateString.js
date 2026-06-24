import { getWindow } from "./getWindow"

export const dateString = (date, time, small) => {
  if (!date || !getWindow()) return null

  const options = {
    month: small ? "short" : "long",
    day: "numeric",
  }

  const Date = getWindow().Date

  const formattedDate = new Date(date).toLocaleString("en-US", options)

  if (!time) return formattedDate

  return [formattedDate, timeString(time, small)].join(small ? ", " : " | ")
}

function convertTime(timeValue) {
  let [hours, minutes] = timeValue.split(":").map(Number)
  let ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`
}

export const timeString = (time, small) =>
  time
    ? [time.from, time.to]
        .filter((i) => i)
        // .map(convertTime)
        .join(small ? "-" : " - ")
    : null
