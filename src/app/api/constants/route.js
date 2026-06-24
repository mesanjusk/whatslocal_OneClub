import connectToDB from "@/lib/db"
import constantsModel from "@/lib/models/constants.model"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    await connectToDB()
    const result = await constantsModel.find()
    return NextResponse.json(result?.[0])
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
