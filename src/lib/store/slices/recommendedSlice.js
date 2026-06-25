import { createSlice } from "@reduxjs/toolkit"
import { getWindow } from "@/lib/utils/getWindow"

const STORAGE_KEY = "recommended_state_v1"
const EMPTY = { query: "", results: null, winner: null, activeTab: null }

const load = () => {
  try {
    const raw = getWindow()?.sessionStorage?.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { ...EMPTY }
  } catch { return { ...EMPTY } }
}

const save = (state) => {
  try {
    getWindow()?.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

const recommendedSlice = createSlice({
  name: "recommended",
  initialState: load(),
  reducers: {
    // Use `in payload` checks so explicit null values are honoured
    setRecommendedState(state, { payload }) {
      if ("query"     in payload) state.query     = payload.query
      if ("results"   in payload) state.results   = payload.results
      if ("winner"    in payload) state.winner    = payload.winner
      if ("activeTab" in payload) state.activeTab = payload.activeTab
      save(state)
    },
    clearRecommended(state) {
      state.query     = ""
      state.results   = null
      state.winner    = null
      state.activeTab = null
      save(state)
    },
  },
})

export const { setRecommendedState, clearRecommended } = recommendedSlice.actions

export const selectRecommendedQuery     = (s) => s.recommended.query
export const selectRecommendedResults   = (s) => s.recommended.results
export const selectRecommendedWinner    = (s) => s.recommended.winner
export const selectRecommendedActiveTab = (s) => s.recommended.activeTab

export default recommendedSlice.reducer
