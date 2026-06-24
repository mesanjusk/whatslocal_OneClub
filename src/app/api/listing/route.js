import connectToDB from "@/lib/db"
import listingModel from "@/lib/models/listing.model.js"
import cloudinaryModule from "@/lib/cloudinary"
import { LISTING_TYPES } from "@/lib/utils/constants"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

function removeNullFields(obj) {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === "") obj[key] = null
    else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      obj[key] = removeNullFields(obj[key])
      if (Object.values(obj[key]).filter(Boolean).length === 0) obj[key] = null
    }
  }
  return obj
}

export const POST = async (req) => {
  try {
    await connectToDB()
    const formData = await req.formData()
    const thumbnailFile = formData.get("thumbnailFile")
    let { _id, ...json } = JSON.parse(formData.get("json"))
    _id = _id ? new Types.ObjectId(_id) : new Types.ObjectId()

    const current = await listingModel.findById(_id, { thumbnail: 1, covers: 1 })

    if (thumbnailFile) {
      const thumbnailResult = await cloudinaryModule.uploadFile(
        [thumbnailFile],
        `${_id.toString()}/thumbnail`
      )
      if (thumbnailResult) json.thumbnail = thumbnailResult[0].url
      if (current?.thumbnail && json.thumbnail !== current.thumbnail)
        await cloudinaryModule.deleteFile(current.thumbnail)
    }

    if (json.type !== LISTING_TYPES.FORM) {
      const coverFiles = formData.getAll("coverFiles")
      let coverResults
      if (coverFiles?.[0])
        coverResults = await cloudinaryModule.uploadFile(coverFiles, `${_id.toString()}/covers`)

      if (current?._id || coverResults?.[0])
        json.covers = json.orderedCovers.map(
          (i) =>
            coverResults?.find((_i) => _i.name === i)?.url ||
            current?.covers?.filter(Boolean)?.find((_i) => _i.split("/").at(-1) === i)
        )

      if (json.deletedCovers) await Promise.all(json.deletedCovers.map(cloudinaryModule.deleteFile))
    }

    const result = current?._id
      ? await listingModel.findOneAndUpdate({ _id }, removeNullFields(json), { new: true })
      : await listingModel.create({ _id, ...removeNullFields(json) })

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const GET = async (req) => {
  try {
    await connectToDB()
    const listings = await listingModel.aggregate([
      {
        $lookup: {
          from: "subCategory",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $set: {
          category: {
            $first: "$category.title",
          },
        },
      },
    ])
    return NextResponse.json(listings)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
