import connectToDB from "@/lib/db"
import offerModel from "@/lib/models/offer.model"
import listingModel from "@/lib/models/listing.model"
import { verifyToken } from "@/lib/utils/jwt"
import { NextResponse } from "next/server"

const authenticate = (req) => {
  const auth = req.headers.get("authorization") || ""
  return verifyToken(auth.replace("Bearer ", ""))
}

export const GET = async (req, { params }) => {
  try {
    await connectToDB()
    const { listingId } = await params
    const listing = await listingModel.findOne({ slug: listingId }).select("_id")
    const id = listing?._id || listingId

    const offers = await offerModel.find({ listing: id, isActive: true, validTo: { $gte: new Date() } })
    return NextResponse.json(offers)
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

    let offer
    if (body._id) {
      offer = await offerModel.findByIdAndUpdate(body._id, { ...body, listing: listingObjectId }, { new: true })
    } else {
      offer = await offerModel.create({ ...body, listing: listingObjectId })
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const DELETE = async (req) => {
  try {
    const user = authenticate(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectToDB()
    const offerId = req.nextUrl.searchParams.get("offerId")
    if (!offerId) return NextResponse.json({ error: "offerId required" }, { status: 400 })

    await offerModel.findByIdAndDelete(offerId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
