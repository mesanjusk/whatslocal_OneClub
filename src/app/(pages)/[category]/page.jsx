import { redirect } from "next/navigation"

export default async function getListing({ params }) {
  const { category: listingSlug } = await params

  let path = "/"

  try {
    const url = `${process.env.BASE_URL}/api/listing/${listingSlug}/redirectInfo`
    const response = await fetch(url)
    const data = await response.json()
    path = `/${data.category}/${data.subCategory}/${listingSlug}`
  } catch (error) {
    path = "/"
  }

  redirect(path)
}
