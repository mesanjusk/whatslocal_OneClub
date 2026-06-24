import { configureStore } from "@reduxjs/toolkit"
import navigationReducer from "./slices/navigationSlice"
import userReducer from "./slices/userSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      navigation: navigationReducer,
      user: userReducer,
    },
  })
}
