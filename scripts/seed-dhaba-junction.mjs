/**
 * Seed script: Dhaba Junction menu
 * Usage: MONGO_URI="mongodb+srv://..." node scripts/seed-dhaba-junction.mjs
 */

import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) { console.error("❌  Set MONGO_URI env var first"); process.exit(1) }

// ── Schemas ──────────────────────────────────────────────────────────────────

const categorySchema = new mongoose.Schema({ title: String, slug: String })
const subCategorySchema = new mongoose.Schema({
  title: String, slug: String,
  category: { type: mongoose.Schema.ObjectId, ref: "categories" },
})
const listingSchema = new mongoose.Schema({
  title: String, slug: String, status: Number,
  category: { type: mongoose.Schema.ObjectId, ref: "categories" },
  subCategory: { type: mongoose.Schema.ObjectId, ref: "sub_categories" },
  about: String, thumbnail: String,
  location: { address: String, googleMapLink: String },
  food: {
    cuisines: [String], dietType: String,
    priceRange: { min: Number, max: Number, avgCostForTwo: Number },
    isFeatured: Boolean, rating: Number, reviewCount: Number,
  },
  actionLinks: { mobileNumber: String, whatsapp: String },
}, { timestamps: { createdAt: true, updatedAt: false } })

const menuItemSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.ObjectId, ref: "listing", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: String,
  dietType: { type: String, enum: ["veg", "non-veg"] },
  description: String,
  isAvailable: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: { createdAt: true, updatedAt: false } })

const Category    = mongoose.models.categories  || mongoose.model("categories",   categorySchema)
const SubCategory = mongoose.models.sub_categories || mongoose.model("sub_categories", subCategorySchema)
const Listing     = mongoose.models.listing     || mongoose.model("listing",       listingSchema)
const MenuItem    = mongoose.models.menu_item   || mongoose.model("menu_item",     menuItemSchema)

// ── Menu Data ─────────────────────────────────────────────────────────────────
// Format: { name, price, category, dietType?, description? }

