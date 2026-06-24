import { getWindow } from "@/lib/utils/getWindow"
import { createSlice } from "@reduxjs/toolkit"

const getStorage = () => {
  if (getWindow()) return getWindow().sessionStorage
  else
    return {
      getItem: () => null,
      setItem: () => null,
    }
}

const initialState = {
  category: getStorage().getItem("category-id"),
  subCategory: getStorage().getItem("sub-category-id"),
  listing: getStorage().getItem("listing-id"),
}

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setNavigationIds: (state, action) => {
      if (typeof action.payload.category === "string") {
        getStorage().setItem("category-id", action.payload.category)
        state.category = action.payload.category
      }
      if (typeof action.payload.subCategory === "string") {
        getStorage().setItem("sub-category-id", action.payload.subCategory)
        state.subCategory = action.payload.subCategory
      }
      if (typeof action.payload.listing === "string") {
        getStorage().setItem("listing-id", action.payload.listing)
        state.listing = action.payload.listing
      }
    },
  },
})

export const { setNavigationIds } = navigationSlice.actions

export default navigationSlice.reducer
