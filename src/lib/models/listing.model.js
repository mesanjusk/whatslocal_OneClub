import { models } from "mongoose"
import { model, Schema } from "mongoose"
import { LISTING_TYPES } from "../utils/constants"

const listingSchema = new Schema(
  {
    type: { type: String, default: LISTING_TYPES.NORMAL, enum: Object.values(LISTING_TYPES) },
    title: { type: String, required: true },
    category: { type: Schema.ObjectId, ref: "categories", required: true },
    subCategory: { type: Schema.ObjectId, ref: "sub_categories", required: true },
    sortOrder: { type: Number },
    status: { type: Number, default: 1 },
    owner: { type: String },
    thumbnail: { type: String },
    covers: [{ type: String }],
    coverAspectRatio: { type: String },
    slug: { type: String, unique: true },
    date: { type: Date },
    about: { type: String },
    targetSharingCount: { type: Number },
    googleFormUrl: { type: String },
    time: {
      from: { type: String },
      to: { type: String },
    },
    location: {
      address: { type: String },
      googleMapLink: { type: String },
    },
    actionLinks: {
      mobileNumber: { type: String },
      whatsapp: { type: String },
      instagram: { type: String },
    },
    customActionLink: {
      label: { type: String },
      url: { type: String },
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
)

export default models.listing || model("listing", listingSchema)
