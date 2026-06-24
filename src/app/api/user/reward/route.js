import connectToDB from "@/lib/db"
import userModel from "@/lib/models/user.model"
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/utils/jwt"

export const POST = async (req) => {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { listing } = await req.json()
    const { user_id } = verifyToken(authHeader.split(" ")[1])

    await connectToDB()

    const userProfile = await userModel.findById(user_id, { rewards: 1 })

    if (userProfile.rewards.find((i) => i.listing.toString() === listing)) {
      return NextResponse.json({ error: "Reward already unlocked." }, { status: 400 })
    }

    await userModel.findByIdAndUpdate(userProfile._id, {
      $push: {
        rewards: {
          listing,
          active: true,
        },
      },
    })

    return NextResponse.json({ success: true, rewardAdded: true })
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
