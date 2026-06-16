# Cason's Printz

Anime-inspired custom apparel — single-page static website.
Clean, modern, dark theme (black / white / cherry-blossom pink).

## Stack
- Static HTML / CSS / vanilla JS — no build step, no backend
- Product data driven by `products.json`
- Payments via Stripe Payment Links (test mode during dev)
- Hosted on Netlify (free tier), source on GitHub

## Project structure
```
casons-printz/
├── index.html          # the entire single-page site
├── products.json       # ALL product data — edit this to manage the shop
├── css/styles.css      # theme tokens + styling
├── js/main.js          # renders products + hash-router for product pages
├── images/products/    # real product photos (placehold.co until provided)
├── .env.example        # env template (copy to .env, never commit .env)
├── EDITING_GUIDE.md    # plain-English owner guide (added in Stage 8)
└── README.md
```

## Local preview
Because the site uses `fetch()` to load `products.json`, open it through a
local server rather than double-clicking the file:

```powershell
# from the project folder
python -m http.server 8000
# then visit http://localhost:8000
```

## Editing the shop
See `EDITING_GUIDE.md` (added in Stage 8) for plain-English instructions on
adding products, swapping images, and changing prices/text.

## Build stages
1. Scaffold ✅
2. Style pass
3. Product grids
4. Product detail pages
5. Stripe integration
6. Footer + polish
7. Netlify deploy
8. EDITING_GUIDE.md
