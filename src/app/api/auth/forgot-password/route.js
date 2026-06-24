import connectToDB from "@/lib/db"
import userModel from "@/lib/models/user.model"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"
import { NextResponse } from "next/server"

export const POST = async (req) => {
  try {
    await connectToDB()
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Don't reveal whether the email exists
      return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." })
    }

    const token = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = token
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`

    await sendEmail({
      to: user.email,
      subject: "WhatsLocal — Password Reset",
      html: `
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password (valid for 1 hour):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    })

    return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
