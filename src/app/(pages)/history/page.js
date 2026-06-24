import { LuHistory } from "react-icons/lu"

export default function HistoryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 opacity-40">
      <LuHistory size={40} strokeWidth={1.2} />
      <p className="text-lg font-medium">Order history coming soon</p>
    </div>
  )
}
