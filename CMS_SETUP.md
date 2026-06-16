# Content Editor (Admin Panel) — Setup & Use

Cason's Printz has a built-in **admin panel** at `/admin` where you can edit the
site's text, product names, descriptions, photos, prices, and social links —
all in friendly forms, no code or JSON. It's powered by **Decap CMS** + Netlify.

- **It is private.** Only people you invite can log in. Customers never see it.
- **It publishes itself.** When you click *Publish*, your change is saved to
  GitHub and Netlify rebuilds the live site in ~1 minute.

---

## One-time setup (do this once, after the site is on Netlify)

The admin login only works once the site is deployed to Netlify, because it uses
Netlify's free login service.

1. **Deploy to Netlify** first (see `DEPLOY.md`).
2. In your Netlify site dashboard, go to **Integrations / Identity** and click
   **Enable Identity**. (On newer Netlify UIs this may be under
   *Site configuration → Identity*.)
3. Under **Identity → Registration**, set it to **Invite only** (so randoms
   can't sign up).
4. Under **Identity → Services → Git Gateway**, click **Enable Git Gateway.**
   (This is what lets the editor save your changes back to the site.)
5. Still under Identity, click **Invite users** and invite your own email
   (`logan.p.woods@gmail.com`, or whoever will edit).
6. Check that inbox for the invite email, click the link, and **set a password.**
   The link opens the site — if it doesn't drop you into the editor, just go to
   `https://casonsprintz.netlify.app/admin/` and log in.

That's it — setup is done forever.

---

## Everyday use

1. Go to **`https://casonsprintz.netlify.app/admin/`**
2. Log in with the email + password you set.
3. You'll see two sections:
   - **Site Text & Links** — hero tagline, the two section blurbs, contact
     email, and Instagram/TikTok/X links. (Leave a social box blank to hide it.)
   - **Products** — your Premade and Custom items. Click one to edit its name,
     description, price, sizes, and **drag-and-drop a new photo.**
4. Make your change and click **Publish** (top of the page).
5. Wait ~1 minute and refresh the live site — your change is there.

### Adding or removing a product
In **Products → Product Catalog**, use the **＋** under "Premade items" or
"Custom items" to add one, or the trash icon to remove one. Fill in the name,
price, description, sizes, and photo. For a brand-new product that needs to be
**purchasable**, send the new item to your developer so a Stripe payment link
can be created and added.

---

## ⚠️ Important: changing a PRICE

The price field updates **the number shown on the website only.** Because each
product also has a fixed price inside Stripe (which actually charges the
customer), changing the website price does **not** change what Stripe charges.

So when you change a price:
1. Update it in the admin panel (so the site shows the right number), **and**
2. Tell your developer the new price so they update the Stripe payment link —
   otherwise customers would be charged the old amount.

Everything else (text, names, descriptions, photos, social links) is fully
self-serve with no developer needed. 🌸
