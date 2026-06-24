import { configureStore } from "@reduxjs/toolkit"
import navigationReducer from "./slices/navigationSlice"
import userReducer from "./slices/userSlice"
import cartReducer from "./slices/cartSlice"
import recommendedReducer from "./slices/recommendedSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      navigation: navigationReducer,
      user: userReducer,
      cart: cartReducer,
      recommended: recommendedReducer,
    },
  })
}
