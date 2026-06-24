import { Schema, model, models } from "mongoose"

const menuItemSchema = new Schema(
  {
    listing: { type: Schema.ObjectId, ref: "listing", required: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, trim: true },
    dietType: { type: String, enum: ["veg", "non-veg"] },
    description: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.menu_item || model("menu_item", menuItemSchema)
