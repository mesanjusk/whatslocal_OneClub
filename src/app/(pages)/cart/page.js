"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  selectRestaurants, selectCartTotal, selectCartCount,
  addItem, removeItem, clearRestaurant, clearCart,
} from "@/lib/store/slices/cartSlice"
import { LuShoppingCart, LuPlus, LuMinus, LuTrash2, LuPhone, LuChevronRight } from "react-icons/lu"
import { RiWhatsappLine } from "react-icons/ri"

function buildWhatsAppMessage(restaurantName, items, total) {
  const lines = items.map(i => `• ${i.name} x${i.qty}  ₹${i.price * i.qty}`)
  return [
    `🍽️ *New Order — ${restaurantName}*`,
    "",
    ...lines,
    "",
    `*Total: ₹${total}*`,
    "",
    "Please confirm my order. Thank you!",
  ].join("\n")
}

function RestaurantGroup({ group, listing }) {
  const dispatch = useAppDispatch()
  const { slug, name, items } = group

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  const restaurantName = listing?.title || name
  const whatsappNumber = (
    listing?.actionLinks?.whatsapp ||
    listing?.actionLinks?.mobileNumber ||
    "919876543210"
  ).replace(/\D/g, "")
  const callNumber = listing?.actionLinks?.mobileNumber ||
    listing?.actionLinks?.whatsapp || "+919876543210"

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(buildWhatsAppMessage(restaurantName, items, subtotal))
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank")
  }
  const handleCall = () => { window.location.href = `tel:${callNumber}` }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
      {/* Restaurant header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div>
          <p className="font-bold text-sm text-gray-900">{restaurantName}</p>
          <p className="text-xs text-gray-400 mt-0.5">{count} item{count !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => dispatch(clearRestaurant(slug))}
          className="text-xs text-red-400 flex items-center gap-1"
        >
          <LuTrash2 size={12} /> Remove
        </button>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50 px-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 py-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
              <p className="text-xs font-bold text-[#e23744] mt-0.5">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => dispatch(removeItem({ restaurantSlug: slug, id: item.id }))}
                className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center"
              >
                <LuMinus size={12} strokeWidth={3} className="text-white" />
              </button>
              <span className="w-5 text-center font-black text-sm text-gray-900">{item.qty}</span>
              <button
                onClick={() => dispatch(addItem({
                  restaurantSlug: slug, restaurantName: name,
                  id: item.id, name: item.name, price: item.price,
                  category: item.category, dietType: item.dietType,
                }))}
                className="w-7 h-7 rounded-full bg-[#e23744] flex items-center justify-center"
              >
                <LuPlus size={12} strokeWidth={3} className="text-white" />
              </button>
            </div>
            <span className="text-sm font-bold text-gray-900 shrink-0 w-16 text-right">
              ₹{item.price * item.qty}
            </span>
          </div>
        ))}
      </div>

      {/* Subtotal + order buttons */}
      <div className="px-4 pt-3 pb-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-bold text-gray-900">₹{subtotal}</span>
        </div>

        {/* Message preview */}
        <div className="bg-[#075e54]/8 border border-[#075e54]/15 rounded-xl px-3 py-2 mb-3">
          <p className="text-xs font-semibold text-[#075e54] mb-1 opacity-70">Order message preview</p>
          <pre className="text-xs text-gray-500 whitespace-pre-wrap font-sans leading-relaxed">
            {buildWhatsAppMessage(restaurantName, items, subtotal)}
          </pre>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl text-sm"
          >
            <RiWhatsappLine size={18} />
            Order on WhatsApp
          </button>
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white font-bold py-3 px-4 rounded-xl text-sm"
          >
            <LuPhone size={16} />
            Call
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const restaurants = useAppSelector(selectRestaurants)
  const total = useAppSelector(selectCartTotal)
  const count = useAppSelector(selectCartCount)
  const dispatch = useAppDispatch()

  const [listings, setListings] = useState({})

  useEffect(() => {
    restaurants.forEach(r => {
      if (listings[r.slug]) return
      axios.get(`/api/listing/${r.slug}`)
        .then(res => setListings(prev => ({ ...prev, [r.slug]: res.data })))
        .catch(() => {})
    })
  }, [restaurants])

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-gray-400">
        <LuShoppingCart size={40} strokeWidth={1.2} />
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="text-sm">Add items from a restaurant to get started</p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-28 pt-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {count} item{count !== 1 ? "s" : ""} · {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs text-red-400 flex items-center gap-1"
        >
          <LuTrash2 size={12} /> Clear all
        </button>
      </div>

      {restaurants.map(group => (
        <RestaurantGroup key={group.slug} group={group} listing={listings[group.slug]} />
      ))}

      {/* Grand total */}
      {restaurants.length > 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 px-4 py-4 flex justify-between items-center">
          <span className="font-semibold text-gray-700">Grand Total</span>
          <span className="font-black text-lg text-gray-900">₹{total}</span>
        </div>
      )}
    </div>
  )
}
