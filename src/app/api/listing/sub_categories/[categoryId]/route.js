import connectToDB from "@/lib/db"
import subCategoryModel from "@/lib/models/subCategory.model"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
  try {
    await connectToDB()
    const { categoryId } = await params

    const result = await subCategoryModel.aggregate([
      {
        $match: {
          category: new Types.ObjectId(categoryId),
        },
      },
      {
        $lookup: {
          from: "listings",
          localField: "_id",
          foreignField: "subCategory",
          pipeline: [
            {
              $match: {
                status: 1,
              },
            },
            {
              $sort: {
                sortOrder: 1,
              },
            },
          ],
          as: "listings",
        },
      },
      {
        $sort: {
          sortOrder: 1,
        },
      },
    ])

    return Response.json(result)
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
