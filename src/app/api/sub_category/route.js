import connectToDB from "@/lib/db"
import subCategoryModel from "@/lib/models/subCategory.model"

export const GET = async () => {
  try {
    await connectToDB()
    const subCategories = await subCategoryModel.aggregate([
      {
        $sort: {
          sortOrder: 1,
        },
      },
      {
        $group: {
          _id: "$category",
          v: {
            $push: {
              value: "$_id",
              label: "$title",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          k: {
            $toString: "$_id",
          },
          v: 1,
        },
      },
      {
        $group: {
          _id: 0,
          values: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $project: {
          values: {
            $arrayToObject: "$values",
          },
        },
      },
    ])
    return Response.json(subCategories?.[0]?.values)
  } catch (error) {
    return Response.error(error.message)
  }
}
