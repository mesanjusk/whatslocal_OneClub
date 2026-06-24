const FOOD_KEYWORDS = ["pizza", "burger", "biryani", "dosa", "thali", "chinese", "italian", "north indian",
  "south indian", "momos", "noodles", "rice", "dal", "chicken", "paneer", "veg", "nonveg", "non veg", "coffee", "cafe", "tea"]

const BUDGET_PATTERN = /(?:under|below|less than|upto|up to|within)\s*[₹rs.]?\s*(\d+)/i
const PRICE_EXTRACT = /[₹rs.]?\s*(\d+)/i

export function detectIntent(text) {
  const lower = text.trim().toLowerCase()

  if (/^(hi|hello|hey|helo|namaste|start|menu|help)$/.test(lower)) {
    return { intent: "GREET" }
  }

  if (/^(stop|unsubscribe|opt.?out)$/i.test(lower)) {
    return { intent: "OPT_OUT" }
  }

  if (/^offers?$/i.test(lower) || lower.includes("today's offer") || lower.includes("current offer")) {
    return { intent: "SHOW_OFFERS" }
  }

  const menuMatch = lower.match(/^menu\s+(.+)$/) || lower.match(/^show menu\s+(.+)$/)
  if (menuMatch) {
    return { intent: "SHOW_MENU", restaurantName: menuMatch[1].trim() }
  }

  const budgetMatch = text.match(BUDGET_PATTERN)
  const budget = budgetMatch ? parseInt(budgetMatch[1]) : null

  const foundFood = FOOD_KEYWORDS.find((k) => lower.includes(k))

  if (lower.includes("veg") && !lower.includes("non")) {
    return { intent: "SEARCH", dietType: "veg", budget, keyword: foundFood }
  }
  if (lower.includes("non veg") || lower.includes("nonveg")) {
    return { intent: "SEARCH", dietType: "non-veg", budget, keyword: foundFood }
  }

  if (budget || foundFood) {
    return { intent: "SEARCH", budget, keyword: foundFood }
  }

  return { intent: "UNKNOWN" }
}
