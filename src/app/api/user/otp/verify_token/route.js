import connectToDB from "@/lib/db"
import userModel from "@/lib/models/user.model"
import axios from "axios"
import { NextResponse } from "next/server"
import { signToken } from "@/lib/utils/jwt"

export const POST = async (req) => {
  try {
    await connectToDB()
    const { mobileNumber, accessToken } = await req.json()

    const verifyResponse = await axios.post(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          authkey: process.env.MSG91_AUTH_KEY,
          "access-token": accessToken,
        },
      }
    )

    console.log({ verifying: verifyResponse.data })

    let userProfile = await userModel.findOne({ mobileNumber })
    if (!userProfile) userProfile = await userModel.create({ mobileNumber })

    const token = signToken({ user_id: userProfile._id.toString() }, "1d")

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
