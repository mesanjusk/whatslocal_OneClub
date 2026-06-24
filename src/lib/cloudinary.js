import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadFile = async (files, folder) => {
  const filesArray = Array.isArray(files) ? files : [files]

  const uploadPromises = filesArray.map(async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer())

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: "image" }, (error, result) => {
          if (error) reject(error)
          else resolve({ url: result.secure_url, name: file.name, publicId: result.public_id })
        })
        .end(buffer)
    })
  })

  return Promise.all(uploadPromises)
}

const deleteFile = async (url) => {
  const uploadIndex = url.indexOf("/upload/")
  if (uploadIndex === -1) return

  let publicId = url.slice(uploadIndex + 8)
  // Remove version prefix (v followed by digits and slash)
  publicId = publicId.replace(/^v\d+\//, "")
  // Remove file extension
  publicId = publicId.replace(/\.[^/.]+$/, "")

  await cloudinary.uploader.destroy(publicId)
}

const cloudinaryModule = { uploadFile, deleteFile }

export default cloudinaryModule
