import connectToDB from "@/lib/db"
import inquiryModel from "@/lib/models/inquiry.model"
import { NextResponse } from "next/server"

export const POST = async (req) => {
  try {
    await connectToDB()
    const { restaurantId, restaurantName, name, mobile, message } = await req.json()
    if (!restaurantId || !name || !mobile || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }
    await inquiryModel.create({ restaurantId, restaurantName, name, mobile, message })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const GET = async (req) => {
  try {
    await connectToDB()
    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")
    const query = restaurantId ? { restaurantId } : {}
    const inquiries = await inquiryModel.find(query).sort({ createdAt: -1 }).limit(100)
    return NextResponse.json(inquiries)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
