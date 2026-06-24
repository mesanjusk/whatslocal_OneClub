import { NextResponse } from "next/server"
import { detectIntent } from "@/lib/whatsapp/detectIntent"
import {
  handleGreet,
  handleSearch,
  handleShowOffers,
  handleShowMenu,
  handleUnknown,
  getOrCreateSession,
} from "@/lib/whatsapp/handlers"
import whatsappLogModel from "@/lib/models/whatsappLog.model"
import connectToDB from "@/lib/db"

// Webhook verification
export const GET = async (req) => {
  const params = req.nextUrl.searchParams
  const mode = params.get("hub.mode")
  const token = params.get("hub.verify_token")
  const challenge = params.get("hub.challenge")

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response("Forbidden", { status: 403 })
}

// Incoming messages
export const POST = async (req) => {
  // Always respond 200 immediately — Meta requires this
  const body = await req.json().catch(() => ({}))

  setImmediate(() => processMessage(body).catch(console.error))

  return NextResponse.json({ status: "ok" })
}

async function processMessage(body) {
  try {
    const entry = body?.entry?.[0]
    const change = entry?.changes?.[0]?.value
    const message = change?.messages?.[0]
    if (!message) return

    const phone = message.from
    const messageType = message.type

    await connectToDB()

    // Log inbound
    try {
      const text = message.text?.body || message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || ""
      await whatsappLogModel.create({ direction: "inbound", phone, message: text, messageType: messageType === "interactive" ? "interactive" : "text" })
    } catch (_) {}

    // Check opt-out
    const session = await getOrCreateSession(phone)
    if (session.optedOut) return

    let text = ""
    if (message.type === "text") {
      text = message.text?.body || ""
    } else if (message.type === "interactive") {
      const btnReply = message.interactive?.button_reply
      const listReply = message.interactive?.list_reply
      text = btnReply?.id || listReply?.id || btnReply?.title || listReply?.title || ""
    }

    const { intent, ...intentData } = detectIntent(text)

    switch (intent) {
      case "GREET":
        await handleGreet(phone)
        break
      case "SEARCH":
        await handleSearch(phone, intentData)
        break
      case "SHOW_OFFERS":
        await handleShowOffers(phone)
        break
      case "SHOW_MENU":
        await handleShowMenu(phone, intentData.restaurantName)
        break
      case "OPT_OUT":
        session.optedOut = true
        await session.save()
        break
      default:
        await handleUnknown(phone)
    }
  } catch (error) {
    console.error("WhatsApp message processing error:", error)
  }
}
