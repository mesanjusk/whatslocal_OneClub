import { Schema, model, models } from "mongoose"

const visitorSchema = new Schema(
  {
    deviceId: { type: String, require: true },
    accessCount: { type: Number, default: 1 },
  },
  {
    timestamps: {
      createdAt: "firstAccessedAt",
      updatedAt: "lastAccessedAt",
    },
  }
)

export default models.visitor || model("visitor", visitorSchema)
