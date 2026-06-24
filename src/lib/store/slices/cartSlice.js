import { createSlice } from "@reduxjs/toolkit"
import { getWindow } from "@/lib/utils/getWindow"

// State shape:
// {
//   restaurants: {
//     [slug]: {
//       slug: string,
//       name: string,
//       items: [{ id, name, price, qty, dietType, category }]
//     }
//   }
// }

const EMPTY = { restaurants: {} }

const load = () => {
  try {
    const raw = getWindow()?.localStorage?.getItem("cart_v2")
    return raw ? JSON.parse(raw) : EMPTY
  } catch { return EMPTY }
}

const save = (state) => {
  try { getWindow()?.localStorage?.setItem("cart_v2", JSON.stringify(state)) } catch {}
}

const cartSlice = createSlice({
  name: "cart",
  initialState: load(),
  reducers: {
    addItem(state, { payload }) {
      // payload: { restaurantSlug, restaurantName, id, name, price, qty?, dietType, category }
      const { restaurantSlug, restaurantName, id, ...itemData } = payload
      if (!state.restaurants[restaurantSlug]) {
        state.restaurants[restaurantSlug] = { slug: restaurantSlug, name: restaurantName, items: [] }
      }
      const rest = state.restaurants[restaurantSlug]
      const existing = rest.items.find(i => i.id === id)
      if (existing) {
        existing.qty += 1
      } else {
        rest.items.push({ id, qty: 1, ...itemData })
      }
      save(state)
    },
    removeItem(state, { payload: { restaurantSlug, id } }) {
      const rest = state.restaurants[restaurantSlug]
      if (!rest) return
      const item = rest.items.find(i => i.id === id)
      if (!item) return
      if (item.qty > 1) {
        item.qty -= 1
      } else {
        rest.items = rest.items.filter(i => i.id !== id)
        if (rest.items.length === 0) delete state.restaurants[restaurantSlug]
      }
      save(state)
    },
    clearRestaurant(state, { payload: slug }) {
      delete state.restaurants[slug]
      save(state)
    },
    clearCart(state) {
      state.restaurants = {}
      save(state)
    },
  },
})

export const { addItem, removeItem, clearRestaurant, clearCart } = cartSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectRestaurants    = (s) => Object.values(s.cart.restaurants)
export const selectCartTotal      = (s) =>
  Object.values(s.cart.restaurants).flatMap(r => r.items).reduce((sum, i) => sum + i.price * i.qty, 0)
export const selectCartCount      = (s) =>
  Object.values(s.cart.restaurants).flatMap(r => r.items).reduce((sum, i) => sum + i.qty, 0)
export const selectItemQty = (restaurantSlug, id) => (s) =>
  s.cart.restaurants[restaurantSlug]?.items.find(i => i.id === id)?.qty ?? 0
// Legacy flat selector kept for restaurant menu page
export const selectCartItems = (s) =>
  Object.values(s.cart.restaurants).flatMap(r =>
    r.items.map(item => ({ ...item, restaurantSlug: r.slug, restaurantName: r.name }))
  )

export default cartSlice.reducer
