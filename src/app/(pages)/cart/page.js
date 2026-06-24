"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  selectCartItems, selectCartTotal, selectCartCount,
  addItem, removeItem, clearCart,
} from "@/lib/store/slices/cartSlice"
import { LuShoppingCart, LuPlus, LuMinus, LuTrash2, LuPhone } from "react-icons/lu"
import { RiWhatsappLine } from "react-icons/ri"

// ── Restaurant contact — update with real numbers ─────────────────────────────
const RESTAURANT = {
  name: "Dhaba Junction",
  phone: "919876543210",      // replace with actual number (91 + 10-digit)
  callNumber: "+919876543210", // replace with actual number
}

function buildWhatsAppMessage(items, total) {
  const lines = items.map(i => `• ${i.name} x${i.qty}  ₹${i.price * i.qty}`)
  return [
    `🍽️ *New Order — ${RESTAURANT.name}*`,
    "",
    ...lines,
    "",
    `*Total: ₹${total}*`,
    "",
    "Please confirm my order. Thank you!",
  ].join("\n")
}

export default function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const count = useAppSelector(selectCartCount)

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(buildWhatsAppMessage(items, total))
    window.open(`https://wa.me/${RESTAURANT.phone}?text=${msg}`, "_blank")
  }

  const handleCall = () => {
    window.location.href = `tel:${RESTAURANT.callNumber}`
  }

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
      <h1 className="text-xl font-bold mt-6 mb-1">Your Cart</h1>
      <p className="text-sm opacity-40 mb-4">{RESTAURANT.name}</p>

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

      {/* Bill summary */}
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

      {/* WhatsApp message preview */}
      <div className="mt-4 bg-[#075e54]/10 border border-[#075e54]/20 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-[#075e54] mb-1 opacity-80">Order message preview</p>
        <pre className="text-xs opacity-60 whitespace-pre-wrap font-sans leading-relaxed">
          {buildWhatsAppMessage(items, total)}
        </pre>
      </div>

      {/* Place order buttons */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded-2xl text-sm"
        >
          <RiWhatsappLine size={20} />
          Order on WhatsApp
        </button>
        <button
          onClick={handleCall}
          className="flex items-center justify-center gap-2 bg-secondary border border-border font-bold py-4 px-5 rounded-2xl text-sm"
        >
          <LuPhone size={18} />
          Call
        </button>
      </div>

      <button
        onClick={() => dispatch(clearCart())}
        className="mt-5 flex items-center gap-2 text-sm opacity-40 mx-auto"
      >
        <LuTrash2 size={14} /> Clear cart
      </button>
    </div>
  )
}
