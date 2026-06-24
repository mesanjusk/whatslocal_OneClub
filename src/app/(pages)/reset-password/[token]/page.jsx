"use client"

import { use, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Input from "@/components/shared/Input"
import Spinner from "@/components/shared/Spinner"
import { GoArrowRight } from "react-icons/go"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/store/hooks"
import { setUser } from "@/lib/store/slices/userSlice"

export default function ResetPasswordPage({ params }) {
  const { token } = use(params)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!password || password.length < 6) return toast.error("Password must be at least 6 characters")
    if (password !== confirm) return toast.error("Passwords do not match")

    setLoading(true)
    try {
      const { data } = await axios.post(`/api/auth/reset-password/${token}`, { password })
      dispatch(setUser({ name: data.user.name, email: data.user.email, role: data.user.role, token: data.token }))
      toast.success("Password reset successfully!")
      setDone(true)
      setTimeout(() => router.push("/"), 2000)
    } catch (err) {
      toast.error(err.response?.data?.error || "Reset failed. The link may have expired.")
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="px-hr py-10 text-center">
        <p className="text-lg font-semibold">Password updated!</p>
        <p className="opacity-50 mt-2 text-sm">Redirecting you home...</p>
      </div>
    )
  }

  return (
    <div className="px-hr py-10 max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Set New Password</h1>
      <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Input label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      <button
        disabled={loading}
        onClick={handleSubmit}
        className="input-component justify-center bg-white text-black w-full text-center mt-2"
      >
        <span>{loading ? "Saving..." : "Set Password"}</span>
        {loading ? <Spinner className="size-4.5" /> : <GoArrowRight className="size-4.5" />}
      </button>
    </div>
  )
}
