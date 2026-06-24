import { Schema, model, models } from "mongoose"

const reviewSchema = new Schema(
  {
    listing: { type: Schema.ObjectId, ref: "listing", required: true, index: true },
    userName: { type: String, trim: true },
    phone: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    status: { type: String, enum: ["pending", "approved", "hidden"], default: "pending" },
    adminNote: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.review || model("review", reviewSchema)
