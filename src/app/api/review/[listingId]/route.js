import connectToDB from "@/lib/db"
import reviewModel from "@/lib/models/review.model"
import listingModel from "@/lib/models/listing.model"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
  try {
    await connectToDB()
    const { listingId } = await params
    const listing = await listingModel.findOne({ slug: listingId }).select("_id")
    const id = listing?._id || listingId

    const reviews = await reviewModel.find({ listing: id, status: "approved" }).sort({ createdAt: -1 })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const POST = async (req, { params }) => {
  try {
    await connectToDB()
    const { listingId } = await params
    const body = await req.json()

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const listing = await listingModel.findOne({ slug: listingId }).select("_id")
    const listingObjectId = listing?._id || listingId

    await reviewModel.create({
      listing: listingObjectId,
      userName: body.userName,
      phone: body.phone,
      rating: body.rating,
      comment: body.comment,
      status: "pending",
    })

    return NextResponse.json({ success: true, message: "Review submitted and pending approval" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