const MENU = [
  // ── Starters ──
  { name: "Kurkuri Aloo Tikki",  price: 145, category: "Starters", dietType: "veg" },
  { name: "Corn Cheese Tikki",   price: 155, category: "Starters", dietType: "veg" },
  { name: "Hara Bhara Kebab",    price: 155, category: "Starters", dietType: "veg" },
  { name: "Manchurian",          price: 175, category: "Starters", dietType: "veg" },
  { name: "Veg. Crispy",         price: 175, category: "Starters", dietType: "veg" },
  { name: "Crispy Corn",         price: 185, category: "Starters", dietType: "veg" },
  { name: "Chole Chilly",        price: 185, category: "Starters", dietType: "veg" },
  { name: "Paneer Chilly",       price: 185, category: "Starters", dietType: "veg" },
  { name: "Mushroom Chilly",     price: 195, category: "Starters", dietType: "veg" },
  { name: "Paneer 65",           price: 195, category: "Starters", dietType: "veg" },
  { name: "Mushroom 65",         price: 195, category: "Starters", dietType: "veg" },
  { name: "Cheese Satay",        price: 205, category: "Starters", dietType: "veg" },

  // ── Bhatti Se ──
  { name: "Classic Paneer Tikka",  price: 195, category: "Bhatti Se", dietType: "veg" },
  { name: "Tandoori Soya Chaap",   price: 185, category: "Bhatti Se", dietType: "veg" },
  { name: "Tandoori Mushroom",     price: 195, category: "Bhatti Se", dietType: "veg" },
  { name: "Angara Paneer Tikka",   price: 255, category: "Bhatti Se", dietType: "veg" },

  // ── Tea Time ──
  { name: "Plain Maggi",      price: 90,  category: "Tea Time", dietType: "veg" },
  { name: "French Fries",     price: 95,  category: "Tea Time", dietType: "veg" },
  { name: "Peri Peri Fries",  price: 120, category: "Tea Time", dietType: "veg" },
  { name: "Peri Peri Corn",   price: 165, category: "Tea Time", dietType: "veg" },
  { name: "Masala Maggie",    price: 130, category: "Tea Time", dietType: "veg" },
  { name: "Veg Fried Rice",   price: 155, category: "Tea Time", dietType: "veg" },

  // ── Papad ──
  { name: "Roasted Papad", price: 15, category: "Papad", dietType: "veg" },
  { name: "Fry Papad",     price: 20, category: "Papad", dietType: "veg" },
  { name: "Butter Papad",  price: 25, category: "Papad", dietType: "veg" },
  { name: "Masala Papad",  price: 35, category: "Papad", dietType: "veg" },
  { name: "Papad Bhurji",  price: 95, category: "Papad", dietType: "veg" },

  // ── Raita / Salad ──
  { name: "Plain Curd",      price: 35, category: "Raita / Salad", dietType: "veg" },
  { name: "Tadka Dahi",      price: 85, category: "Raita / Salad", dietType: "veg" },
  { name: "Boondi Raita",    price: 80, category: "Raita / Salad", dietType: "veg" },
  { name: "Vegetable Raita", price: 80, category: "Raita / Salad", dietType: "veg" },
  { name: "Green Salad",     price: 80, category: "Raita / Salad", dietType: "veg" },

  // ── Chole Kulche Combo ──
  { name: "Chole + Aloo Pyaz Kulcha",  price: 160, category: "Chole Kulche Combo", dietType: "veg" },
  { name: "Chole + Mix Kulcha",        price: 180, category: "Chole Kulche Combo", dietType: "veg" },
  { name: "Chole + Paneer Kulcha",     price: 180, category: "Chole Kulche Combo", dietType: "veg" },
  { name: "Chole + Aloo Cheese Kulcha",price: 190, category: "Chole Kulche Combo", dietType: "veg" },

  // ── Food Box (Take Away) ──
  { name: "Punjabi Thali",    price: 225, category: "Food Box", dietType: "veg",
    description: "Mix Veg + PBM + Dal Fry + 3 Butter Roti + Rice + Papad + Sweet + Salad" },
  { name: "Royal Dhaba Thali",price: 295, category: "Food Box", dietType: "veg",
    description: "Chana Masala + PBM + Dal Makhani + 1 Butter Naan + 1 Laccha Paratha + Jeera Rice + Papad + Sweet + Salad" },

  // ── Paneer Se ──
  { name: "PBM (Half)",               price: 125, category: "Paneer Se", dietType: "veg" },
  { name: "PBM (Full)",               price: 195, category: "Paneer Se", dietType: "veg" },
  { name: "Matar Paneer (Half)",      price: 125, category: "Paneer Se", dietType: "veg" },
  { name: "Matar Paneer (Full)",      price: 195, category: "Paneer Se", dietType: "veg" },
  { name: "Paneer Masala (Half)",     price: 120, category: "Paneer Se", dietType: "veg" },
  { name: "Paneer Masala (Full)",     price: 185, category: "Paneer Se", dietType: "veg" },
  { name: "Palak Paneer",             price: 195, category: "Paneer Se", dietType: "veg" },
  { name: "Kadhai Paneer",            price: 205, category: "Paneer Se", dietType: "veg" },
  { name: "Paneer Angara",            price: 225, category: "Paneer Se", dietType: "veg" },
  { name: "Tawa Paneer Makhan Masala",price: 215, category: "Paneer Se", dietType: "veg" },
  { name: "Malai Kofta",              price: 205, category: "Paneer Se", dietType: "veg" },
  { name: "Aloo Tikki Makhani",       price: 205, category: "Paneer Se", dietType: "veg" },
  { name: "Paneer Punjabi",           price: 195, category: "Paneer Se", dietType: "veg" },
  { name: "Paneer Saoji",             price: 195, category: "Paneer Se", dietType: "veg" },
  { name: "PBM Crush",                price: 225, category: "Paneer Se", dietType: "veg" },
  { name: "Paneer Tikka Masala",      price: 225, category: "Paneer Se", dietType: "veg" },
  { name: "Paneer Bhurji",            price: 225, category: "Paneer Se", dietType: "veg" },
  { name: "Dhaba Paneer",             price: 225, category: "Paneer Se", dietType: "veg" },

  // ── Subziyan ──
  { name: "Mix Veg (Half)",          price: 110, category: "Subziyan", dietType: "veg" },
  { name: "Mix Veg (Full)",          price: 155, category: "Subziyan", dietType: "veg" },
  { name: "Sev Bhaji (Half)",        price: 100, category: "Subziyan", dietType: "veg" },
  { name: "Sev Bhaji (Full)",        price: 145, category: "Subziyan", dietType: "veg" },
  { name: "Sev Tamatar (Half)",      price: 110, category: "Subziyan", dietType: "veg" },
  { name: "Sev Tamatar (Full)",      price: 165, category: "Subziyan", dietType: "veg" },
  { name: "Punjabi Chole (Half)",    price: 110, category: "Subziyan", dietType: "veg" },
  { name: "Punjabi Chole (Full)",    price: 175, category: "Subziyan", dietType: "veg" },
  { name: "Baigan Bharta (Half)",    price: 110, category: "Subziyan", dietType: "veg" },
  { name: "Baigan Bharta (Full)",    price: 175, category: "Subziyan", dietType: "veg" },
  { name: "Veg Kolhapuri",           price: 165, category: "Subziyan", dietType: "veg" },
  { name: "Tamatar Chutney",         price: 165, category: "Subziyan", dietType: "veg" },
  { name: "Malai Sev Bhaji",         price: 185, category: "Subziyan", dietType: "veg" },
  { name: "Veg Handi",               price: 185, category: "Subziyan", dietType: "veg" },
  { name: "Veg Dhaba",               price: 205, category: "Subziyan", dietType: "veg" },
  { name: "Aloo Gobhi Matar",        price: 165, category: "Subziyan", dietType: "veg" },
  { name: "Jeera Aloo",              price: 145, category: "Subziyan", dietType: "veg" },
  { name: "Lasooni Palak",           price: 195, category: "Subziyan", dietType: "veg" },
  { name: "Soya Chaap Tikka Masala", price: 215, category: "Subziyan", dietType: "veg" },
  { name: "Mushroom Masala",         price: 195, category: "Subziyan", dietType: "veg" },
  { name: "Veg Keema Kastoori",      price: 195, category: "Subziyan", dietType: "veg" },
  { name: "Lasooni Veg",             price: 195, category: "Subziyan", dietType: "veg" },
  { name: "Mushroom Keema",          price: 225, category: "Subziyan", dietType: "veg" },
  { name: "Special Tawa Chaap",      price: 225, category: "Subziyan", dietType: "veg" },

  // ── Dal ──
  { name: "Dal Fry (Half)",   price: 90,  category: "Dal", dietType: "veg" },
  { name: "Dal Fry (Full)",   price: 135, category: "Dal", dietType: "veg" },
  { name: "Dal Tadka (Half)", price: 115, category: "Dal", dietType: "veg" },
  { name: "Dal Tadka (Full)", price: 165, category: "Dal", dietType: "veg" },
  { name: "Dal Makhani (Half)",price: 120, category: "Dal", dietType: "veg" },
  { name: "Dal Makhani (Full)",price: 185, category: "Dal", dietType: "veg" },
  { name: "Dhaba Dal",        price: 180, category: "Dal", dietType: "veg" },
  { name: "Tadka Extra",      price: 30,  category: "Dal", dietType: "veg" },
  { name: "Butter Tadka",     price: 50,  category: "Dal", dietType: "veg" },

  // ── Rotiyaan ──
  { name: "Tawa / Tandoori Roti", price: 15, category: "Rotiyaan", dietType: "veg" },
  { name: "Butter Roti",          price: 20, category: "Rotiyaan", dietType: "veg" },
  { name: "Butter Naan",          price: 50, category: "Rotiyaan", dietType: "veg" },
  { name: "Butter Garlic Naan",   price: 55, category: "Rotiyaan", dietType: "veg" },
  { name: "Cheese Garlic Naan",   price: 75, category: "Rotiyaan", dietType: "veg" },
  { name: "Amritsari Kulcha",     price: 80, category: "Rotiyaan", dietType: "veg" },
  { name: "Laccha Paratha",       price: 50, category: "Rotiyaan", dietType: "veg" },
  { name: "Aloo Paratha",         price: 80, category: "Rotiyaan", dietType: "veg" },

  // ── Rice ──
  { name: "Plain Rice (Half)",      price: 65,  category: "Rice", dietType: "veg" },
  { name: "Plain Rice (Full)",      price: 105, category: "Rice", dietType: "veg" },
  { name: "Jeera Rice (Half)",      price: 85,  category: "Rice", dietType: "veg" },
  { name: "Jeera Rice (Full)",      price: 125, category: "Rice", dietType: "veg" },
  { name: "Butter Jeera Rice",      price: 145, category: "Rice", dietType: "veg" },
  { name: "Onion Garlic Rice",      price: 145, category: "Rice", dietType: "veg" },
  { name: "Veg. Pulav",             price: 160, category: "Rice", dietType: "veg" },
  { name: "Masala Rice",            price: 155, category: "Rice", dietType: "veg" },
  { name: "Dal Khichdi",            price: 165, category: "Rice", dietType: "veg" },
  { name: "Veg. Biryani",           price: 190, category: "Rice", dietType: "veg" },
  { name: "Masala Khichdi",         price: 190, category: "Rice", dietType: "veg" },

  // ── Sweet ──
  { name: "Gulab Jamun (2 Pc)", price: 40,  category: "Sweet", dietType: "veg" },
  { name: "Rabdi (150g)",       price: 100, category: "Sweet", dietType: "veg" },
  { name: "Rabdi - Gulab Jamun",price: 100, category: "Sweet", dietType: "veg" },

  // ── Beverages ──
  { name: "Cold Drink (250ml)", price: 25, category: "Beverages", dietType: "veg" },
  { name: "Mineral Water",      price: 20, category: "Beverages", dietType: "veg" },
  { name: "Masala Soda",        price: 50, category: "Beverages", dietType: "veg" },
  { name: "Masala Chach",       price: 30, category: "Beverages", dietType: "veg" },
  { name: "Masala Cold Drink",  price: 50, category: "Beverages", dietType: "veg" },
  { name: "Lassi",              price: 55, category: "Beverages", dietType: "veg" },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(MONGO_URI)
  console.log("✅ Connected to MongoDB")

  // 1. Find or create a "Food" category
  let category = await Category.findOne({ slug: "food" })
  if (!category) {
    category = await Category.create({ title: "Food", slug: "food" })
    console.log("📁 Created category: Food")
  } else {
    console.log("📁 Found category:", category.title)
  }

  // 2. Find or create a "Restaurants" subcategory
  let subCategory = await SubCategory.findOne({ slug: "restaurants" })
  if (!subCategory) {
    subCategory = await SubCategory.create({
      title: "Restaurants", slug: "restaurants", category: category._id,
    })
    console.log("📂 Created subcategory: Restaurants")
  } else {
    console.log("📂 Found subcategory:", subCategory.title)
  }

  // 3. Find or create the Dhaba Junction listing
  let listing = await Listing.findOne({ slug: "dhaba-junction" })
  if (!listing) {
    listing = await Listing.create({
      title: "Dhaba Junction",
      slug: "dhaba-junction",
      status: 1,
      category: category._id,
      subCategory: subCategory._id,
      about: "Pure Veg. Family Dhaba — By Punjab. Authentic Punjabi flavours in the heart of Gondia.",
      location: { address: "Gondia, Maharashtra" },
      food: {
        cuisines: ["Punjabi", "North Indian"],
        dietType: "veg",
        priceRange: { min: 15, max: 295, avgCostForTwo: 400 },
        isFeatured: true,
        rating: 4.2,
        reviewCount: 0,
      },
      actionLinks: {
        mobileNumber: "+919876543210",  // ← replace with real number
        whatsapp: "919876543210",        // ← replace with real number (no +)
      },
    })
    console.log("🍽️  Created listing: Dhaba Junction")
  } else {
    console.log("🍽️  Found listing: Dhaba Junction (reusing)")
  }

  // 4. Clear old menu items for this listing & re-insert
  const deleted = await MenuItem.deleteMany({ listing: listing._id })
  console.log(`🗑️  Cleared ${deleted.deletedCount} existing menu items`)

  // 5. Insert all menu items
  const items = MENU.map((item, idx) => ({ ...item, listing: listing._id, sortOrder: idx }))
  await MenuItem.insertMany(items)
  console.log(`✅ Inserted ${items.length} menu items across ${[...new Set(MENU.map(i => i.category))].length} categories`)

  console.log("\n🎉 Done! Dhaba Junction is live.")
  console.log(`   Listing slug: dhaba-junction`)
  console.log(`   Menu items: ${items.length}`)
  process.exit(0)
}

main().catch(err => { console.error("❌", err); process.exit(1) })
