# Editing Guide — Cason's Printz

Hi! This guide explains how to run your shop **without touching any code.**
Almost everything lives in one file: **`products.json`**. If you can edit a
form, you can edit this site.

> ⚠️ One golden rule: `products.json` is picky about punctuation. Every item
> needs its commas and quotes in the right place. When in doubt, copy an
> existing product block and just change the words inside the quotes. If the
> site ever shows "Couldn't load products," a comma or quote is probably
> missing — paste your file into https://jsonlint.com to find the spot.

---

## The big picture

- **Products** (name, price, description, photo, payment link) → `products.json`
- **Product photos** → the `images/products/` folder
- **Payments** → Stripe (see `STRIPE_SETUP.md`)
- After any change: **save the file, commit, and push to GitHub.** Netlify
  rebuilds your live site automatically in about a minute. (See "Publishing
  your changes" at the bottom.)

---

## Anatomy of one product

Open `products.json`. You'll see two lists: `"premade"` and `"custom"`.
Each product is a block like this:

```json
{
  "id": "premade-1",
  "name": "Sakura Drip Tee",
  "price": "$32",
  "description": "Heavyweight cotton tee with a falling cherry-blossom graphic.",
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "image": "images/products/premade-1.jpg",
  "type": "premade",
  "stripeLink": "https://buy.stripe.com/test_xxxxxxxx"
}
```

| Field | What it is | Can I change it? |
|-------|-----------|------------------|
| `id` | A unique tag used in the web address. | Keep it unique. Avoid spaces. |
| `name` | The product name shown on the site. | ✅ Yes |
| `price` | The price shown (just text, e.g. `"$32"`). | ✅ Yes (also update it in Stripe) |
| `description` | The blurb on the product page. | ✅ Yes |
| `sizes` | The size buttons. | ✅ Yes |
| `image` | Path to the photo (or a placeholder URL). | ✅ Yes |
| `type` | `"premade"` or `"custom"`. | Leave as-is |
| `stripeLink` | The Stripe payment link. | ✅ Yes (see `STRIPE_SETUP.md`) |

---

## Common tasks

### ✏️ Change a price, name, or description
1. Open `products.json`.
2. Find the product.
3. Change the text **inside the quotes** (e.g. `"price": "$36"`).
4. Save. **If you changed a price, also update it on the Stripe link** (see
   `STRIPE_SETUP.md`) so customers are charged the right amount.

### 🖼️ Add a real photo to an existing product
1. Name your photo clearly, e.g. `premade-1.jpg`.
2. Drop it into the **`images/products/`** folder.
3. In `products.json`, set that product's `image` to:
   `"image": "images/products/premade-1.jpg"`
4. Save. (Square-ish or tall photos look best — the site crops to a 3:4 shape.)

### ➕ Add a brand-new product
1. In `products.json`, copy an existing product block (from the `{` to the `}`).
2. Paste it as a new entry in the right list (`premade` or `custom`).
   **Remember a comma `,` between blocks.**
3. Change `id` to something new and unique (e.g. `premade-6`).
4. Update `name`, `price`, `description`, `image`.
5. Add the photo to `images/products/` (or leave the placeholder URL for now).
6. Create a Stripe link for it and paste it into `stripeLink`
   (see `STRIPE_SETUP.md`).
7. Save. The new card appears automatically — no other files to touch.

### ➖ Remove a product
1. Delete its whole block, from `{` to `}`.
2. Make sure commas still separate the remaining blocks (no comma after the
   **last** product in a list).

### 🎨 Use a placeholder while you wait for a photo
Set the image to a placeholder URL, for example:
`"image": "https://placehold.co/600x800/1b1b20/ff6eb4?text=Coming+Soon"`

---

## A note on commas (the #1 thing that breaks the file)

- Put a comma **between** products: `}, {`
- **No** comma after the **last** product in a list.
- Every `"name": "value"` line ends in a comma **except the last one** in the
  block.

If something breaks, paste the whole file into https://jsonlint.com — it points
to the exact line.

---

## Replacing the logo

The logo shows in the top-left and as the big hero image. It lives in two files
in the `images/` folder: **`logo.png`** and **`logo.webp`**. To change it,
replace both with your new artwork using the same filenames. A logo on a
**black background** works best (the site blends the black away so only the
artwork shows). Keep it roughly square.

---

## Changing the social & contact links

These are in `index.html` (the footer). Search for `footer__social` and
`mailto:` and replace the placeholder `#` and email with your real links.
This is the one spot that's in HTML — just swap the web addresses, don't change
anything around them.

---

## Publishing your changes

Your site is connected to GitHub + Netlify. To put changes live:

**Easiest (in GitHub's website):**
1. Go to your repository on github.com.
2. Open the file you want to change (e.g. `products.json`), click the pencil ✏️.
3. Make your edit, scroll down, click **Commit changes**.
4. Netlify sees the change and republishes in ~1 minute. Done!

**To add image files**, use GitHub's **Add file → Upload files** button on the
`images/products/` folder, then commit.

That's it. Edit `products.json`, commit, and your shop updates itself. 🌸
