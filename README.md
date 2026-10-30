# ZHIVEY FASHION

Static fashion storefront for GitHub Pages + Cloudflare Worker + D1.
Currency: IDR. WhatsApp: 6287812295357.

## Architecture
- GitHub Pages: public storefront and admin UI.
- `data/products.json` and `assets/products/`: public catalog and product images in GitHub.
- Cloudflare Worker: secure admin API, GitHub Contents API writes, order API.
- Cloudflare D1: private orders and customer details.
- jsPDF: browser-generated downloadable invoice for buyer and admin.

## 1. GitHub setup
1. Create a public repository named `ZHIVEY-FASHION`.
2. Upload this project to the repository root.
3. In **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Your site will be published at `https://YOUR_GITHUB_USERNAME.github.io/ZHIVEY-FASHION/`.
5. Edit `assets/js/config.js`: set `workerBaseUrl` to your deployed Worker URL.

## 2. Cloudflare Worker + D1 setup
Install Wrangler, then from `worker/`:
```bash
npm install
npx wrangler d1 create zhivey-fashion-db
```
Copy the returned database_id into `worker/wrangler.toml`.
```bash
npx wrangler d1 execute zhivey-fashion-db --remote --file=schema.sql
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npx wrangler secret put GITHUB_TOKEN
npx wrangler deploy
```
Create a GitHub fine-grained personal access token scoped only to this repository with **Contents: Read and write**. Store it as `GITHUB_TOKEN`; never put it in frontend code.
Set Worker variables in `wrangler.toml`:
- `GITHUB_OWNER`: your GitHub username or organization
- `GITHUB_REPO`: `ZHIVEY-FASHION`
- `GITHUB_BRANCH`: `main`
- `ALLOWED_ORIGIN`: exact GitHub Pages origin, e.g. `https://YOUR_GITHUB_USERNAME.github.io`
- `SITE_BASE_PATH`: `/ZHIVEY-FASHION` (or empty if using a custom domain)

The Worker URL is shown after deploy, e.g. `https://zhivey-fashion-api.YOUR_SUBDOMAIN.workers.dev`. Put that URL in `assets/js/config.js`.

## 3. Admin access
Open `/admin/`. Sign in with the password configured using `wrangler secret put ADMIN_PASSWORD`.
The Worker issues a signed session token. Change the password and session secret before production.
For stronger access control, put Cloudflare Access in front of the Worker/admin route and restrict it to trusted email addresses.

## 4. Product management
Admin can add, edit, and delete products. Product metadata is committed to `data/products.json` using the GitHub Contents API. Uploaded product images are committed under `assets/products/`.
Large images increase repository size. Resize/compress images before uploading (recommended: WebP/JPEG, max 1600px, ideally under 500 KB).
GitHub API write limits and repository size make this approach suitable for a small/medium catalog, not a high-volume marketplace.

## 5. Orders and invoices
Checkout validates the product/variant and current stock against the latest GitHub catalog, then saves the order in D1. It opens WhatsApp with the order summary. The buyer can download a PDF invoice after checkout; admin can open orders and download the same invoice.
The WhatsApp conversation is not proof of payment. Admin should confirm payment and delivery manually.
Stock is not automatically decremented in this starter version; admin updates stock after confirming an order. Add a reservation/decrement workflow before high-volume use.

## 6. Important security notes
- Customer/order data stays in D1, not in the public GitHub repository.
- Never expose `GITHUB_TOKEN`, `ADMIN_PASSWORD`, or `ADMIN_SESSION_SECRET` in browser code.
- Use HTTPS (GitHub Pages and Workers provide HTTPS).
- Set `ALLOWED_ORIGIN` narrowly. CORS is not authentication; the signed admin session is also required.
- Configure backups for D1 and test restore before production.
- This is a deployable starter implementation. Review privacy notice, consumer terms, tax/shipping rules, and security before accepting real payments.

## Local preview
Run a static server from the project root (for example `python -m http.server 8000`) and open `http://localhost:8000`.
