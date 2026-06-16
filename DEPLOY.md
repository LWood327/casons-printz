# Deploy Guide — Cason's Printz (GitHub + Netlify)

The project is already a git repository with commits ready to go. These steps
push it to GitHub and connect Netlify so the site goes live and auto-updates on
every change. You only do this **once.**

---

## Part 1 — Put the code on GitHub

### Option A — GitHub CLI (fastest, if you have `gh` installed)
From the project folder:
```powershell
gh auth login                      # one-time sign in
gh repo create casons-printz --public --source . --remote origin --push
```
Done — your code is on GitHub.

### Option B — GitHub website (no tools needed)
1. Go to https://github.com/new
2. Repository name: **casons-printz** → keep it **Public** → **Create
   repository**. (Don't add a README — we already have one.)
3. GitHub shows a "push an existing repository" snippet. From the project
   folder, run (replace `YOUR-USERNAME`):
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/casons-printz.git
   git branch -M main
   git push -u origin main
   ```

---

## Part 2 — Connect Netlify

1. Go to https://app.netlify.com and sign up / log in (the **GitHub** login
   option is easiest).
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, authorize Netlify, and pick the **casons-printz** repo.
4. Build settings — Netlify reads `netlify.toml` automatically, so just confirm:
   - **Build command:** *(empty)*
   - **Publish directory:** `.`
5. Click **Deploy site.** In ~1 minute you'll have a live URL like
   `https://random-name-123.netlify.app`.

---

## Part 3 — Set the site name

1. In Netlify: **Site configuration → Site details → Change site name.**
2. Set it to **casonsprintz** → your site becomes
   **https://casonsprintz.netlify.app** (if the name is taken, pick a close
   variant).

---

## Part 4 — From now on: auto-deploy

Every time you push to GitHub (or edit a file on github.com and commit),
Netlify rebuilds and updates the live site automatically in about a minute.
Nothing else to do.

---

## Later — custom domain (optional)

When you own `casonsprintz.com`:
1. Netlify → **Domain management → Add a domain.**
2. Follow Netlify's DNS instructions at your domain registrar.
3. Netlify provisions HTTPS automatically.

---

## Before you take REAL money

Switch Stripe from test links to live links — see `STRIPE_SETUP.md` Part 4.
