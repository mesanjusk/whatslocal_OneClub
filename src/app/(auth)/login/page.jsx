"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { useAppDispatch } from "@/lib/store/hooks"
import { setUser } from "@/lib/store/slices/userSlice"
import { LuSmartphone, LuLock, LuEye, LuEyeOff } from "react-icons/lu"

export default function LoginPage() {
  const router   = useRouter()
  const dispatch = useAppDispatch()
  const [form, setForm]       = useState({ mobile: "", password: "" })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { data } = await axios.post("/api/auth/login", {
        mobile: form.mobile,
        password: form.password,
      })
      dispatch(setUser({ name: data.user.name, email: data.user.email, role: data.user.role, token: data.token }))
      router.push("/recommended")
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">WhatsLocal</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome back to Gondia&apos;s food app</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Sign in</h2>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Mobile */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3.5 py-3 border border-transparent focus-within:border-[#e23744]/40">
              <LuSmartphone size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                inputMode="tel"
                placeholder="Mobile number"
                value={form.mobile}
                onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                required
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3.5 py-3 border border-transparent focus-within:border-[#e23744]/40">
              <LuLock size={18} className="text-gray-400 shrink-0" />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button type="button" onClick={() => setShowPwd(p => !p)} className="shrink-0">
                {showPwd ? <LuEyeOff size={16} className="text-gray-400" /> : <LuEye size={16} className="text-gray-400" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e23744] text-white font-bold rounded-xl py-3.5 text-sm disabled:opacity-60 transition-all active:scale-[0.98]"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#e23744] hover:underline">
              Register
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/recommended" className="underline underline-offset-2">
            Continue without signing in
          </Link>
        </p>
      </div>
    </div>
  )
}
