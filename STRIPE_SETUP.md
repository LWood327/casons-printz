# Stripe Setup — Cason's Printz

> ✅ **Status:** Test-mode Payment Links for all 10 products have already been
> created (in the "clothing shop sandbox" Stripe account) and wired into
> `products.json`. The 5 custom items include the required **Design details**
> field, and all collect a US shipping address. You can test checkout right now
> with the test card below. **The only thing left for real sales is "Going
> live" (Part 4).** The rest of this guide explains how it all works and how to
> add/redo links yourself.

This site has **no backend**. Payments run through **Stripe Payment Links** —
one link per product. You create the links in your Stripe dashboard (free) and
paste each URL into `products.json`. That's the whole integration.

You do **not** need any secret keys in the website for this to work. Payment
Link URLs are safe to put in `products.json`.

---

## Part 1 — One-time account setup (~10 min)

1. Go to **https://stripe.com** and create a free account.
2. You'll start in **Test mode** (a toggle in the top-right of the dashboard
   says "Test mode"). Leave it ON while we build — test mode uses fake cards,
   no real money moves.
3. You can create products and links immediately. You only need to add your
   bank details later, when you're ready to switch to **Live mode** and take
   real payments (Part 4).

---

## Part 2 — Create a Payment Link for each product (~3 min each)

Do this for all 10 products (5 premade + 5 custom).

1. In the Stripe dashboard, go to **Product catalog → Payment Links → New**
   (or visit https://dashboard.stripe.com/test/payment-links).
2. Click **+ New link → Products**.
3. **Add a product:**
   - **Name:** match the product name in `products.json` (e.g. `Sakura Drip Tee`)
   - **Price:** the price from `products.json` (e.g. `32.00 USD`)
   - (Optional) add an image — your real product photo.
4. **For CUSTOM items only** — add a field so customers can type their design:
   - Scroll to **"Custom fields"** → **Add custom field**
   - Type: **Text**
   - Label: **`Design details`**  ← use this exact label
   - Mark it **Required**
   - (The website automatically copies the customer's typed design to their
     clipboard and tells them to paste it into this box at checkout. Their
     design then shows up on the order in your dashboard.)
5. (Recommended for shipping) turn on **"Collect customers' addresses →
   Shipping address."**
6. Click **Create link** and **copy the URL.** It looks like:
   `https://buy.stripe.com/test_xxxxxxxxxxxxxxxx`

---

## Part 3 — Paste the links into `products.json`

Open `products.json`. Find each product and paste its URL into the
`"stripeLink"` field:

```json
{
  "id": "premade-1",
  "name": "Sakura Drip Tee",
  "price": "$32",
  ...
  "stripeLink": "https://buy.stripe.com/test_xxxxxxxxxxxxxxxx"
}
```

Save the file. That product's **Buy Now** / **Order Custom** button now works.

> Tip: make sure the price in `products.json` matches the price on the Stripe
> link. The website shows the `products.json` price; Stripe charges the link
> price. Keep them in sync.

### What the customer's order will show you
- **Size** appears as the order's `client_reference_id` (e.g. `premade-1_M`).
- **Custom design** appears in the **Design details** custom field.
- Both are visible on the payment in your Stripe dashboard.

---

## Part 4 — Going live (when you're ready for real money)

1. In Stripe, complete **account activation**: add your business info and
   **bank account** for payouts.
2. Flip the dashboard from **Test mode** to **Live mode** (top-right toggle).
3. **Recreate each Payment Link in Live mode** (test links don't work live).
   Live URLs look like `https://buy.stripe.com/xxxxxxxx` (no `test_`).
4. Replace each `stripeLink` in `products.json` with its new **live** URL.
5. Commit + push — Netlify redeploys and you're taking real payments.

---

## Test card (Test mode only)

Use these at checkout to simulate a successful payment:

- Card number: **4242 4242 4242 4242**
- Expiry: any future date (e.g. `12/34`)
- CVC: any 3 digits (e.g. `123`)
- ZIP: any (e.g. `12345`)

More test cards: https://stripe.com/docs/testing
