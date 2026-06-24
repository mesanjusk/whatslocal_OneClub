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
          ])
        )?.[0]

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
