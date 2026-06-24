import { configureStore } from "@reduxjs/toolkit"
import navigationReducer from "./slices/navigationSlice"
import userReducer from "./slices/userSlice"
import cartReducer from "./slices/cartSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      navigation: navigationReducer,
      user: userReducer,
      cart: cartReducer,
    },
  })
}
