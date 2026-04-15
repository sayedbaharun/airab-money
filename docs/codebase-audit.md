# Codebase Audit

Last reviewed: 2026-04-15

## Definitely Unused In The Current Frontend

- `src/components/Navbar.tsx`
  No current imports. The public shell now uses `src/components/EditorialLayout.tsx` with `Sidebar.tsx` and `Footer.tsx`.

- `src/components/NewsletterSignup.tsx`
  No current imports. The component also uses an older bright visual style that no longer matches the editorial system.

- `src/hooks/use-mobile.tsx`
  No current imports.

- `src/lib/utils.ts`
  Exports `cn()` but nothing imports it in the current codebase.

- `public/images/avatars/nora/*`
  No longer referenced after the About page moved away from fictional human host profiles.

- `public/images/avatars/omar/*`
  No longer referenced after the About page moved away from fictional human host profiles.

## Likely Removable If Not On The Roadmap

- Newsletter flow
  Files and paths:
  `src/lib/api.ts`
  `server/src/index.ts`
  `server/prisma/schema.prisma`

  The backend still exposes `/api/newsletter/subscribe`, and the API client still exports `subscribeToNewsletter()`, but the only frontend consumer was `NewsletterSignup.tsx`, which is unused. If a newsletter is not part of v1, this whole flow is a cleanup candidate.

- `public/images/logos/*`
  These logo assets are not referenced by the runtime frontend. If they are only kept as source assets, they should probably live outside `public/` so they are not shipped with the app.

- `public/use.txt`
  No runtime references found. Looks like a leftover note file rather than part of the app.

## Stale Docs That Should Be Reviewed Or Removed

- `IMPLEMENTATION_COMPLETE.md`
  Mentions the old `Navbar.tsx` and a `/presenters` route that does not exist in the current app.

- `VERIFICATION_COMPLETE.md`
  Same issue: references the old navbar-based navigation and `/presenters`.

- `LAUNCH_ANALYSIS.md`
  Operationally useful in parts, but it describes an earlier product state and should be reviewed for accuracy.

- `QUICK_START.md`
  Likely still partially useful, but it predates the current editorial shell and should be checked against the live setup.

## Notes

- I did not delete any of the items above in this pass.
- The goal of this file is to separate clearly dead code from things that are only probably stale so cleanup can happen safely.
