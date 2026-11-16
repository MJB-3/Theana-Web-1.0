# Enquiry form Worker (parked)

Emails form submissions to hello@theanabio.com via Cloudflare Email Service. Parked because Email Sending needs the Workers Paid plan ($5/month).

To switch on later:
1. Upgrade to Workers Paid and onboard theanabio.com under Email Service > Email Sending (keep a single SPF record).
2. Move `wrangler.jsonc` to the repo root and `index.js` to `worker/index.js`; set `"main": "worker/index.js"` and assets `"directory": "./site"`.
3. In `site/enquire.html` set the form back to `action="/api/enquiry" method="post"` and restore the fetch-based `enquire.js` (git history, commit "Restructure site for buyers").
