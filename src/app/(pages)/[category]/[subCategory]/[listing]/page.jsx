import { redirect } from "next/navigation"
import ListingComponent from "./component"

export default async function getListing({ params }) {
  const { listing: listingSlug } = await params

  async function fetchListing() {
    try {
      const url = `${process.env.BASE_URL}/api/listing/${listingSlug}?populateNames=true`
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const listing = await fetchListing()

  if (!listing?.title) return redirect("/")

  const pageUrl = `${process.env.BASE_URL}/${listingSlug}`

  return (
    <>
      <title>{listing.title}</title>
      <meta name="description" content={listing?.about?.slice(0, 150)} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={listing.title} />
      <meta property="og:description" content={listing?.about?.slice(0, 150)} />
      <meta property="og:image" content={listing.thumbnail} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="whatslocal.in" />
      <meta property="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={listing.title} />
      <meta name="twitter:description" content={listing?.about?.slice(0, 150)} />
      <meta name="twitter:image" content={listing.thumbnail} />
      <ListingComponent listing={listing} pageUrl={pageUrl} />
    </>
  )
}
