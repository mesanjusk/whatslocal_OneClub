import StoreProvider from "@/app/(pages)/StoreProvider"
import { ToastContainer } from "react-toastify"

export default function AuthLayout({ children }) {
  return (
    <StoreProvider>
      {children}
      <ToastContainer theme="dark" position="bottom-center" />
    </StoreProvider>
  )
}
