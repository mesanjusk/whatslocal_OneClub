import { LuTag } from "react-icons/lu"

export default function OffersPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 opacity-40">
      <LuTag size={40} strokeWidth={1.2} />
      <p className="text-lg font-medium">Offers coming soon</p>
    </div>
  )
}
