import React, { useState } from "react"
import Overlay from "../layout/Overlay"
import Input from "./Input"
import Spinner from "./Spinner"
import { GoArrowRight } from "react-icons/go"
import OTPInput from "./OTPInput"
import { toast } from "react-toastify"
import axios from "axios"
import { IoMdClose } from "react-icons/io"
import { getWindow } from "@/lib/utils/getWindow"
import { useAppDispatch } from "@/lib/store/hooks"
import { setUser } from "@/lib/store/slices/userSlice"

export default function Login({ onSuccess, close }) {
  const [state, setState] = useState({})
  const [flags, setflags] = useState({})
  const [otp, setOtp] = useState(["", "", "", ""])
  const dispatch = useAppDispatch()

  const sendOTP = () => {
    if (!getWindow()?.sendOtp)
      return toast.error("An error occured. Please refresh the page to login!")
    setflags({ sending: true })
    getWindow()?.sendOtp?.(
      `91${state.mobileNumber}`,
      (data) => {
        toast.info("OTP sent successfully")
        setState((prev) => ({ ...prev, reqId: data.message }))
        setflags({ sent: true })
      },
      (error) => {
        toast.error(error.message)
        setflags({})
      }
    )
  }

  const verifyOTP = () => {
    if (otp.join("").length < 4) return
    setflags({ sent: true, verifying: true })
    getWindow()?.verifyOtp(
      parseInt(otp.join("")),
      async (data) => {
        try {
          const response = await axios.post("/api/user/otp/verify_token", {
            accessToken: data.message,
            mobileNumber: state.mobileNumber,
          })
          if (response.data.success) {
            toast.success("OTP verified, login successful!")
            dispatch(
              setUser({
                mobileNumber: state.mobileNumber,
                token: response.data.token,
              })
            )
            onSuccess(response.data.token)
          } else throw new Error()
        } catch (error) {
          setflags({ sent: true })
          toast.error("Login failed, please try again!")
        }
      },
      (error) => {
        toast.error(error.message)
        setflags({ sent: true })
      },
      state.reqId
    )
  }

  return (
    <Overlay className="bg-black/50">
      <div className="w-[94%] p-4 mx-auto bg-secondary rounded-xl absolute left-1/2 top-1/2 -translate-1/2 border border-border">
        <div className="mt-2 relative">
          <span className="font-bold text-xl block text-center">Login with OTP</span>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" onClick={close}>
            <IoMdClose className="size-5" />
          </button>
        </div>
        <div className="mt-6 mb-4">
          {flags?.sent ? (
            <>
              <div className="block mb-2 text-sm text-center opacity-50">
                <span>OTP sent to mobile number {state.mobileNumber}</span>
                <button
                  className="ml-2 underline cursor-pointer"
                  onClick={() => {
                    setState((prev) => ({ mobileNumber: prev.mobileNumber }))
                    setOtp((prev) => prev.map((_) => ""))
                    setflags({})
                  }}
                >
                  Change?
                </button>
              </div>
              <OTPInput otp={otp} setOtp={setOtp} />
            </>
          ) : (
            <Input
              label={"Mobile number"}
              prefix={"+91"}
              labelClassName={"block"}
              value={state.mobileNumber}
              name="mobileNumber"
              onChange={(e) => {
                if (/^\d{0,10}$/.test(e.target.value)) {
                  setState((prev) => ({ ...prev, mobileNumber: e.target.value }))
                }
              }}
            />
          )}
        </div>
        <button
          disabled={flags.sending || flags?.verifying}
          onClick={flags.sent ? verifyOTP : sendOTP}
          className="input-component justify-center bg-white text-black w-full text-center mt-2"
        >
          <span>
            {flags.verifying
              ? "Verifying..."
              : flags.sent
              ? "Verify OTP"
              : flags.sending
              ? "Sending..."
              : "Send OTP"}
          </span>
          {flags.sending ? <Spinner className="size-4.5" /> : <GoArrowRight className="size-4.5" />}
        </button>
      </div>
    </Overlay>
  )
}
