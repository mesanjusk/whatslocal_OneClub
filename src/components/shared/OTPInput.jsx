import { useRef } from "react"

export default function OTPInput({ otp, setOtp }) {
  const refs = useRef([])

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < otp.length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData("text")
    if (!/^\d+$/.test(paste)) return
    const newOtp = [...otp]
    for (let i = 0; i < otp.length && i < paste.length; i++) {
      newOtp[i] = paste[i]
    }
    setOtp(newOtp)
    refs.current[Math.min(paste.length, otp.length) - 1]?.focus()
  }

  return (
    <div className="flex justify-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (refs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-14 h-14 text-center text-xl font-semibold rounded-lg border border-border bg-background focus:bg-secondary focus:outline-none"
        />
      ))}
    </div>
  )
}
