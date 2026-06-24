"use client"

import axios from "axios"
import { useEffect } from "react"
import { v4 } from "uuid"

export default function TrackVisitor() {
  const field = "whatslocal-device-id"

  useEffect(() => {
    let deviceId = localStorage.getItem(field)
    if (!deviceId) {
      deviceId = v4()
      localStorage.setItem(field, deviceId)
    }
    axios.post("/api/visitor", { deviceId })
  }, [])

  return null
}
