import axios from "axios"
import whatsappLogModel from "@/lib/models/whatsappLog.model"

const GRAPH_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
const HEADERS = () => ({ Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` })

async function sendRaw(payload) {
  const res = await axios.post(GRAPH_URL, payload, { headers: HEADERS() })
  return res.data
}

async function log(phone, direction, message, messageType = "text", metadata = {}) {
  try {
    await whatsappLogModel.create({ phone, direction, message, messageType, metadata })
  } catch (_) {}
}

export async function sendText(phone, text) {
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text },
  }
  const result = await sendRaw(payload)
  await log(phone, "outbound", text, "text")
  return result
}

export async function sendButtons(phone, bodyText, buttons) {
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: buttons.slice(0, 3).map((b, i) => ({
          type: "reply",
          reply: { id: b.id || `btn_${i}`, title: b.title },
        })),
      },
    },
  }
  const result = await sendRaw(payload)
  await log(phone, "outbound", bodyText, "interactive")
  return result
}

export async function sendList(phone, headerText, bodyText, buttonText, sections) {
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: headerText },
      body: { text: bodyText },
      action: {
        button: buttonText,
        sections,
      },
    },
  }
  const result = await sendRaw(payload)
  await log(phone, "outbound", bodyText, "interactive")
  return result
}
