import { Schema, Types, model, models } from "mongoose"

const subCategorySchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: Types.ObjectId, ref: "categories", required: true },
    slug: { type: String, required: true },
    sortOrder: { type: Number },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.sub_category || model("sub_category", subCategorySchema)
