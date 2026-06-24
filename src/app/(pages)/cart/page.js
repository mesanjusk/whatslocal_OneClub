"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  selectCartItems, selectCartTotal, selectCartCount,
  addItem, removeItem, clearCart,
} from "@/lib/store/slices/cartSlice"
import { LuShoppingCart, LuPlus, LuMinus, LuTrash2 } from "react-icons/lu"

export default function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const count = useAppSelector(selectCartCount)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 opacity-40">
        <LuShoppingCart size={40} strokeWidth={1.2} />
        <p className="text-lg font-medium">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="px-hr pb-8">
      <h1 className="text-xl font-bold mt-6 mb-4">Your Cart</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3 border border-border">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{item.name}</p>
              <p className="text-xs opacity-50 mt-0.5">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => dispatch(removeItem(item.id))}
                className="w-7 h-7 rounded-full border border-border flex items-center justify-center"
              >
                <LuMinus size={12} strokeWidth={3} />
              </button>
              <span className="w-5 text-center font-bold text-sm">{item.qty}</span>
              <button
                onClick={() => dispatch(addItem({ id: item.id, name: item.name, price: item.price,
                  category: item.category, dietType: item.dietType, restaurantSlug: item.restaurantSlug }))}
                className="w-7 h-7 rounded-full border border-border flex items-center justify-center"
              >
                <LuPlus size={12} strokeWidth={3} />
              </button>
            </div>
            <span className="text-sm font-semibold shrink-0 w-16 text-right">
              ₹{item.price * item.qty}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-secondary rounded-xl border border-border px-4 py-4 space-y-2">
        <div className="flex justify-between text-sm opacity-60">
          <span>Subtotal ({count} item{count !== 1 ? "s" : ""})</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        onClick={() => dispatch(clearCart())}
        className="mt-4 flex items-center gap-2 text-sm opacity-40 mx-auto"
      >
        <LuTrash2 size={14} /> Clear cart
      </button>

      <button className="mt-6 w-full bg-[#e23744] text-white font-bold py-4 rounded-2xl text-base">
        Place Order · ₹{total}
      </button>
    </div>
  )
}
