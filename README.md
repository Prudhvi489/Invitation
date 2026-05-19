# Prudhvi & Harini — Wedding Invitation

An elegant, mobile-friendly digital wedding invitation. Guests scan a QR code on your printed cards to open this page.

## Preview locally

```bash
cd InviteCard
npx --yes serve .
```

Open the URL shown (usually `http://localhost:3000`).

## Update venues & map links

Edit [`config.js`](config.js):

```js
window.INVITE_CONFIG = {
  wedding: {
    venueName: "Your wedding hall name",
    mapUrl: "https://maps.google.com/...",  // Google Maps share link
  },
  reception: {
    venueName: "Jangareddigudem",
    mapUrl: "https://maps.google.com/...",  // paste your map URL here
  },
};
```

Redeploy after changing `config.js` so the QR code still points to the same URL but shows updated details.

## QR code for printed cards

1. Deploy the site (see below) and copy your live URL, e.g. `https://your-name.vercel.app`
2. Generate a QR at [qr.io](https://qr.io), [goqr.me](https://goqr.me), or any QR generator
3. Point the QR to that URL — **do not** change the URL after printing unless you reprint cards
4. Test by scanning with your phone before printing

## Deploy on Vercel (recommended)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Framework preset: **Other** (static site, no build command)
4. Deploy — your URL will be `https://<project>.vercel.app`

Or with the CLI:

```bash
npm i -g vercel
vercel
```

## Deploy on GitHub Pages

1. Create a repo and push this project
2. In the repo: **Settings → Pages → Build and deployment**
3. Source: **GitHub Actions** (workflow included) or **Deploy from branch** → `main` / `/ (root)`
4. Your site will be at `https://<username>.github.io/<repo-name>/`

If using a project site (URL includes repo name), no extra config is needed. For a user site (`username.github.io` only), put files in the repo root.

## Files

| File        | Purpose                          |
|------------|-----------------------------------|
| `index.html` | Invitation content & structure |
| `styles.css` | Elegant burgundy & gold theme    |
| `config.js`  | Venue names & map URLs           |
| `main.js`    | Applies config, subtle animation |
