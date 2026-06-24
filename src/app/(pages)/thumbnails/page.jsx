"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import imageCompression from "browser-image-compression"
import { getWindow } from "@/lib/utils/getWindow"

const Thumbnails = () => {
  const [listings, setListings] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/api/listing")
        setListings(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchListings()
  }, [])

  async function handleImageCompression(imageFile) {
    if (!imageFile) throw new Error("No file selectd")

    const options = {
      maxSizeMB: 0.2,
      useWebWorker: true,
    }

    const compressedFile = await imageCompression(imageFile, options)
    return new File([compressedFile], imageFile.name)
  }

  const handleSubmit = async (event) => {
    setSelected((prev) => ({ ...prev, uploading: true }))
    event.preventDefault()
    const formData = new FormData()
    formData.set("file", await handleImageCompression(event.target.file.files[0]))

    try {
      const response = await axios.post(`/api/listing/thumbnail/${selected?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setListings((prev) =>
        prev.map((i) => {
          if (i._id !== selected.id) return i
          return {
            ...i,
            thumbnail: response.data.url,
            timestamp: getWindow()?.Date?.now?.(),
          }
        })
      )
    } catch (error) {
      console.error(error)
    }

    setSelected((prev) => ({ ...prev, uploading: false }))
  }

  return (
    <div className="px-hr flex flex-col gap-4">
      {listings?.map((i) => (
        <div key={i._id}>
          <button
            onClick={() => setSelected({ id: i._id })}
            className="p-2 w-full bg-accent rounded-md"
          >
            {i.title}
          </button>
          {selected?.id === i._id && (
            <>
              {i.thumbnail && (
                <img
                  src={i.thumbnail}
                  alt="thumbnail"
                  className="aspect-square mt-2 object-contain rounded-md h-[30vh] mx-auto"
                />
              )}
              <form onSubmit={handleSubmit}>
                <input
                  type="file"
                  name="file"
                  className="my-2 bg-gray-600 p-1.5 rounded-md w-[100%]"
                  required
                  accept="image/*"
                />
                <button
                  disabled={selected?.id === i._id && selected?.uploading}
                  type="submit"
                  className="bg-green-600 p-1 mx-auto block w-1/2 rounded-md disabled:opacity-50 disabled:cursor-progress"
                >
                  Upload{selected?.uploading ? "ing..." : ""}
                </button>
              </form>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default Thumbnails
