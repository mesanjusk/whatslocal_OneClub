import { Schema, model, models } from "mongoose"

const categorySchema = new Schema(
  {
    title: { type: String, required: true },
    sortOrder: { type: Number },
    slug: { type: String, required: true },
    connectButton: {
      title: { type: String },
      url: { type: String },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.category || model("category", categorySchema)
