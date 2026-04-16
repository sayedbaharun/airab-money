# Production Checklist

Last reviewed: 2026-04-16

This is the final launch checklist for AIRAB Money after the soft-launch cleanup pass.

## Already In Place

- [x] Public navigation is reduced to launch-safe sections only
- [x] `Briefings`, `Analysis`, and public `Studio` routes are hidden from the public nav
- [x] Privacy page, terms page, favicon, manifest, `robots.txt`, and `sitemap.xml` exist
- [x] Newsletter, contact, and guest submission flows write to the database
- [x] Admin dashboard includes a private `Studio Lab` for workflow testing
- [x] Homepage and markets surfaces use honest soft-launch states instead of fake editorial fallbacks
- [x] Automated QA covers visible routes, hidden-route redirects, forms, admin login, and mobile overflow
- [x] Production Railway deploy is live and `/api/health` returns `ok`

## Must Finish Before Public Announcement

- [ ] Replace the remaining test article with real launch coverage
- [ ] Publish a minimum launch inventory:
  - 5 distinct articles at minimum
  - 1 strong lead story for the homepage
  - clean metadata, source links, and hero images where needed
- [ ] Connect the public markets surface to the final live market data source
- [ ] Remove any remaining `snapshot` language once the market feed is truly live
- [ ] Set final production env values:
  - `ADMIN_PASSWORD`
  - OpenAI-related env vars if content tools will be used in production
  - `VITE_GA_MEASUREMENT_ID`
  - confirm `VITE_SITE_URL` matches the final public domain
- [ ] Decide the final public domain and confirm DNS/canonical URL setup
- [ ] Confirm the launch article and homepage copy are the exact versions you want indexed

## Launch-Day Smoke Test

1. Check `https://airab-money-production.up.railway.app/api/health`
2. Verify homepage lead story, archive cards, and markets module load correctly
3. Open one article page and verify headline, metadata, source link, and image behavior
4. Submit one test newsletter signup
5. Submit one test contact form
6. Submit one test guest application
7. Verify admin login still works
8. Confirm privacy page, terms page, sitemap, and robots are publicly reachable
9. Confirm analytics is firing in the browser if GA is enabled
10. Verify mobile layout on homepage, markets, contact, and article pages

## Post-Launch: First 24 Hours

- [ ] Watch for broken links, empty sections, and malformed article content
- [ ] Check database entries for newsletter, contact, and guest submissions
- [ ] Confirm market data freshness and label accuracy
- [ ] Review analytics traffic and top landing pages
- [ ] Keep hidden sections hidden until they have real inventory and a real operating workflow

## Post-Launch: First Week

- [ ] Publish on a consistent cadence so the site does not look abandoned
- [ ] Review the soft-launch backlog in `docs/soft-launch-backlog.md`
- [ ] Decide when to reopen `Briefings`, `Analysis`, and public `Studio`
- [ ] Rotate the admin password once soft-launch testing is over
