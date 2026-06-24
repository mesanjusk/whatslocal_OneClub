// Mock restaurant + dish database for AI recommendations
export const DISHES_DB = {
  "idli": [
    {
      id: "r1", restaurant: "Udupi Palace", price: 40, quantity: "2 pcs",
      rating: 4.5, tasteScore: 4.5, tags: ["Most Ordered", "Best Value"],
      insights: [
        "Sambar is tangy and well-balanced",
        "Coconut chutney is freshly ground",
        "Soft, fluffy texture — steamed to perfection",
        "Generous sambar portion refills available",
      ],
      pros: ["Cheapest", "Authentic taste"], cons: ["Small portion"],
    },
    {
      id: "r2", restaurant: "South Express", price: 60, quantity: "3 pcs",
      rating: 4.2, tasteScore: 4.0, tags: ["Best Quantity"],
      insights: [
        "Slightly dense but satisfying",
        "Sambar has a mild, home-style flavour",
        "Three chutneys served alongside",
        "Great for a filling breakfast",
      ],
      pros: ["3 pieces", "3 chutneys"], cons: ["Slightly pricier"],
    },
    {
      id: "r3", restaurant: "Dhaba Junction", price: 55, quantity: "2 pcs",
      rating: 4.3, tasteScore: 4.2, tags: ["Recommended"],
      insights: [
        "Chef's special sambar with secret masala",
        "Coconut chutney is slightly spicy",
        "Crispy edges with a soft centre",
        "Consistently praised in reviews",
      ],
      pros: ["Best taste", "Consistent quality"], cons: ["Average quantity"],
    },
  ],
  "paneer": [
    {
      id: "r1", restaurant: "Dhaba Junction", price: 195, quantity: "Full plate",
      rating: 4.5, tasteScore: 4.6, tags: ["Most Ordered", "Recommended"],
      insights: [
        "Rich, velvety butter masala gravy",
        "Paneer is soft and freshly made in-house",
        "Generous portion, serves 2 comfortably",
        "Pairs perfectly with butter naan",
      ],
      pros: ["Best taste", "Freshest paneer"], cons: ["Higher price"],
    },
    {
      id: "r2", restaurant: "Punjabi Tadka", price: 165, quantity: "Full plate",
      rating: 4.1, tasteScore: 4.0, tags: ["Best Value"],
      insights: [
        "Classic dhaba-style, slightly spicy",
        "Paneer is firm and well-marinated",
        "Oil-rich gravy typical of dhaba style",
        "Best paired with laccha paratha",
      ],
      pros: ["Cheapest", "Authentic dhaba style"], cons: ["Oily gravy"],
    },
    {
      id: "r3", restaurant: "The Spice Route", price: 180, quantity: "Full plate",
      rating: 3.9, tasteScore: 3.8, tags: [],
      insights: [
        "Fusion twist with mild spices",
        "Paneer can be slightly rubbery",
        "Good for those who prefer mild flavours",
        "Decent portion size",
      ],
      pros: ["Mild, fusion style"], cons: ["Average paneer quality"],
    },
  ],
  "biryani": [
    {
      id: "r1", restaurant: "The Spice Route", price: 220, quantity: "1 plate",
      rating: 4.4, tasteScore: 4.5, tags: ["Most Ordered", "Recommended"],
      insights: [
        "Dum-cooked for 4 hours for deep aroma",
        "Long-grain basmati with saffron",
        "Raita and shorba served alongside",
        "Huge portion — easily fills one person",
      ],
      pros: ["Best aroma", "Authentic dum style"], cons: ["Higher price"],
    },
    {
      id: "r2", restaurant: "Chicken Hut", price: 180, quantity: "1 plate",
      rating: 4.2, tasteScore: 4.1, tags: ["Best Value"],
      insights: [
        "Hyderabadi-style with bold spices",
        "Juicy chicken pieces in every bite",
        "Slightly dry but flavourful",
        "Great value for the portion size",
      ],
      pros: ["Best price", "Juicy chicken"], cons: ["Slightly dry rice"],
    },
    {
      id: "r3", restaurant: "Dhaba Junction", price: 190, quantity: "1 plate",
      rating: 4.0, tasteScore: 3.9, tags: [],
      insights: [
        "North Indian style with whole spices",
        "Fragrant but not as layered as dum biryani",
        "Good quantity for the price",
        "Best with their special raita",
      ],
      pros: ["Fragrant spices", "Good quantity"], cons: ["Not dum-cooked"],
    },
  ],
  "pizza": [
    {
      id: "r1", restaurant: "Green Bowl", price: 250, quantity: "8 slices",
      rating: 4.3, tasteScore: 4.2, tags: ["Recommended"],
      insights: [
        "Thin crust with a perfectly crispy base",
        "Cheese is stretchy and generously applied",
        "Fresh vegetables, not frozen",
        "Wood-fired flavour profile",
      ],
      pros: ["Best cheese", "Fresh toppings"], cons: ["Expensive"],
    },
    {
      id: "r2", restaurant: "Bombay Bites", price: 160, quantity: "6 slices",
      rating: 3.8, tasteScore: 3.7, tags: ["Best Value"],
      insights: [
        "Indian spice twist on classic pizza",
        "Paneer tikka topping is a highlight",
        "Slightly thick crust",
        "Generous mozzarella",
      ],
      pros: ["Most affordable", "Desi twist"], cons: ["Thick crust"],
    },
  ],
  "dosa": [
    {
      id: "r1", restaurant: "Udupi Palace", price: 70, quantity: "1 large",
      rating: 4.6, tasteScore: 4.7, tags: ["Most Ordered", "Recommended", "Best Value"],
      insights: [
        "Paper-thin, extra crispy — benchmark quality",
        "Masala filling is perfectly spiced",
        "Three chutneys + sambar included",
        "Batter fermented overnight for authentic tang",
      ],
      pros: ["Best taste", "Crispiest", "Most authentic"], cons: [],
    },
    {
      id: "r2", restaurant: "South Express", price: 85, quantity: "1 large",
      rating: 4.2, tasteScore: 4.0, tags: [],
      insights: [
        "Slightly thicker than traditional",
        "Filling is generous with extra potato masala",
        "Ghee-roasted for added flavour",
        "Good option for a hearty meal",
      ],
      pros: ["Extra filling", "Ghee-roasted"], cons: ["Thicker, less crispy"],
    },
  ],
  "noodles": [
    {
      id: "r1", restaurant: "The Spice Route", price: 130, quantity: "1 plate",
      rating: 4.3, tasteScore: 4.2, tags: ["Most Ordered"],
      insights: [
        "Wok-tossed at high heat for authentic flavour",
        "Perfect soy-garlic balance",
        "Fresh vegetables add great crunch",
        "Portion is large enough for two light eaters",
      ],
      pros: ["Best flavour", "Wok-tossed"], cons: ["Slightly oily"],
    },
    {
      id: "r2", restaurant: "Dhaba Junction", price: 120, quantity: "1 plate",
      rating: 4.0, tasteScore: 3.9, tags: ["Best Value", "Recommended"],
      insights: [
        "Indo-Chinese style with desi spices",
        "Less oily than most competitors",
        "Slightly saucy — great for dipping",
        "Good value for portion size",
      ],
      pros: ["Cheapest", "Less oily"], cons: ["Less authentic Chinese"],
    },
  ],
  "burger": [
    {
      id: "r1", restaurant: "Bombay Bites", price: 120, quantity: "1 burger",
      rating: 4.2, tasteScore: 4.1, tags: ["Most Ordered", "Best Value"],
      insights: [
        "Crispy aloo patty with secret sauce",
        "Toasted bun with fresh lettuce",
        "Comes with small side of fries",
        "Best bang for your buck",
      ],
      pros: ["Best value", "Crispy patty"], cons: ["Smaller size"],
    },
    {
      id: "r2", restaurant: "Green Bowl", price: 180, quantity: "1 burger",
      rating: 4.4, tasteScore: 4.3, tags: ["Recommended"],
      insights: [
        "Double-patty with artisan bun",
        "Loaded with fresh toppings",
        "House-made chipotle mayo",
        "Premium quality ingredients throughout",
      ],
      pros: ["Premium quality", "Double patty"], cons: ["Pricier"],
    },
  ],
  "south indian": [
    {
      id: "r1", restaurant: "Udupi Palace", price: 60, quantity: "Combo",
      rating: 4.6, tasteScore: 4.7, tags: ["Most Ordered", "Recommended"],
      insights: ["Authentic Tamil Nadu recipes", "Fresh coconut chutney daily", "Best idli-dosa combo"],
      pros: ["Most authentic", "Best variety"], cons: ["Can get crowded"],
    },
    {
      id: "r2", restaurant: "South Express", price: 50, quantity: "Combo",
      rating: 4.1, tasteScore: 4.0, tags: ["Best Value"],
      insights: ["Quick service", "Decent portion sizes", "Good for takeaway"],
      pros: ["Fast service", "Budget-friendly"], cons: ["Less authentic"],
    },
  ],
  "north indian": [
    {
      id: "r1", restaurant: "Dhaba Junction", price: 180, quantity: "Full meal",
      rating: 4.5, tasteScore: 4.6, tags: ["Most Ordered", "Recommended"],
      insights: ["Authentic Punjabi flavours", "Freshly baked naans daily", "Best dal makhani in town"],
      pros: ["Best taste", "Authentic"], cons: ["Slightly expensive"],
    },
    {
      id: "r2", restaurant: "Punjabi Tadka", price: 140, quantity: "Full meal",
      rating: 4.2, tasteScore: 4.0, tags: ["Best Value"],
      insights: ["Dhaba-style rustic flavours", "Large portions", "Generous tadka"],
      pros: ["Cheapest", "Large portions"], cons: ["Oilier gravies"],
    },
  ],
  "chinese": [
    {
      id: "r1", restaurant: "The Spice Route", price: 150, quantity: "Full plate",
      rating: 4.3, tasteScore: 4.2, tags: ["Most Ordered", "Recommended"],
      insights: ["Wok-tossed with authentic sauces", "Best Manchurian in Gondia", "Fresh vegetables"],
      pros: ["Best flavour", "Authentic technique"], cons: ["Slightly expensive"],
    },
    {
      id: "r2", restaurant: "Dhaba Junction", price: 120, quantity: "Full plate",
      rating: 4.0, tasteScore: 3.9, tags: ["Best Value"],
      insights: ["Indo-Chinese style", "Less oily", "Good for families"],
      pros: ["Budget-friendly", "Less oily"], cons: ["Less authentic"],
    },
  ],
  "desserts": [
    {
      id: "r1", restaurant: "Dhaba Junction", price: 100, quantity: "1 bowl",
      rating: 4.4, tasteScore: 4.5, tags: ["Most Ordered", "Recommended"],
      insights: ["Rabdi is rich and creamy", "Gulab jamun soaked overnight", "Served warm"],
      pros: ["Best taste", "Rich flavour"], cons: ["Small portion"],
    },
    {
      id: "r2", restaurant: "Green Bowl", price: 80, quantity: "1 scoop",
      rating: 4.1, tasteScore: 4.0, tags: ["Best Value"],
      insights: ["Artisan ice cream flavours", "Seasonal specials", "Light and refreshing"],
      pros: ["Lighter option", "Affordable"], cons: ["Not traditional"],
    },
  ],
  "fast food": [
    {
      id: "r1", restaurant: "Bombay Bites", price: 100, quantity: "Combo",
      rating: 4.2, tasteScore: 4.1, tags: ["Most Ordered", "Recommended"],
      insights: ["Crispy vada pav is legendary", "Masala fries are addictive", "Quick 10-min service"],
      pros: ["Fastest", "Best street food"], cons: ["Limited seating"],
    },
    {
      id: "r2", restaurant: "Green Bowl", price: 160, quantity: "Combo",
      rating: 4.3, tasteScore: 4.2, tags: ["Best Value"],
      insights: ["Healthier fast food options", "Wraps and salads available", "Fresh ingredients"],
      pros: ["Healthier", "Fresh ingredients"], cons: ["Pricier"],
    },
  ],
  "italian": [
    {
      id: "r1", restaurant: "Green Bowl", price: 220, quantity: "1 plate",
      rating: 4.3, tasteScore: 4.2, tags: ["Recommended"],
      insights: ["Imported pasta cooked al dente", "Homemade tomato sauce", "Fresh basil and parmesan"],
      pros: ["Best quality", "Authentic pasta"], cons: ["Most expensive"],
    },
    {
      id: "r2", restaurant: "Bombay Bites", price: 160, quantity: "1 plate",
      rating: 3.9, tasteScore: 3.8, tags: ["Best Value"],
      insights: ["Desi-Italian fusion style", "Spicier than traditional", "Good for variety lovers"],
      pros: ["Affordable", "Fusion twist"], cons: ["Not authentic"],
    },
  ],
}

export const CATEGORIES = [
  { label: "South Indian", icon: "🥥", key: "south indian" },
  { label: "North Indian", icon: "🍛", key: "north indian" },
  { label: "Chinese",      icon: "🥢", key: "chinese" },
  { label: "Italian",      icon: "🍝", key: "italian" },
  { label: "Fast Food",    icon: "🍔", key: "fast food" },
  { label: "Desserts",     icon: "🍮", key: "desserts" },
]

// Determine winner from results
export function pickWinner(results) {
  if (!results?.length) return null
  return results.reduce((best, r) => {
    const score = r.tasteScore * 2 + r.rating + (10 / r.price) * 5
    const bestScore = best.tasteScore * 2 + best.rating + (10 / best.price) * 5
    return score > bestScore ? r : best
  }, results[0])
}

export function getResults(query) {
  const q = query.toLowerCase().trim()
  if (!q) return null
  // exact key match
  if (DISHES_DB[q]) return { query: q, results: DISHES_DB[q] }
  // partial match across keys
  for (const key of Object.keys(DISHES_DB)) {
    if (key.includes(q) || q.includes(key)) return { query: key, results: DISHES_DB[key] }
  }
  return { query: q, results: [] }
}
