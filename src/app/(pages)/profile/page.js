import { LuUser } from "react-icons/lu"

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 opacity-40">
      <LuUser size={40} strokeWidth={1.2} />
      <p className="text-lg font-medium">Profile coming soon</p>
    </div>
  )
}
