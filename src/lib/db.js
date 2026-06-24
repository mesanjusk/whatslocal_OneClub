import mongoose from "mongoose"

let isConnected = false

export default async function connectToDB() {
  mongoose.set("strict", true)

  if (!process.env.MONGO_URI) return console.error("Mongo URI not found")

  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to database successfully.")
    isConnected = true
  } catch (error) {
    console.error("Failed to connect to DB", error)
  }
}
