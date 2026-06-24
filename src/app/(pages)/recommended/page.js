import { LuThumbsUp } from "react-icons/lu"

export default function RecommendedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 opacity-40">
      <LuThumbsUp size={40} strokeWidth={1.2} />
      <p className="text-lg font-medium">Recommended coming soon</p>
    </div>
  )
}
