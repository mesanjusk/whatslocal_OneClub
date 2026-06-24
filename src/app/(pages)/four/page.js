import { LuLayoutGrid } from "react-icons/lu"

export default function FourPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 opacity-40">
      <LuLayoutGrid size={40} strokeWidth={1.2} />
      <p className="text-lg font-medium">Coming soon</p>
    </div>
  )
}
