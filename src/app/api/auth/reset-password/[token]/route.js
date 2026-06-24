import connectToDB from "@/lib/db"
import userModel from "@/lib/models/user.model"
import { signToken } from "@/lib/utils/jwt"
import { NextResponse } from "next/server"

export const POST = async (req, { params }) => {
  try {
    await connectToDB()
    const { token } = await params
    const { password } = await req.json()

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    const authToken = signToken({ id: user._id, role: user.role }, "30d")

    return NextResponse.json({
      success: true,
      token: authToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
