import "@fontsource/poppins"
import "@fontsource/poppins/700"
import "@fontsource/poppins/900"
import "@/styles/index.css"

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
      <body className="max-w-lg overflow-x-hidden mx-auto min-h-dvh flex flex-col relative">
        {children}
      </body>
    </html>
  )
}
