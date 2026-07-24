# Single-HTML CMS Site — GitHub Pages Implementation Plan

## Goal

Produce one self-contained HTML document that can be pasted into a CMS (content
management system) code widget. This single HTML contains the **entire public
COK website** — home, recipes, gallery, contest, and game — rendered as
hash-navigated sections within one page. All CSS and JavaScript is embedded or
loaded from hosted URLs on GitHub Pages; binary assets (images, SVGs) are
served from GitHub Pages, not from the CMS.

## URL Architecture

| URL | Serves | Notes |
|-----|--------|-------|
| `https://product-tpml.github.io/COK/` | New root `index.html` (single HTML) | GitHub Pages root landing. Created by placing `index.html` at repository root. |
| `https://product-tpml.github.io/COK/youtube%20season%204%20links/` | Legacy multi-page site (existing) | **Untouched.** All files under this directory remain in place, serving the old site indefinitely. |

The root `index.html` becomes the new GitHub Pages landing page. It replaces
the auto-generated directory listing but **does not alter or shadow** the
legacy nested URL — both URLs coexist.

## Root Organization (Additive, Safe)

```
COK/
  index.html                 ← NEW: root single-page site
  site/                      ← NEW: consolidated hosted assets
    style.css                ← extracted from legacy common.css + page styles
    main.js                  ← extracted nav, page logic, game
    icon_data.js             ← game pixel icon data
    assets/                  ← copies of gallery photos
    svg/                     ← copies of ingredient SVGs
    S5 Logo Circle.png       ← copy
    S5 Logo Rect.png         ← copy
  youtube season 4 links/    ← UNTOUCHED (legacy)
  .nojekyll                  ← already present (disables Jekyll)
```

### Why copy rather than move assets?

GitHub Pages serves raw files from the repository. If we want clean asset URLs
like `https://product-tpml.github.io/COK/site/assets/photo.jpg` instead of
`https://product-tpml.github.io/COK/youtube%20season%204%20links/assets/photo.jpg`,
we must create new paths. Moving the legacy directory would break all existing
bookmarks, embeds, and the old site. Copying is the safe additive approach —
the legacy site continues working, and the new site gets clean URLs.

## CMS Capability Gate

This approach **works** if the CMS code widget supports:

