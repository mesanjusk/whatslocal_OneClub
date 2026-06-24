// ── Taste tag definitions ─────────────────────────────────────────────────────
export const TASTE_ICONS = {
  "Soft":      "🫓", "Fluffy":    "☁️", "Crispy":    "🍘",
  "Tangy":     "🍋", "Spicy":     "🌶️", "Creamy":    "🥛",
  "Fresh":     "🌿", "Mild":      "😌", "Rich":      "🧈",
  "Smoky":     "🔥", "Sweet":     "🍯", "Fragrant":  "🌸",
  "Bold":      "💥", "Juicy":     "💧", "Buttery":   "🧈",
  "Herby":     "🌱", "Cheesy":    "🧀", "Crunchy":   "🥜",
}

export const DISHES_DB = {
  "idli": [
    {
      id: "r1", restaurant: "Udupi Palace",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80",
      price: 40, quantity: "2 pcs", rating: 4.5,
      tags: ["Most Ordered", "Best Value"],
      tasteTags: ["Soft", "Tangy", "Fresh"],
      insights: [
        "Sambar is tangy, well-balanced, and deeply flavoured",
        "Coconut chutney is freshly ground every morning",
        "Soft, fluffy texture — steamed to perfection",
        "Sambar refills are available on request",
      ],
      pros: ["Cheapest", "Authentic taste"], cons: ["Small portion"],
      tasteScore: 4.5,
    },
    {
      id: "r2", restaurant: "South Express",
      image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&q=80",
      price: 60, quantity: "3 pcs", rating: 4.2,
      tags: ["Best Quantity"],
      tasteTags: ["Mild", "Fresh", "Fluffy"],
      insights: [
        "Slightly dense but very satisfying for breakfast",
        "Sambar has a mild, home-style flavour",
        "Three different chutneys served on the side",
        "Great for a filling start to the day",
      ],
      pros: ["3 pieces", "3 chutneys"], cons: ["Slightly pricier"],
      tasteScore: 4.0,
    },
    {
      id: "r3", restaurant: "Dhaba Junction", slug: "dhaba-junction",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=500&q=80",
      price: 55, quantity: "2 pcs", rating: 4.3,
      tags: ["Recommended"],
      tasteTags: ["Crispy", "Tangy", "Spicy"],
      insights: [
        "Chef's special sambar made with a secret masala blend",
        "Coconut chutney has a pleasant spicy kick",
        "Crispy edges with a perfectly soft centre",
        "Consistently praised across customer reviews",
      ],
      pros: ["Best taste", "Consistent quality"], cons: ["Average quantity"],
      tasteScore: 4.2,
    },
  ],
  "paneer": [
    {
      id: "r1", restaurant: "Dhaba Junction", slug: "dhaba-junction",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
      price: 195, quantity: "Full plate", rating: 4.5,
      tags: ["Most Ordered", "Recommended"],
      tasteTags: ["Rich", "Creamy", "Buttery"],
      insights: [
        "Rich, velvety butter masala gravy with deep tomato base",
        "Paneer is soft and freshly made in-house daily",
        "Generous portion — serves 2 people comfortably",
        "Pairs perfectly with butter naan or laccha paratha",
      ],
      pros: ["Best taste", "Freshest paneer"], cons: ["Higher price"],
      tasteScore: 4.6,
    },
    {
      id: "r2", restaurant: "Punjabi Tadka",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80",
      price: 165, quantity: "Full plate", rating: 4.1,
      tags: ["Best Value"],
      tasteTags: ["Spicy", "Bold", "Tangy"],
      insights: [
        "Classic dhaba-style with a nice spicy heat",
        "Paneer is firm and well-marinated with spices",
        "Oil-rich gravy typical of authentic dhaba style",
        "Best paired with laccha paratha",
      ],
      pros: ["Cheapest", "Authentic dhaba style"], cons: ["Oily gravy"],
      tasteScore: 4.0,
    },
    {
      id: "r3", restaurant: "The Spice Route",
      image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=500&q=80",
      price: 180, quantity: "Full plate", rating: 3.9,
      tags: [],
      tasteTags: ["Mild", "Creamy", "Herby"],
      insights: [
        "Fusion twist — mild spices with a creamy base",
        "Paneer can occasionally be slightly rubbery",
        "Good choice for those who prefer light, subtle flavours",
        "Decent portion size for the price",
      ],
      pros: ["Mild fusion style"], cons: ["Average paneer quality"],
      tasteScore: 3.8,
    },
  ],
  "biryani": [
    {
      id: "r1", restaurant: "The Spice Route",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
      price: 220, quantity: "1 plate", rating: 4.4,
      tags: ["Most Ordered", "Recommended"],
      tasteTags: ["Fragrant", "Smoky", "Rich"],
      insights: [
        "Dum-cooked for 4 hours — deep, complex aroma",
        "Long-grain basmati rice with real saffron strands",
        "Raita and shorba served on the side",
        "Huge portion — easily fills one hungry person",
      ],
      pros: ["Best aroma", "Authentic dum style"], cons: ["Higher price"],
      tasteScore: 4.5,
    },
    {
      id: "r2", restaurant: "Chicken Hut",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80",
      price: 180, quantity: "1 plate", rating: 4.2,
      tags: ["Best Value"],
      tasteTags: ["Spicy", "Juicy", "Bold"],
      insights: [
        "Hyderabadi-style with bold whole spices",
        "Juicy chicken pieces in every single bite",
        "Rice is slightly dry but very flavourful",
        "Great value for the generous portion size",
      ],
      pros: ["Best price", "Juicy chicken"], cons: ["Slightly dry rice"],
      tasteScore: 4.1,
    },
    {
      id: "r3", restaurant: "Dhaba Junction", slug: "dhaba-junction",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80",
      price: 190, quantity: "1 plate", rating: 4.0,
      tags: [],
      tasteTags: ["Fragrant", "Mild", "Herby"],
      insights: [
        "North Indian style with whole spices and herbs",
        "Fragrant but not as layered as dum biryani",
        "Good quantity for the price point",
        "Best enjoyed with their house special raita",
      ],
      pros: ["Fragrant spices", "Good quantity"], cons: ["Not dum-cooked"],
      tasteScore: 3.9,
    },
  ],
  "dosa": [
    {
      id: "r1", restaurant: "Udupi Palace",
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80",
      price: 70, quantity: "1 large", rating: 4.6,
      tags: ["Most Ordered", "Recommended", "Best Value"],
      tasteTags: ["Crispy", "Tangy", "Fresh"],
      insights: [
        "Paper-thin, extra crispy — benchmark quality in Gondia",
        "Masala filling is perfectly balanced and spiced",
        "Three chutneys plus sambar included as standard",
        "Batter fermented overnight for authentic tang",
      ],
      pros: ["Best taste", "Crispiest", "Most authentic"], cons: [],
      tasteScore: 4.7,
    },
    {
      id: "r2", restaurant: "South Express",
      image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&q=80",
      price: 85, quantity: "1 large", rating: 4.2,
      tags: [],
      tasteTags: ["Crispy", "Buttery", "Rich"],
      insights: [
        "Slightly thicker than traditional paper dosa",
        "Filling is generous with extra potato masala",
        "Ghee-roasted for a rich, indulgent flavour",
        "Good for a hearty, filling meal",
      ],
      pros: ["Extra filling", "Ghee-roasted"], cons: ["Thicker, less crispy"],
      tasteScore: 4.0,
    },
  ],
  "noodles": [
    {
      id: "r1", restaurant: "The Spice Route",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&q=80",
      price: 130, quantity: "1 plate", rating: 4.3,
      tags: ["Most Ordered"],
      tasteTags: ["Bold", "Smoky", "Crispy"],
      insights: [
        "Wok-tossed at high heat for authentic wok-hei flavour",
        "Perfect soy-garlic balance — well-seasoned throughout",
        "Fresh vegetables add satisfying crunch",
        "Portion is large enough for two light eaters",
      ],
      pros: ["Best flavour", "Wok-tossed"], cons: ["Slightly oily"],
      tasteScore: 4.2,
    },
    {
      id: "r2", restaurant: "Dhaba Junction", slug: "dhaba-junction",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
      price: 120, quantity: "1 plate", rating: 4.0,
      tags: ["Best Value", "Recommended"],
      tasteTags: ["Spicy", "Tangy", "Fresh"],
      insights: [
        "Indo-Chinese style with a desi spice twist",
        "Less oily than most competitors in the area",
        "Slightly saucy — great for dipping rotis alongside",
        "Excellent value for the portion size",
      ],
      pros: ["Cheapest", "Less oily"], cons: ["Less authentic Chinese"],
      tasteScore: 3.9,
    },
  ],
  "burger": [
    {
      id: "r1", restaurant: "Bombay Bites",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      price: 120, quantity: "1 burger", rating: 4.2,
      tags: ["Most Ordered", "Best Value"],
      tasteTags: ["Crispy", "Spicy", "Fresh"],
      insights: [
        "Crispy aloo patty made fresh with their secret spice mix",
        "Toasted bun with crisp lettuce and tangy sauce",
        "Comes with a small side of masala fries",
        "Best bang for your buck in Gondia",
      ],
      pros: ["Best value", "Crispy patty"], cons: ["Smaller size"],
      tasteScore: 4.1,
    },
    {
      id: "r2", restaurant: "Green Bowl",
      image: "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=500&q=80",
      price: 180, quantity: "1 burger", rating: 4.4,
      tags: ["Recommended"],
      tasteTags: ["Juicy", "Cheesy", "Rich"],
      insights: [
        "Double-patty with a premium artisan bun",
        "Loaded with fresh toppings and house-made chipotle mayo",
        "Cheese is generously melted throughout",
        "Premium quality ingredients — worth every rupee",
      ],
      pros: ["Premium quality", "Double patty"], cons: ["Pricier"],
      tasteScore: 4.3,
    },
  ],
  "pizza": [
    {
      id: "r1", restaurant: "Green Bowl",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
      price: 250, quantity: "8 slices", rating: 4.3,
      tags: ["Recommended"],
      tasteTags: ["Cheesy", "Crispy", "Fresh"],
      insights: [
        "Thin crust with a perfectly golden, crispy base",
        "Cheese is stretchy and applied very generously",
        "Fresh vegetables — not frozen or pre-packaged",
        "Wood-fired flavour profile sets it apart",
      ],
      pros: ["Best cheese", "Fresh toppings"], cons: ["Expensive"],
      tasteScore: 4.2,
    },
    {
      id: "r2", restaurant: "Bombay Bites",
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=80",
      price: 160, quantity: "6 slices", rating: 3.8,
      tags: ["Best Value"],
      tasteTags: ["Spicy", "Cheesy", "Bold"],
      insights: [
        "Desi twist — paneer tikka topping is a highlight",
        "Slightly thick crust with a soft, bread-like interior",
        "Mozzarella is generous but not as stretchy",
        "Great for those who love a spicy Indian pizza",
      ],
      pros: ["Most affordable", "Desi twist"], cons: ["Thick crust"],
      tasteScore: 3.7,
    },
  ],
  "south indian": [
    {
      id: "r1", restaurant: "Udupi Palace",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80",
      price: 60, quantity: "Combo", rating: 4.6,
      tags: ["Most Ordered", "Recommended"],
      tasteTags: ["Fresh", "Tangy", "Crispy"],
      insights: ["Authentic Tamil Nadu recipes", "Fresh coconut chutney ground daily", "Best idli-dosa combo in Gondia"],
      pros: ["Most authentic", "Best variety"], cons: ["Can get crowded"],
      tasteScore: 4.7,
    },
    {
      id: "r2", restaurant: "South Express",
      image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&q=80",
      price: 50, quantity: "Combo", rating: 4.1,
      tags: ["Best Value"],
      tasteTags: ["Mild", "Fresh", "Soft"],
      insights: ["Quick service — ready in 5 minutes", "Decent portions for the price", "Great for takeaway"],
      pros: ["Fast service", "Budget-friendly"], cons: ["Less authentic"],
      tasteScore: 4.0,
    },
  ],
  "north indian": [
    {
      id: "r1", restaurant: "Dhaba Junction", slug: "dhaba-junction",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
      price: 180, quantity: "Full meal", rating: 4.5,
      tags: ["Most Ordered", "Recommended"],
      tasteTags: ["Rich", "Buttery", "Smoky"],
      insights: ["Authentic Punjabi flavours throughout the menu", "Freshly baked naans every hour", "Best dal makhani in Gondia"],
      pros: ["Best taste", "Authentic"], cons: ["Slightly expensive"],
      tasteScore: 4.6,
    },
    {
      id: "r2", restaurant: "Punjabi Tadka",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80",
      price: 140, quantity: "Full meal", rating: 4.2,
      tags: ["Best Value"],
      tasteTags: ["Spicy", "Bold", "Tangy"],
      insights: ["Dhaba-style rustic flavours with generous tadka", "Large portions at every price point", "No-frills, satisfying meal"],
      pros: ["Cheapest", "Large portions"], cons: ["Oilier gravies"],
      tasteScore: 4.0,
    },
  ],
  "chinese": [
    {
      id: "r1", restaurant: "The Spice Route",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&q=80",
      price: 150, quantity: "Full plate", rating: 4.3,
      tags: ["Most Ordered", "Recommended"],
      tasteTags: ["Bold", "Smoky", "Crispy"],
      insights: ["Wok-tossed with authentic Chinese sauces", "Best Manchurian in Gondia", "Fresh vegetables in every dish"],
      pros: ["Best flavour", "Authentic technique"], cons: ["Slightly expensive"],
      tasteScore: 4.2,
    },
    {
      id: "r2", restaurant: "Dhaba Junction", slug: "dhaba-junction",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
      price: 120, quantity: "Full plate", rating: 4.0,
      tags: ["Best Value"],
      tasteTags: ["Spicy", "Tangy", "Mild"],
      insights: ["Indo-Chinese style with a desi spin", "Less oily than most", "Good for the whole family"],
      pros: ["Budget-friendly", "Less oily"], cons: ["Less authentic"],
      tasteScore: 3.9,
    },
  ],
  "desserts": [
    {
      id: "r1", restaurant: "Dhaba Junction", slug: "dhaba-junction",
      image: "https://images.unsplash.com/photo-1601303516534-3b50cba4b08a?w=500&q=80",
      price: 100, quantity: "1 bowl", rating: 4.4,
      tags: ["Most Ordered", "Recommended"],
      tasteTags: ["Sweet", "Creamy", "Rich"],
      insights: ["Rabdi is extra thick and creamy", "Gulab jamun soaked overnight for deep sweetness", "Served warm for best experience"],
      pros: ["Best taste", "Rich flavour"], cons: ["Small portion"],
      tasteScore: 4.5,
    },
    {
      id: "r2", restaurant: "Green Bowl",
      image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80",
      price: 80, quantity: "1 scoop", rating: 4.1,
      tags: ["Best Value"],
      tasteTags: ["Sweet", "Fresh", "Mild"],
      insights: ["Artisan ice cream with seasonal flavours", "Light and refreshing — not too heavy", "Unique flavours change weekly"],
      pros: ["Lighter option", "Affordable"], cons: ["Not traditional"],
      tasteScore: 4.0,
    },
  ],
  "fast food": [
    {
      id: "r1", restaurant: "Bombay Bites",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      price: 100, quantity: "Combo", rating: 4.2,
      tags: ["Most Ordered", "Recommended"],
      tasteTags: ["Spicy", "Crispy", "Bold"],
      insights: ["Crispy vada pav is legendary in Gondia", "Masala fries are addictive", "Consistently ready in under 10 minutes"],
      pros: ["Fastest", "Best street food"], cons: ["Limited seating"],
      tasteScore: 4.1,
    },
    {
      id: "r2", restaurant: "Green Bowl",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
      price: 160, quantity: "Combo", rating: 4.3,
      tags: ["Best Value"],
      tasteTags: ["Fresh", "Mild", "Crispy"],
      insights: ["Healthier fast food options", "Wraps and salads available alongside fries", "Fresh ingredients every day"],
      pros: ["Healthier", "Fresh ingredients"], cons: ["Pricier"],
      tasteScore: 4.2,
    },
  ],
  "italian": [
    {
      id: "r1", restaurant: "Green Bowl",
      image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&q=80",
      price: 220, quantity: "1 plate", rating: 4.3,
      tags: ["Recommended"],
      tasteTags: ["Cheesy", "Herby", "Rich"],
      insights: ["Imported pasta cooked al dente — firm bite", "Homemade tomato sauce simmered for 3 hours", "Fresh basil and parmesan finish"],
      pros: ["Best quality", "Authentic pasta"], cons: ["Most expensive"],
      tasteScore: 4.2,
    },
    {
      id: "r2", restaurant: "Bombay Bites",
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=80",
      price: 160, quantity: "1 plate", rating: 3.9,
      tags: ["Best Value"],
      tasteTags: ["Spicy", "Bold", "Cheesy"],
      insights: ["Desi-Italian fusion with Indian spice twist", "Spicier than traditional Italian", "Good for variety-seekers and fusion lovers"],
      pros: ["Affordable", "Fusion twist"], cons: ["Not authentic"],
      tasteScore: 3.8,
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

// Winner scoring: taste × 2.5 + rating + value bonus
export function pickWinner(results) {
  if (!results?.length) return null
  return results.reduce((best, r) => {
    const score = r.tasteScore * 2.5 + r.rating + (200 / r.price)
    const bScore = best.tasteScore * 2.5 + best.rating + (200 / best.price)
    return score > bScore ? r : best
  }, results[0])
}

export function getResults(query) {
  const q = query.toLowerCase().trim()
  if (!q) return null
  if (DISHES_DB[q]) return { query: q, results: DISHES_DB[q] }
  for (const key of Object.keys(DISHES_DB)) {
    if (key.includes(q) || q.includes(key)) return { query: key, results: DISHES_DB[key] }
  }
  return { query: q, results: [] }
}
