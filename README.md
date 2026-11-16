# Theana website

Stealth static site for Theana Biosystems (noindex, crawlers blocked). Plain HTML/CSS in `site/`, no build step.

The enquiry form opens the visitor's email app with a pre-filled message to hello@theanabio.com (no backend). A Worker that emails submissions directly is parked in `later/enquiry-worker/` until the Workers Paid plan is worth it.

`site/_redirects` keeps old URLs working (/our-answer to /our-farm). See CHANGES.md.
