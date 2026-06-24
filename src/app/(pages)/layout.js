import "@fontsource/poppins"
import "@fontsource/poppins/500"
import "@fontsource/poppins/600"
import "@fontsource/poppins/700"
import "@fontsource/poppins/900"
import "@/styles/index.css"
import Header from "@/components/shared/Header"
import TrackVisitor from "@/components/utils/TrackVisitor"
import StoreProvider from "./StoreProvider"
import { ToastContainer } from "react-toastify"


export default function PagesLayout({ children }) {
  return (
    <StoreProvider>
      <Header />
      {children}
      <TrackVisitor />
      <ToastContainer theme="dark" position="bottom-center" />
    </StoreProvider>
  )
}
