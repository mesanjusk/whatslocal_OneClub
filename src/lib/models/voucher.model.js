import { Schema, Types, model, models } from "mongoose"

const voucherSchema = new Schema(
  {
    code: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "users", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.voucher || model("voucher", voucherSchema)
