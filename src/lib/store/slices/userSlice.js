import { getWindow } from "@/lib/utils/getWindow"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  mobileNumber: getWindow()?.localStorage?.getItem("mobile-number"),
  token: getWindow()?.localStorage?.getItem("auth-token"),
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      getWindow().localStorage.setItem("mobile-number", action.payload.mobileNumber)
      getWindow().localStorage.setItem("auth-token", action.payload.token)
      state.mobileNumber = action.payload.mobileNumber
      state.token = action.payload.token
    },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
