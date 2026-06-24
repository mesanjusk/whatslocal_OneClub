"use client"

import Script from "next/script"

const configuration = {
  widgetId: "356341664a48373933343532",
  tokenAuth: "312759TRZYCE2x67e4f528P1",
  exposeMethods: true,
  success: () => {},
  failure: () => {},
}

export default function Msg91Scripts() {
  return (
    <>
      <Script id="otp-config" strategy="beforeInteractive">
        {`var configuration = ${JSON.stringify(configuration)};`}
      </Script>
      <Script
        src="https://verify.msg91.com/otp-provider.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof initSendOTP === "function") {
            initSendOTP(configuration)
          }
        }}
      />
    </>
  )
}