- **`<script src="...">`** with external URLs — yes, standard
- **`<link href="..." rel="stylesheet">** with external URLs — yes, standard
- **YouTube iframe embeds** — yes, standard HTML
- **Hash navigation** (`window.location.hash`) — yes, browser native

No special CMS plugin, sandbox escape, or server-side capability is required.

## Implementation Phases

### Phase 1 — Asset Inventory & URL Validation

- [ ] List every binary asset in the legacy directory
  - Gallery photos (`assets/*.jpg`)
  - Ingredient SVGs (`indian_market_assets_48x48_svg/*.svg`)
  - Logo files (`S5 Logo Circle.png`, `S5 Logo Rect.png`)
  - Player sprite (`Player.png` — see ignored files note below)
- [ ] Copy each asset to `site/assets/`, `site/svg/`, or `site/` as appropriate
- [ ] Commit copies and push to verify GitHub Pages URLs resolve
- [ ] Document final hosted URLs for use in the single HTML

### Phase 2 — Root Layout Shell

- [ ] Create root `index.html` with empty section placeholders:
  - `#home` — hero + featured carousels + gallery lightbox
  - `#recipes` — recipe grid + season tabs + jump panel
  - `#gallery` — gallery grid + lightbox
  - `#contest` — prize cards + CTA
  - `#game` — full game canvas + overlays
- [ ] Implement hash-based navigation (show/hide sections via `hashchange`)
- [ ] Build header/nav as static DOM (not injected) to reduce JS
- [ ] Add mobile bottom nav

### Phase 3 — HTML Section Merge

- [ ] Port each page's unique markup into its corresponding section
  - Home hero + featured carousels + gallery lightbox from `index.html`
  - Recipe grid + season tabs + jump-to panel from `recipes.html`
  - Gallery grid + lightbox from `gallery.html`
  - Contest prize cards + CTA from `contest.html`
  - Full game canvas + all overlay screens from `game.html`
- [ ] Resolve ID collisions (same IDs used across pages → prefix or scope)

### Phase 4 — CSS Extraction & Deduplication

- [ ] Extract common CSS (`common.css` variables, header, nav, sponsor bar) into `site/style.css`
- [ ] Extract page-specific CSS into the same file, namespaced by section
- [ ] Build CSS custom properties on `:root` for the theme (already done in common.css)
- [ ] Load `site/style.css` via `<link>` in the single HTML `<head>`
- [ ] Remove all inline `<style>` blocks from the single HTML (replaced by hosted CSS)

### Phase 5 — JavaScript Extraction & Deduplication

- [ ] Extract `nav.js` (header/sponsor injection → now static, but event handlers needed)
- [ ] Extract game code from `game.html` (IIFE, canvas loop, state machine, sprite data)
- [ ] Extract gallery/recipe lightbox and carousel logic
- [ ] Extract season data (video arrays, gallery image arrays)
- [ ] Place extracted JS in `site/main.js`, loaded via `<script src="...">` at end of `<body>`
- [ ] Game pixel icon data remains a separate static file (`site/icon_data.js`) loaded before `main.js`

### Phase 6 — Data Deduplication & ID Collision Handling

- [ ] **Seasons data** — both `index.html` and `recipes.html` contain identical `seasons[]` arrays → define once in shared JS
- [ ] **Gallery images** — both `index.html` and `gallery.html` contain identical image lists → define once
- [ ] **Ingredient emoji/SVG maps** — `game.html` and `icon_data.js` → keep as `icon_data.js`, loaded once
- [ ] **ID collisions** — pages define same IDs (`#lightbox`, `#nav-header`, etc.) → prefix with section name (`#home-lightbox`, `#gallery-lightbox`) or use class-based selectors
- [ ] **`injectNav(active)`** — called on every page with a different section name → replace with a single call that reads the current hash

### Phase 7 — Hash Navigation

- [ ] Listen for `hashchange` and `DOMContentLoaded` to determine active section
- [ ] On navigation: hide all sections, show the target, update `document.title`, update nav active state
- [ ] Deep-link support: `https://product-tpml.github.io/COK/#recipes` opens recipes directly
- [ ] Game section: on exit (navigating away), pause/destroy the game loop to save CPU

### Phase 8 — Game Lifecycle

- [ ] Game renders on an inline `<canvas>` within the `#game` section
- [ ] Game loop runs only when `#game` section is visible (check on each `requestAnimationFrame`)
- [ ] On section hide: stop game loop, save state to `sessionStorage`
- [ ] On section show: restore state or reset to title screen
- [ ] Reference hosted SVG ingredients at `https://product-tpml.github.io/COK/site/svg/chicken.svg` etc.

### Phase 9 — Absolute Asset URLs

- [ ] Replace all relative paths with absolute `https://product-tpml.github.io/COK/site/...` URLs
- [ ] SVG ingredient paths: `indian_market_assets_48x48_svg/...` → `https://product-tpml.github.io/COK/site/svg/...`
- [ ] Gallery image paths: `assets/...` → `https://product-tpml.github.io/COK/site/assets/...`
- [ ] Logo paths: `S5 Logo Circle.png` → `https://product-tpml.github.io/COK/site/S5 Logo Circle.png`
- [ ] YouTube thumbnail URLs (already absolute — `https://img.youtube.com/...`)
- [ ] Sponsor images (already absolute — `https://tpml-sites.s3.ap-south-1.amazonaws.com/...`)

### Phase 10 — GitHub Pages Deployment

- [ ] Commit root `index.html` + `site/` directory to `master` branch
- [ ] Push to `origin/master`
- [ ] Verify `.nojekyll` still exists (already present)
- [ ] Wait ~1-2 minutes for Pages build
- [ ] Verify root URL resolves to the new site

### Phase 11 — CMS Paste

- [ ] Open CMS code widget editor
- [ ] Paste the single HTML into the widget
- [ ] CMS serves the HTML on the property page
- [ ] Verify all external `<link>` and `<script>` loads resolve
- [ ] Verify YouTube iframes load and play
- [ ] Verify navigation works (hash-based)
- [ ] Verify game loads and is playable

### Phase 12 — Verification Checklist

- [ ] Root GitHub Pages URL loads complete site
- [ ] Legacy URL `youtube%20season%204%20links/` continues to serve the old site
- [ ] All 5 sections render correctly (home, recipes, gallery, contest, game)
- [ ] Hash navigation works (deep links, back/forward browser buttons)
- [ ] YouTube thumbnails load; clicking plays the video
- [ ] Gallery lightbox opens/closes, arrows navigate, keyboard + swipe work
- [ ] Season tabs switch recipe grids
- [ ] Jump-to-episode panel filters and scrolls
- [ ] Game loads, responds to touch/keyboard, completes dishes, game-overs, replays
- [ ] Game best streak persists in `localStorage`
- [ ] Sponsor carousels cycle
- [ ] Contest CTA button + T&C link work
- [ ] All images/SVGs load from GitHub Pages URLs (404 check on every asset)
- [ ] Google Fonts load
- [ ] No console errors from missing assets
- [ ] CMS-pasted version behaves identically to GitHub Pages version

## External Dependency List

| Dependency | Type | URL | Notes |
|------------|------|-----|-------|
| Google Fonts (Sora) | CSS | `https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700` | Preconnect also needed |
| Google Fonts (DM Sans) | CSS | `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500` | Included in same `@import` |
| YouTube thumbnails | Image | `https://img.youtube.com/vi/{id}/hqdefault.jpg` | 59 video IDs across 4 seasons |
| YouTube iframe embeds | iframe | `https://www.youtube.com/embed/{id}?...` | Click-to-load (poster pattern) |
| Sponsor images | Image | `https://tpml-sites.s3.ap-south-1.amazonaws.com/images/*.png` | 8 sponsor logos (Freedom, Indane, Prestige, Bhima, Lays, SBI, Vencobb, Eco Crystal) |
| T&C link | Anchor | `https://www.pravajani.net/cok2025tnc` | Contest terms |
| Google Analytics | JS (optional) | `dataLayer` / `gtag` | Game analytics, try/catch guarded, no-op if absent |

### YouTube Behavior Required

The click-to-play poster pattern must work:
1. User sees a YouTube thumbnail with a play button overlay
2. On click, the poster is replaced by a YouTube iframe
3. The iframe autoplays (`?autoplay=1`)
4. Each click loads only one video (previous video is destroyed, not hidden)

This is pure client-side JS — no CMS restriction prohibits it.

## Files Excluded from the Public Single Document

| File | Reason |
|------|--------|
| `character-sprite.html` | Developer-only sprite prototyping tool |
| `test_ingredients.html` | Developer-only ingredient test page |
| `widget_embed.html` | Duplicate of `contest.html` (identical content, different load method — uses jsDelivr CDN) |

These files remain in the repository under `youtube season 4 links/` but are
not ported into the single HTML.

## Ignored/Untracked Files

From `.gitignore`:

```
/youtube season 4 links/Player.png
/youtube season 4 links/transcripts/
/youtube season 4 links/widget_embed.html
```

**Key concern: `Player.png`**

The game renders a pixel-art character via canvas (inline sprite data in
`game.html`). It does **not** use `Player.png` at runtime — that file was a
design reference. The single HTML uses the same inline pixel data.

**GitHub Pages rule:** Only committed files are published. Since `Player.png`
is gitignored, it won't be available at any GitHub Pages URL. This is not an
issue for the current game implementation, but if a future version references
`Player.png` as an `<img>` source, it will 404.

**Decision needed:** If the game is ever modified to load `Player.png` as an
image asset instead of rendering pixel data on canvas, the file must be either:
- Removed from `.gitignore` and committed, or
- Copied to `site/` and committed under a clean path

## Acceptance Criteria

- [ ] `https://product-tpml.github.io/COK/` loads the complete site with all 5 sections
- [ ] `https://product-tpml.github.io/COK/youtube%20season%204%20links/` still works unchanged
- [ ] Every hash route loads the correct section (`#home`, `#recipes`, `#gallery`, `#contest`, `#game`)
- [ ] All YouTube videos play on click; no CORS/embed errors
- [ ] Game is fully playable: start, catch, miss, level up, game over, replay, localStorage persistence
- [ ] Gallery lightbox works with all 20 photos, swipe on mobile
- [ ] Recipe grid filters by season tab, jump panel searches and scrolls
- [ ] Sponsor bar displays and cycles on mobile
- [ ] All asset URLs are absolute and resolve to GitHub Pages (no 404s)
- [ ] CMS-pasted version is identical in behavior to the direct GitHub Pages URL
- [ ] No dev-only files appear in the single HTML

## Rollback & Preservation Rules

| Action | Rule |
|--------|------|
| Modify legacy files | **Never.** No file under `youtube season 4 links/` is touched. |
| Delete legacy files | **Never.** They remain as the old site indefinitely. |
| Remove `.gitignore` entries | Only if a formerly ignored file is needed as a published asset. |
| Rename legacy directory | **Never.** Would break the existing GitHub Pages URL. |
| Change Git Pages source branch | **Never.** Keep `master` branch as source. |
| Add new root files | **Safe.** `index.html` and `site/` are additive. |

## Hosted URL Pattern

```
https://product-tpml.github.io/COK/site/style.css
https://product-tpml.github.io/COK/site/main.js
https://product-tpml.github.io/COK/site/icon_data.js
https://product-tpml.github.io/COK/site/S5 Logo Circle.png
https://product-tpml.github.io/COK/site/S5 Logo Rect.png
https://product-tpml.github.io/COK/site/assets/20-hubli-18-Cuisines%20of%20Karnataka.JPG
https://product-tpml.github.io/COK/site/svg/chicken.svg
...
```

All URLs are under `https://product-tpml.github.io/COK/site/`. Gallery photos
retain their original filenames (URL-encoded for spaces). The single HTML
references these absolute URLs directly.

## Risks

| Risk | Mitigation |
|------|------------|
| CMS strips `<script>` tags | Test in the target CMS before committing to this approach. Most CMS code widgets preserve `<script>`. |
| YouTube iframe autoplay blocked by browser autoplay policy | User gesture (click on poster) satisfies the policy. The iframe is created and appended after click. |
| Hash navigation breaks deep links from search engines | Search engines index static content, not hash fragments. Ensure the home section has a canonical `<link>`. Alternatively, add server-side rendering — not recommended for this scope. |
| Asset URL changes invalidate cached single HTML | Assets are versioned by commit SHA in practice (GitHub Pages). Use `?v={short-sha}` query param on asset URLs during development if cache-busting is needed. |
| Game performance on low-end devices | Canvas rendering is lightweight (pixel arrays, ~864 `fillRect` calls per frame). Game loop pauses when section is hidden. |
| `.nojekyll` file not present | **Already present.** Confirmed in repository root. |

## Summary

This plan produces a single HTML file that:
1. Lives at **repository root** → served by GitHub Pages at `https://product-tpml.github.io/COK/`
2. Loads **CSS, JS, images, and SVGs from hosted GitHub Pages URLs** under `site/`
3. Contains **all 5 sections** (home, recipes, gallery, contest, game) with **hash navigation**
4. Leaves the **legacy directory untouched** — old site continues at its existing URL
5. Can be **pasted into a CMS code widget** as-is
6. Retains full game functionality including localStorage persistence

The single HTML is the **public face** of the site. The `site/` directory is the **asset host**.
The legacy directory is the **preserved original**. All three coexist without conflict.
