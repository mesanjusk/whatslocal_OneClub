import connectToDB from "@/lib/db"
import categoryModel from "@/lib/models/category.model"

export const GET = async (req) => {
  try {
    await connectToDB()
    const listings = req?.nextUrl?.searchParams.get("listings")
    const categories = !listings
      ? await categoryModel.find().sort({ sortOrder: 1 })
      : await categoryModel.aggregate([
          {
            $lookup: {
              from: "listings",
              foreignField: "category",
              localField: "_id",
              pipeline: [
                {
                  $match: {
                    status: 1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    _id: 1,
                  },
                },
              ],
              as: "listings",
            },
          },
          {
            $match: {
              "listings._id": {
                $exists: true,
              },
            },
          },
          {
            $unset: "listings",
          },
          {
            $sort: {
              sortOrder: 1,
            },
          },
        ])
    return Response.json(categories)
  } catch (error) {
    console.error(error)
    return new Response("Something broke", { status: 500 })
  }
}
