import connectToDB from "@/lib/db"
import visitorModel from "@/lib/models/visitor.model"
import { NextResponse } from "next/server"

export const POST = async (req) => {
  try {
    await connectToDB()
    const { deviceId } = await req.json()
    await visitorModel.findOneAndUpdate(
      { deviceId },
      { $inc: { accessCount: 1 } },
      { upsert: true, setDefaultsOnInsert: true }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
