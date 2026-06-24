import connectToDB from "@/lib/db"
import listingModel from "@/lib/models/listing.model.js"
import subCategoryModel from "@/lib/models/subCategory.model"
import categoryModel from "@/lib/models/category.model"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
  try {
    await connectToDB()
    const { slug } = await params

    const listing = await listingModel.findOne({ slug }, { subCategory: 1 })
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const subCategory = await subCategoryModel.findById(listing.subCategory, { slug: 1, category: 1 })
    const category = await categoryModel.findById(subCategory?.category, { slug: 1 })

    return NextResponse.json({
      category: category?.slug,
      subCategory: subCategory?.slug,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
