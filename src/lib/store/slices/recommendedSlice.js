import { createSlice } from "@reduxjs/toolkit"
import { getWindow } from "@/lib/utils/getWindow"

const STORAGE_KEY = "recommended_state_v1"

const load = () => {
  try {
    const raw = getWindow()?.sessionStorage?.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { query: "", results: null, winner: null, activeTab: null }
  } catch { return { query: "", results: null, winner: null, activeTab: null } }
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
    setRecommendedState(state, { payload }) {
      state.query     = payload.query     ?? state.query
      state.results   = payload.results   ?? state.results
      state.winner    = payload.winner    ?? state.winner
      state.activeTab = payload.activeTab ?? state.activeTab
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
