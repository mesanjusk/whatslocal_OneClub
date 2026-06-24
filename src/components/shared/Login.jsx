"use client"

import React, { useState } from "react"
import Overlay from "../layout/Overlay"
import Input from "./Input"
import Spinner from "./Spinner"
import { GoArrowRight } from "react-icons/go"
import { toast } from "react-toastify"
import axios from "axios"
import { IoMdClose } from "react-icons/io"
import { useAppDispatch } from "@/lib/store/hooks"
import { setUser } from "@/lib/store/slices/userSlice"

const TABS = { LOGIN: "login", REGISTER: "register", FORGOT: "forgot" }

export default function Login({ onSuccess, close }) {
  const [tab, setTab] = useState(TABS.LOGIN)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const dispatch = useAppDispatch()

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleLogin = async () => {
    if (!form.email || !form.password) return toast.error("Email and password are required")
    setLoading(true)
    try {
      const { data } = await axios.post("/api/auth/login", { email: form.email, password: form.password })
      dispatch(setUser({ name: data.user.name, email: data.user.email, role: data.user.role, token: data.token }))
      toast.success("Logged in successfully!")
      onSuccess?.(data.token)
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed")
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return toast.error("Name, email and password are required")
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters")
    setLoading(true)
    try {
      const { data } = await axios.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
      dispatch(setUser({ name: data.user.name, email: data.user.email, role: data.user.role, token: data.token }))
      toast.success("Account created successfully!")
      onSuccess?.(data.token)
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed")
    }
    setLoading(false)
  }

  const handleForgot = async () => {
    if (!form.email) return toast.error("Email is required")
    setLoading(true)
    try {
      await axios.post("/api/auth/forgot-password", { email: form.email })
      setForgotSent(true)
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send reset email")
    }
    setLoading(false)
  }

  const handleSubmit = () => {
    if (tab === TABS.LOGIN) handleLogin()
    else if (tab === TABS.REGISTER) handleRegister()
    else handleForgot()
  }

  const tabLabel = { [TABS.LOGIN]: "Sign In", [TABS.REGISTER]: "Create Account", [TABS.FORGOT]: "Reset Password" }
  const btnLabel = loading
    ? "Please wait..."
    : { [TABS.LOGIN]: "Sign In", [TABS.REGISTER]: "Create Account", [TABS.FORGOT]: "Send Reset Link" }[tab]

  return (
    <Overlay className="bg-black/50">
      <div className="w-[94%] p-4 mx-auto bg-secondary rounded-xl absolute left-1/2 top-1/2 -translate-1/2 border border-border">
        <div className="mt-2 relative">
          <span className="font-bold text-xl block text-center">{tabLabel[tab]}</span>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" onClick={close}>
            <IoMdClose className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 mb-2 bg-background rounded-lg p-1">
          {[TABS.LOGIN, TABS.REGISTER].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setForm({}); setForgotSent(false) }}
              className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${tab === t ? "bg-secondary font-semibold" : "opacity-50"}`}
            >
              {t === TABS.LOGIN ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <div className="mt-4 mb-2 space-y-3">
          {tab === TABS.REGISTER && (
            <>
              <Input label="Full name" value={form.name || ""} onChange={set("name")} />
              <Input label="Phone (optional)" value={form.phone || ""} onChange={set("phone")} />
            </>
          )}

          {tab !== TABS.FORGOT ? (
            <>
              <Input label="Email" type="email" value={form.email || ""} onChange={set("email")} />
              <Input label="Password" type="password" value={form.password || ""} onChange={set("password")} />
            </>
          ) : forgotSent ? (
            <p className="text-sm text-center opacity-70 py-4">
              If that email is registered, a reset link has been sent. Check your inbox.
            </p>
          ) : (
            <Input label="Email" type="email" value={form.email || ""} onChange={set("email")} />
          )}
        </div>

        {tab === TABS.LOGIN && (
          <button
            className="text-xs opacity-50 underline block ml-auto mb-2"
            onClick={() => { setTab(TABS.FORGOT); setForm({}); setForgotSent(false) }}
          >
            Forgot password?
          </button>
        )}

        {tab === TABS.FORGOT && (
          <button
            className="text-xs opacity-50 underline block ml-auto mb-2"
            onClick={() => { setTab(TABS.LOGIN); setForm({}) }}
          >
            Back to Sign In
          </button>
        )}

        {!(tab === TABS.FORGOT && forgotSent) && (
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="input-component justify-center bg-white text-black w-full text-center mt-2"
          >
            <span>{btnLabel}</span>
            {loading ? <Spinner className="size-4.5" /> : <GoArrowRight className="size-4.5" />}
          </button>
        )}
      </div>
    </Overlay>
  )
}
