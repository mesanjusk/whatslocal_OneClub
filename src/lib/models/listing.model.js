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
    food: {
      cuisines: [{ type: String }],
      dietType: { type: String, enum: ["veg", "non-veg", "both"] },
      priceRange: {
        min: { type: Number },
        max: { type: Number },
        avgCostForTwo: { type: Number },
      },
      openingHours: {
        mon: { open: { type: String }, close: { type: String } },
        tue: { open: { type: String }, close: { type: String } },
        wed: { open: { type: String }, close: { type: String } },
        thu: { open: { type: String }, close: { type: String } },
        fri: { open: { type: String }, close: { type: String } },
        sat: { open: { type: String }, close: { type: String } },
        sun: { open: { type: String }, close: { type: String } },
      },
      rating: { type: Number, min: 0, max: 5, default: 0 },
      reviewCount: { type: Number, default: 0 },
      isFeatured: { type: Boolean, default: false },
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
