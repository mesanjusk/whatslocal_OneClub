import { createSlice } from "@reduxjs/toolkit"
import { getWindow } from "@/lib/utils/getWindow"

const load = () => {
  try {
    const raw = getWindow()?.localStorage?.getItem("cart")
    return raw ? JSON.parse(raw) : { items: [], restaurantSlug: null }
  } catch { return { items: [], restaurantSlug: null } }
}

const save = (state) => {
  try { getWindow()?.localStorage?.setItem("cart", JSON.stringify(state)) } catch {}
}

const cartSlice = createSlice({
  name: "cart",
  initialState: load(),
  reducers: {
    addItem(state, { payload }) {
      // Clear cart if switching restaurant
      if (state.restaurantSlug && state.restaurantSlug !== payload.restaurantSlug) {
        state.items = []
      }
      state.restaurantSlug = payload.restaurantSlug
      const existing = state.items.find(i => i.id === payload.id)
      if (existing) { existing.qty += 1 }
      else { state.items.push({ ...payload, qty: 1 }) }
      save(state)
    },
    removeItem(state, { payload: id }) {
      const existing = state.items.find(i => i.id === id)
      if (!existing) return
      if (existing.qty > 1) { existing.qty -= 1 }
      else { state.items = state.items.filter(i => i.id !== id) }
      save(state)
    },
    clearCart(state) {
      state.items = []
      state.restaurantSlug = null
      save(state)
    },
  },
})

export const { addItem, removeItem, clearCart } = cartSlice.actions

export const selectCartItems = (s) => s.cart.items
export const selectCartTotal = (s) => s.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)
export const selectCartCount = (s) => s.cart.items.reduce((sum, i) => sum + i.qty, 0)
export const selectItemQty = (id) => (s) => s.cart.items.find(i => i.id === id)?.qty ?? 0

export default cartSlice.reducer
