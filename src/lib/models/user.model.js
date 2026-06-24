import { Schema, model, models } from "mongoose"

const userSchema = new Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
    },
    rewards: [
      {
        listing: { type: Schema.ObjectId, ref: "listings" },
        active: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.user || model("user", userSchema)
