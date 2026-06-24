import connectToDB from "@/lib/db"
import menuItemModel from "@/lib/models/menu.model"
import listingModel from "@/lib/models/listing.model"
import { verifyToken } from "@/lib/utils/jwt"
import { NextResponse } from "next/server"

const authenticate = (req) => {
  const auth = req.headers.get("authorization") || ""
  const token = auth.replace("Bearer ", "")
  return verifyToken(token)
}

export const GET = async (req, { params }) => {
  try {
    await connectToDB()
    const { listingId } = await params
    const listing = await listingModel.findOne({ slug: listingId }).select("_id")
    const id = listing?._id || listingId

    const items = await menuItemModel.find({ listing: id }).sort({ sortOrder: 1, name: 1 })
    return NextResponse.json(items)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const POST = async (req, { params }) => {
  try {
    const user = authenticate(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectToDB()
    const { listingId } = await params
    const body = await req.json()

    const listing = await listingModel.findOne({ slug: listingId }).select("_id")
    const listingObjectId = listing?._id || listingId

    let item
    if (body._id) {
      item = await menuItemModel.findByIdAndUpdate(body._id, { ...body, listing: listingObjectId }, { new: true })
    } else {
      item = await menuItemModel.create({ ...body, listing: listingObjectId })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const DELETE = async (req, { params }) => {
  try {
    const user = authenticate(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectToDB()
    const itemId = req.nextUrl.searchParams.get("itemId")
    if (!itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 })

    await menuItemModel.findByIdAndDelete(itemId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
