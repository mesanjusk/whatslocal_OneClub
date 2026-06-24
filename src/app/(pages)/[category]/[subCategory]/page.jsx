"use client"

import { useAppDispatch } from "@/lib/store/hooks"
import { setNavigationIds } from "@/lib/store/slices/navigationSlice"
import { redirect } from "next/navigation"
import { use, useEffect } from "react"

export default function SubCategoryRedirect({ params }) {
  const dispatch = useAppDispatch()
  const { category, subCategory } = use(params)

  useEffect(() => {
    if (category && subCategory) {
      dispatch(setNavigationIds({ category, subCategory, listing: null }))
      redirect("/")
    }
  }, [category, subCategory])

  return null
}
