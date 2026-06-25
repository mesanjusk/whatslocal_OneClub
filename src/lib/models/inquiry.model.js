import { Schema, model, models } from "mongoose"

const inquirySchema = new Schema(
  {
    restaurantId: { type: String, required: true, index: true },
    restaurantName: { type: String },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export default models.inquiry || model("inquiry", inquirySchema)
