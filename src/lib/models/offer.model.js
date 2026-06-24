import { Schema, model, models } from "mongoose"

const offerSchema = new Schema(
  {
    listing: { type: Schema.ObjectId, ref: "listing", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    discount: { type: String, trim: true },
    validFrom: { type: Date },
    validTo: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.offer || model("offer", offerSchema)
