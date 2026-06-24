import { getWindow } from "@/lib/utils/getWindow"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  name: getWindow()?.localStorage?.getItem("user-name"),
  email: getWindow()?.localStorage?.getItem("user-email"),
  role: getWindow()?.localStorage?.getItem("user-role"),
  token: getWindow()?.localStorage?.getItem("auth-token"),
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { name, email, role, token } = action.payload
      if (name !== undefined) {
        getWindow()?.localStorage?.setItem("user-name", name)
        state.name = name
      }
      if (email !== undefined) {
        getWindow()?.localStorage?.setItem("user-email", email)
        state.email = email
      }
      if (role !== undefined) {
        getWindow()?.localStorage?.setItem("user-role", role)
        state.role = role
      }
      if (token !== undefined) {
        getWindow()?.localStorage?.setItem("auth-token", token)
        state.token = token
      }
    },
    clearUser: (state) => {
      getWindow()?.localStorage?.removeItem("user-name")
      getWindow()?.localStorage?.removeItem("user-email")
      getWindow()?.localStorage?.removeItem("user-role")
      getWindow()?.localStorage?.removeItem("auth-token")
      state.name = null
      state.email = null
      state.role = null
      state.token = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
