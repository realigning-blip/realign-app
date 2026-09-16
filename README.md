# Realign — Career Explorer Prototype

A frontend-only, click-through prototype of the HPM v0 flow: **Welcome →
Age check → Interest discovery (tools/activities + subjects) → Priority
ranking → Recommendations → Career page → Compare → Explore More.**

This is a *prototype*, not the MVP build. State lives in memory only —
there's no backend, no database, no auth, and nothing persists on
refresh. It exists to make the locked product decisions clickable, not
to be extended directly into production code.

---

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To produce a static build (e.g. to preview on Vercel/Netlify manually):

```bash
npm run build
npm run preview
```

---

## What's implemented, and where it comes from

| Feature | Source decision |
|---|---|
| Two age brackets, one shared engine | `roadmap-v2.md`, `hpm-v0-and-recommendation-spec.md` — bracket content is config-keyed in `App.jsx`, not branched, matching the "config over code" architecture note |
| Interest card-sort (tools/activities) + subject picker, union-match pooling | `hpm-v0-and-recommendation-spec.md` §1 |
| Energy micro-tap (energized/drained) | §2 — captured, descriptive only, no ranking weight |
| Forced priority ranking drives all ordering | §6 — same component reused for onboarding and the "play with it" re-rank |
| Curiosity as a standalone, unscored "Explore More" section | §3 |
| Aptitude shown as career metadata only, no capture screen | §4 |
| Personality — absent entirely | §5 |
| Constraints as flags, not scores | §8 (income-bracket field described in the spec as reserved/inert is **not implemented here at all** — it's a Phase 2, legal-review-gated field, so it's intentionally left out rather than faked) |
| Income shown as a smoothed, right-skewed density curve, not a bell curve or histogram | `founder-manual.md` Addendum A13 |
| Bracket-specific income display (plain-language for 11–14, full curve + experience tag for 15–18) | A13 |
| Thin-data careers rendered visibly differently (dashed line, "limited data" label) | A13's honesty requirement |
| Dual-lens (development + sustainability) future-demand reasoning, hidden behind honestly-labeled expandable | Addendum A9 |
| Not Me / Maybe / Love This feedback | `product-decisions-v1.md` §8 |
| Career comparison view | `founder-manual.md` §16, MVP flow |

## What's intentionally *not* here

These are real build items that don't belong in a frontend-only
prototype, and are called out so nobody mistakes this for further along
than it is:

- No Supabase, no database, no API layer, no auth
- No consent/notice screen (see `mvp-build-plan.md`'s DPDP section —
  this needs to exist before any real student ever opens the app)
- No regulated data pipeline — the 8 careers in `src/App.jsx` are
  hand-written fixtures, not sourced from vetted channels
- No persistence of "Not Me" feedback across sessions (flagged as an
  open item in the roadmap)
- Geography-availability granularity and the confidence-indicator
  visual are both still open per the spec — this prototype picked a
  simple version of each just to have something clickable, not as a
  final design decision

## Project structure

```
realign-prototype/
├── index.html          # Vite entry HTML
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx         # mounts <CareerExplorerApp />
│   ├── App.jsx           # the entire prototype: data, screens, logic
│   └── index.css         # minimal reset
└── README.md
```

Everything — mock career data, screen components, scoring logic — lives
in `src/App.jsx` for now since it's a single-purpose prototype. If this
becomes real Engineering work, the natural first split (per
`hpm-v0-and-recommendation-spec.md`'s schema-implications section) is:
career data → its own module or API call, scoring logic → its own
testable function, screens → one file each.

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Career explorer prototype (frontend-only, HPM v0 flow)"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

## Next steps if this becomes the real build

See `mvp-build-plan.md` and `roadmap-v2.md` Phase 3 for the full build
plan (Supabase schema, API surface, TWA packaging for Google Play). The
four open items blocking Engineering schema design — aptitude capture
conflict, constraints schema conflict, Sector 6 assignment, Sector
10/12 discrepancy — are listed in the project's working memory and
should be resolved before this prototype's data model is treated as a
real schema.
