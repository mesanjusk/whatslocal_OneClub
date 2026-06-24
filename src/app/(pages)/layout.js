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

export const viewport = {
  width: "device-width",
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
}

export const metadata = {
  title: "WhatsLocal",
  description: "Experience the Pulse of Your Neighborhood",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`max-w-lg overflow-x-hidden mx-auto min-h-dvh flex flex-col relative`}>
        <StoreProvider>
          <Header />
          {children}
          <TrackVisitor />
        </StoreProvider>
        <ToastContainer theme="dark" position="bottom-center" />
      </body>
    </html>
  )
}
