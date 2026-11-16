# Theana website

Stealth static site for Theana Biosystems (noindex, crawlers blocked). Plain HTML/CSS in `site/`, no build step.

The enquiry form is a Tally form (tally.so/r/LDKW4G) embedded on /enquire; Tally emails submissions to hello@theanabio.com. A Worker that emails submissions directly is parked in `later/enquiry-worker/`.

`site/_redirects` keeps old URLs working (/our-answer to /our-farm). See CHANGES.md.
