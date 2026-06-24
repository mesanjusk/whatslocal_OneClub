import { LuShoppingCart } from "react-icons/lu"

export default function CartPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 opacity-40">
      <LuShoppingCart size={40} strokeWidth={1.2} />
      <p className="text-lg font-medium">Your cart is empty</p>
    </div>
  )
}
