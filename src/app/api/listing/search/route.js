import connectToDB from "@/lib/db"
import listingModel from "@/lib/models/listing.model"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  try {
    await connectToDB()
    const params = req.nextUrl.searchParams
    const q = params.get("q")
    const cuisine = params.get("cuisine")
    const dietType = params.get("dietType")
    const maxCost = params.get("maxCost")
    const featured = params.get("featured")

    const match = { status: 1, type: "food" }

    if (q) {
      match.$or = [
        { title: { $regex: q, $options: "i" } },
        { "food.cuisines": { $regex: q, $options: "i" } },
        { about: { $regex: q, $options: "i" } },
      ]
    }
    if (cuisine) match["food.cuisines"] = { $regex: cuisine, $options: "i" }
    if (dietType) match["food.dietType"] = dietType
    if (maxCost) match["food.priceRange.avgCostForTwo"] = { $lte: parseInt(maxCost) }
    if (featured === "true") match["food.isFeatured"] = true

    const listings = await listingModel.aggregate([
      { $match: match },
      { $sort: { "food.isFeatured": -1, "food.rating": -1, createdAt: -1 } },
      { $limit: 50 },
      {
        $project: {
          slug: 1,
          title: 1,
          thumbnail: 1,
          about: 1,
          "location.address": 1,
          "food.cuisines": 1,
          "food.dietType": 1,
          "food.priceRange": 1,
          "food.rating": 1,
          "food.reviewCount": 1,
          "food.isFeatured": 1,
          category: 1,
          subCategory: 1,
        },
      },
    ])

    return NextResponse.json(listings)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
