import { Schema, model, models } from "mongoose"

const whatsappSessionSchema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    userId: { type: Schema.ObjectId, ref: "user", default: null },
    state: { type: String, default: "idle" },
    context: { type: Schema.Types.Mixed, default: {} },
    lastActivity: { type: Date, default: Date.now },
    lastInboundAt: { type: Date },
    optedOut: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default models.whatsapp_session || model("whatsapp_session", whatsappSessionSchema)
