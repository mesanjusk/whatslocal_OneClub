import connectToDB from "@/lib/db"
import listingModel from "@/lib/models/listing.model.js"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
  try {
    await connectToDB()
    const { slug } = await params
    const populateNames = req?.nextUrl?.searchParams.get("populateNames")
    const checkSlug = req?.nextUrl?.searchParams.get("checkSlug")

    const result = checkSlug
      ? await listingModel.exists({ slug })
      : !populateNames
      ? await listingModel.findOne({ slug })
      : (
          await listingModel.aggregate([
            {
              $match: { slug },
            },
            {
              $lookup: {
                from: "sub_categories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategoryName",
              },
            },
            {
              $lookup: {
                from: "categories",
                localField: "subCategoryName.category",
                foreignField: "_id",
                as: "categoryName",
              },
            },
            {
              $set: {
                subCategoryName: {
                  $first: "$subCategoryName.title",
                },
                categoryName: {
                  $first: "$categoryName.title",
                },
              },
            },
            {
              $lookup: {
                from: "menu_items",
                localField: "_id",
                foreignField: "listing",
                as: "menu",
                pipeline: [
                  { $match: { isAvailable: true } },
                  { $sort: { sortOrder: 1 } },
                ],
              },
            },
            {
              $lookup: {
                from: "offers",
                localField: "_id",
                foreignField: "listing",
                as: "offers",
                pipeline: [
                  { $match: { isActive: true, validTo: { $gte: new Date() } } },
                ],
              },
            },
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "listing",
                as: "reviews",
                pipeline: [
                  { $match: { status: "approved" } },
                  { $sort: { createdAt: -1 } },
                  { $limit: 10 },
                ],
              },
            },
          ])
        )?.[0]

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
