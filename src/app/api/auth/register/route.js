import connectToDB from "@/lib/db"
import userModel from "@/lib/models/user.model"
import { signToken } from "@/lib/utils/jwt"
import { NextResponse } from "next/server"

export const POST = async (req) => {
  try {
    await connectToDB()
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    const exists = await userModel.findOne({ email: email.toLowerCase() })
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const user = await userModel.create({ name, email: email.toLowerCase(), phone, password })
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
