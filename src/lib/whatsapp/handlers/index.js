import connectToDB from "@/lib/db"
import listingModel from "@/lib/models/listing.model"
import menuItemModel from "@/lib/models/menu.model"
import whatsappSessionModel from "@/lib/models/whatsappSession.model"
import { sendText, sendButtons, sendList } from "../sendMessage"

export async function handleGreet(phone) {
  await sendButtons(
    phone,
    "👋 Welcome to *WhatsLocal Food*!\n\nDiscover the best restaurants near you.\n\nWhat are you looking for?",
    [
      { id: "search_food", title: "🍽 Find Food" },
      { id: "show_offers", title: "🏷 Today's Offers" },
      { id: "help", title: "❓ Help" },
    ]
  )
}

export async function handleSearch(phone, { budget, keyword, dietType }) {
  await connectToDB()
  const match = { status: 1, type: "food" }
  if (keyword) match.$or = [{ title: { $regex: keyword, $options: "i" } }, { "food.cuisines": { $regex: keyword, $options: "i" } }]
  if (dietType) match["food.dietType"] = dietType
  if (budget) match["food.priceRange.avgCostForTwo"] = { $lte: budget }

  const results = await listingModel.find(match).sort({ "food.isFeatured": -1, "food.rating": -1 }).limit(5)

  if (!results.length) {
    await sendText(phone, "😕 No restaurants found matching your search. Try a different cuisine or budget.")
    return
  }

  const sections = [
    {
      title: "Restaurants",
      rows: results.map((r) => ({
        id: `listing_${r.slug}`,
        title: r.title.slice(0, 24),
        description: [
          r.food?.cuisines?.[0],
          r.food?.priceRange?.avgCostForTwo ? `₹${r.food.priceRange.avgCostForTwo} for 2` : null,
          r.location?.address?.slice(0, 30),
        ].filter(Boolean).join(" · "),
      })),
    },
  ]

  await sendList(
    phone,
    "🍽 Results",
    `Found ${results.length} restaurant${results.length > 1 ? "s" : ""}:`,
    "View",
    sections
  )
}

export async function handleShowOffers(phone) {
  await connectToDB()
  const now = new Date()
  const listings = await listingModel.aggregate([
    { $match: { status: 1, type: "food" } },
    {
      $lookup: {
        from: "offers",
        localField: "_id",
        foreignField: "listing",
        as: "offers",
        pipeline: [{ $match: { isActive: true, validTo: { $gte: now } } }],
      },
    },
    { $match: { "offers.0": { $exists: true } } },
    { $limit: 5 },
  ])

  if (!listings.length) {
    await sendText(phone, "No active offers at the moment. Check back later! 🕐")
    return
  }

  const text = listings
    .map((l) =>
      l.offers
        .map((o) => `🏷 *${l.title}*\n${o.title}${o.discount ? ` — ${o.discount}` : ""}\nValid till: ${new Date(o.validTo).toLocaleDateString("en-IN")}`)
        .join("\n")
    )
    .join("\n\n")

  await sendText(phone, `*Today's Offers* 🎉\n\n${text}`)
}

export async function handleShowMenu(phone, restaurantName) {
  await connectToDB()
  const listing = await listingModel.findOne({
    type: "food",
    title: { $regex: restaurantName, $options: "i" },
  })

  if (!listing) {
    await sendText(phone, `😕 Could not find a restaurant matching "${restaurantName}". Please check the name and try again.`)
    return
  }

  const items = await menuItemModel.find({ listing: listing._id, isAvailable: true }).sort({ sortOrder: 1 })
  if (!items.length) {
    await sendText(phone, `Menu for *${listing.title}* is not available yet.`)
    return
  }

  const grouped = items.reduce((acc, item) => {
    const cat = item.category || "Menu"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const text = Object.entries(grouped)
    .map(([cat, catItems]) => {
      const rows = catItems.map((i) => `  • ${i.name} — ₹${i.price}${i.dietType === "veg" ? " 🟢" : " 🔴"}`).join("\n")
      return `*${cat}*\n${rows}`
    })
    .join("\n\n")

  await sendText(phone, `🍽 *${listing.title} Menu*\n\n${text}`)
}

export async function handleUnknown(phone) {
  await sendText(
    phone,
    "I didn't quite understand that. 🤔\n\nTry:\n• *pizza under 300* — find restaurants\n• *veg* — vegetarian places\n• *menu [name]* — view a restaurant menu\n• *offers* — today's deals\n• *hi* — main menu"
  )
}

export async function getOrCreateSession(phone) {
  await connectToDB()
  const SESSION_TIMEOUT = 30 * 60 * 1000
  let session = await whatsappSessionModel.findOne({ phone })

  if (!session) {
    session = await whatsappSessionModel.create({ phone })
  } else if (Date.now() - session.lastActivity > SESSION_TIMEOUT) {
    session.state = "idle"
    session.context = {}
  }

  session.lastActivity = new Date()
  session.lastInboundAt = new Date()
  await session.save()
  return session
}
