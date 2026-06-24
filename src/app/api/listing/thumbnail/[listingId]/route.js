import connectToDB from "@/lib/db"
import listingModel from "@/lib/models/listing.model"
import cloudinaryModule from "@/lib/cloudinary"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const POST = async (req, { params }) => {
  try {
    await connectToDB()
    const { listingId } = await params
    const formData = await req.formData()
    const file = formData.get("file")

    if (!file) throw new Error({ error: "No files received." })

    const [uploadResult] = await cloudinaryModule.uploadFile([file], `${listingId}/thumbnail`)
    const currentUrl = (await listingModel.findById(listingId, { thumbnail: 1 }))?.thumbnail

    if (currentUrl && currentUrl !== uploadResult.url)
      await cloudinaryModule.deleteFile(currentUrl)

    await listingModel.findByIdAndUpdate(new Types.ObjectId(listingId), {
      thumbnail: uploadResult.url,
    })

    return NextResponse.json({ url: uploadResult.url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
