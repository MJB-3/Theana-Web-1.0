# Theana website

Stealth static site for Theana Biosystems (noindex, crawlers blocked). Plain HTML/CSS in `site/`, no build step.

A small Worker (`worker/index.js`, config in `wrangler.jsonc`) handles the enquiry form at `POST /api/enquiry` and emails hello@theanabio.com through Cloudflare Email Service. All other requests are served from `site/`.

Setup needed once: onboard theanabio.com under Cloudflare Email Service > Email Sending. Until then the form shows a "please email us" fallback.

`site/_redirects` keeps old URLs working (/our-answer to /our-farm). See CHANGES.md.
