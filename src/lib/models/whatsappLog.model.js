import { Schema, model, models } from "mongoose"

const whatsappLogSchema = new Schema(
  {
    direction: { type: String, enum: ["inbound", "outbound"], required: true },
    phone: { type: String, required: true },
    userId: { type: Schema.ObjectId, ref: "user" },
    messageType: {
      type: String,
      enum: ["text", "interactive", "template", "image", "button_reply", "unknown"],
      default: "text",
    },
    message: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed", "received"],
      default: "sent",
    },
    waMessageId: { type: String },
  },
  { timestamps: true }
)

whatsappLogSchema.index({ phone: 1, createdAt: -1 })
whatsappLogSchema.index({ createdAt: -1 })

export default models.whatsapp_log || model("whatsapp_log", whatsappLogSchema)
