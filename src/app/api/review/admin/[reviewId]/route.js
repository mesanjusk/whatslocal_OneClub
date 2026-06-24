import connectToDB from "@/lib/db"
import reviewModel from "@/lib/models/review.model"
import listingModel from "@/lib/models/listing.model"
import { verifyToken } from "@/lib/utils/jwt"
import { NextResponse } from "next/server"

export const PATCH = async (req, { params }) => {
  try {
    const auth = req.headers.get("authorization") || ""
    const user = verifyToken(auth.replace("Bearer ", ""))
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectToDB()
    const { reviewId } = await params
    const { status, adminNote } = await req.json()

    const review = await reviewModel.findByIdAndUpdate(
      reviewId,
      { status, adminNote },
      { new: true }
    )

    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 })

    // Recompute listing rating from approved reviews
    const stats = await reviewModel.aggregate([
      { $match: { listing: review.listing, status: "approved" } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ])

    await listingModel.findByIdAndUpdate(review.listing, {
      "food.rating": stats[0]?.avg ? Math.round(stats[0].avg * 10) / 10 : 0,
      "food.reviewCount": stats[0]?.count || 0,
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const GET = async (req, { params }) => {
  try {
    const auth = req.headers.get("authorization") || ""
    const user = verifyToken(auth.replace("Bearer ", ""))
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectToDB()
    const { reviewId } = await params
    // reviewId here is actually the listingId for admin view
    const listing = await listingModel.findOne({ slug: reviewId }).select("_id")
    const id = listing?._id || reviewId

    const reviews = await reviewModel.find({ listing: id }).sort({ createdAt: -1 })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
