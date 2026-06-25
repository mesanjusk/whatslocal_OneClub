import connectToDB from "@/lib/db"
import userModel from "@/lib/models/user.model"
import { signToken } from "@/lib/utils/jwt"
import { NextResponse } from "next/server"

export const POST = async (req) => {
  try {
    await connectToDB()
    const { email, mobile, password } = await req.json()
    const identifier = email || mobile

    if (!identifier || !password) {
      return NextResponse.json({ error: "Mobile/email and password are required" }, { status: 400 })
    }

    const user = await userModel.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Account is disabled" }, { status: 403 })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = signToken({ id: user._id, role: user.role }, "30d")

    return NextResponse.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
