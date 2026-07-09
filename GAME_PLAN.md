# COK Game Plan — "Recipe Catcher"

A mobile-first, single-file arcade game for the Cuisines of Karnataka property.
Catch falling ingredients in the right lanes to build a Karnataka dish.

---

## Concept

You're a cook. A dish is called out at the top of the screen with its
ingredient checklist. Ingredients rain down in 3 lanes. Move your basket
left/right to catch the **correct** ones and complete the recipe. Catch a
wrong ingredient → lose a heart. Three hearts lost = game over.

Each round = one random dish from the pool. Streak counter tracks consecutive
completed dishes. Speed and wrong-ingredient frequency ramp with streak,
capped to stay readable on mobile.

After each completed dish (and on game over), a **"Watch this recipe"** CTA
links back to the corresponding COK YouTube episode — making the game a
discovery layer for the show, not just a standalone toy.

**Why this game:** replayable (random dish each round), arcade-fun, thematically
tight (you're literally cooking by catching), and the "Game" nav slot already
exists in `video_embed.html` — drops right into the property.

---

## Mobile-First Design

- **Portrait canvas**, ~9:16 aspect, scales to viewport height
- **3 lanes** (left / center / right) — 4 gets cramped on narrow phones
- **Subway Surfers-style movement**: one tap or swipe moves the basket
  **one lane at a time**. If basket is in the left lane and user taps/swipes
  right, it moves to center — not directly to the right lane. This makes the
  game skill-based and prevents teleport-feel.
- **Big touch targets** — basket spans most of a lane width
- **Thumb-friendly** — all action in lower third, playable one-handed
- **No keyboard dependency** — touch is primary, keys are bonus
- **Responsive**: canvas resizes to `100dvh`, lanes recompute on resize
- **No scroll** — game fills viewport, page doesn't scroll during play

### Controls (v1)

| Input | Action |
|-------|--------|
| Swipe left | Move basket one lane left |
| Swipe right | Move basket one lane right |
| Tap left half | Move basket one lane left |
| Tap right half | Move basket one lane right |
| Arrow Left / Right | Desktop fallback — one lane per press |

**Onboarding copy** (title screen): *"Swipe or tap sides to move.
Catch the right ingredients. Avoid spoiling the dish."*

### Layout (portrait)

```
┌─────────────────────┐
│  White Chicken Pulao│  ← target dish name
│  ☑ 🍗Chicken ☐ 🍚Rice│  ← ingredient checklist (live)
│  ☐ 🥥Coconut        │
├─────────────────────┤
│  [🥥Coconut]        │  ← falling token cards (3 lanes)
│       [🌿Curry Lvs] │
│  [🍗Chicken]        │
│        ▼            │
│      [ 🧺 ]         │  ← basket (player)
├─────────────────────┤
│ Streak: 3  ❤❤❤     │  ← HUD: streak + hearts
└─────────────────────┘
```

---

## Game Mechanics

### Core Loop
1. Pick random dish (no immediate repeat — last dish excluded) → show name + ingredient checklist at top
2. Ingredients begin falling in random lanes at intervals
3. Player moves basket (swipe/tap one lane at a time) to catch
4. **Correct catch** → check off ingredient, ding, +10 pts
5. **Wrong catch** → lose one heart ❤, buzz, combo reset
6. **Missed correct ingredient** (falls past basket) → **combo reset + delayed respawn** (light pressure, not heart loss — keeps early rounds forgiving)
7. All ingredients caught → **dish complete**, +50 bonus, streak++, brief celebration (~1.2s), then next dish
8. 3 hearts lost → **game over**, show score + best streak + "Watch this recipe" CTA + "Play Again"

### Missed-Ingredient Penalty (light)

Missing a correct ingredient does **not** cost a heart — that would be too
punishing on mobile where reaction time is limited. Instead:
- **Combo reset**: any score multiplier from consecutive correct catches drops to 1×
- **Delayed respawn**: the missed ingredient respawns after a longer delay (2-3s vs normal 1-1.5s), creating a brief gap in progress

This adds tension without making the game feel unfair. Early rounds (streak 0-2) can be even more forgiving — no combo penalty, just delayed respawn.

### Difficulty Ramp (capped)

Three-phase ramp. Speed caps early so labels stay readable on mobile;
late-game pressure comes from **mix and spawn frequency**, not raw speed.

| Level | Streak | Fall Speed | Wrong-Ingredient % | Spawn Interval |
|-------|--------|-----------|-------------------|----------------|
| **Level 1** (forgiving) | 0-2 | 180 px/sec | 15% | 1500ms |
| **Level 2** (building) | 3-6 | 240 px/sec | 30% | 1100ms |
| **Level 3** (intense, capped) | 7+ | 300 px/sec (capped) | 45% (capped) | 800ms (capped) |

- Fall speed caps at 300 px/sec — never so fast that token text is unreadable
- Late-game difficulty comes from more wrong ingredients + faster spawns, not speed
- Wrong-ingredient % caps at 45% — above that, the game becomes luck, not skill

### Level-Up Display

When the player crosses a level boundary (streak 3 → Level 2, streak 7 →
Level 3), show a **"Level Up"** banner for 800ms before the next dish
appears. Gives users a stronger sense of progress.

```
┌─────────────────────┐
│      LEVEL UP!      │  ← gold text, centered, 800ms
│      Level 2        │
└─────────────────────┘
```

### Scoring
- +10 per correct ingredient
- +50 bonus per completed dish
- Combo multiplier: consecutive correct catches build a multiplier (1×, 1.2×, 1.5×, 2×). Wrong catch or missed ingredient resets to 1×
- Streak bonus: +5 per dish in current streak
- Track best streak in `localStorage`

### States
- `idle` — title screen, onboarding copy, "Tap to Start"
- `playing` — active round
- `dish-complete` — brief gold flash celebration, ingredient icons pop, auto-advance (~1.2s)
- `game-over` — final score, best streak, "Watch this recipe" CTA, "Play Again" button

### Spawn Spacing
- Minimum vertical gap between falling tokens (enforced by spawn timer + token height)
- No two tokens in the same lane within 1.5× token height of each other
- Prevents visual overlap and unfair "can't catch both" situations

### Collision Rule

A token is **caught** if and only if **all** of these are true:

1. `token.lane === basket.lane` (same lane)
2. `token.bottom >= catchLineY` (token's bottom edge crosses the basket catch line)
3. `token.processed === false` (not already handled this frame)

Where:
- `catchLineY` = canvas height × 0.82 (catch zone is bottom 18% of canvas)
- `token.bottom` = `token.y + token.height`

Once caught, `token.processed = true` immediately to prevent double-processing.
Tokens that fall past `canvas.height` (below the basket) are marked `missed`
and removed — triggering the missed-ingredient penalty if they were required.

### Spawn Algorithm

On each spawn tick (driven by spawn interval for current level):

```
1. Determine current level from streak (L1: 0-2, L2: 3-6, L3: 7+)
2. Roll correct-vs-wrong:
   - random() < (1 - wrongPct) → correct
   - else → wrong
3. If CORRECT:
   a. Get uncaught required ingredients (not yet checked off, not currently
      falling, not in delayed-respawn cooldown)
   b. If none available (all remaining are falling or cooling down):
      - Either skip this spawn tick, OR
      - Force a wrong ingredient instead (keeps action going)
   c. Pick random ingredient from available correct set
4. If WRONG:
   a. Pool = full ingredient pool minus current dish's required set
   b. Pick random ingredient from wrong pool
5. Pick a lane:
   a. Random lane from [0, 1, 2]
   b. Check spacing: no existing token in that lane within
      (1.5 × tokenHeight) vertical distance of the spawn point
   c. If blocked, try next lane; if all blocked, skip this tick
6. Create token at top of chosen lane with current level's fall speed
```

**Delayed respawn:** when a required ingredient is missed (falls past basket),
it enters a cooldown of 2000-3000ms (vs normal spawn). During cooldown it's
excluded from the "available correct" set in step 3a. After cooldown it
re-enters the pool normally.

**Edge case — all required caught except cooling-down ones:** the spawn
algorithm keeps dropping wrong ingredients (action continues) until the
cooldown expires and the last correct ingredient can spawn. This prevents
a deadlock where the player waits with nothing falling.

---

## Data Source — Dishes & Ingredients

Curated manually from S4 episode descriptions (15 dishes available).
Ingredient names **simplified for quick recognition** — richer names
("Country Chicken", "Basmati Rice", "Roasted Coconut") are reserved for
the episode link / recipe detail, not the game tokens.

### Dish Pool (S4)

Each dish includes its YouTube video ID for the "Watch this recipe" CTA.

| # | Dish | Simplified Ingredients | Video ID |
|---|------|----------------------|----------|
| 1 | White Chicken Pulao | Chicken, Rice, Coconut, Curry Leaves | `9ig2P5uQeLo` |
| 2 | Naati Koli Bassaru | Chicken, Chickpeas, Coconut, Mustard | `xNlR6VPTUOc` |
| 3 | Quick Mutton Fry | Mutton, Garlic, Curry Leaves, Pepper | `nol4d9eqjyo` |
| 4 | Mutton Kheema Vade | Mutton, Mint, Coriander, Dill | `rtLm3RqLnLc` |
| 5 | Kaal Soup | Mutton, Ginger, Garlic, Pepper | `Pc1QVxb2V4s` |
| 6 | Kanakapura Fish Curry | Fish, Chilli, Tamarind, Coconut | `SO9jaLxrPsQ` |
| 7 | Kollegal Mutton Pulao | Mutton, Rice, Coriander, Mint | `s5jHf8M_hSE` |
| 8 | Kadle Manoli | Ivy Gourd, Chickpeas, Coconut | `pESOxDDF7B4` |
| 9 | Batani Kurma | Peas, Potato, Cashews, Coconut | `rsJy07KbZhE` |
| 10 | Raichur Tuntapur Chicken | Chicken, Garlic, Curry Leaves, Spices | `oFWVuSiZZ64` |
| 11 | Bonda Soup | Urad Dal, Moong Dal, Coconut, Curry Leaves | `jz7W4rcZYOs` |
| 12 | Southekayi Muddipalya | Cucumber, Coconut, Mustard, Curry Leaves | `L-j5T-ZQdMg` |
| 13 | Avarekalu Curry | Hyacinth Beans, Coconut, Mustard, Curry Leaves | `z9Zb3HCb29M` |
| 14 | Hurugadle Nippattu | Fried Gram, Rice Flour, Curry Leaves, Spices | `4dMkfUiECkc` |
| 15 | Halasina Mulka | Jackfruit, Rice Flour, Jaggery, Coconut | `u1rGS26Likc` |

### Simplification Notes

| Original (rich) | Game token (simple) | Why |
|----------------|---------------------|-----|
| Country Chicken | Chicken | Same protein, player doesn't need to distinguish |
| Basmati Rice / Jeera Samba Rice | Rice | Rice type is a detail, not gameplay-relevant |
| River Fish | Fish | Same |
| Roasted Coconut | Coconut | Roasted is a state, not a different ingredient |
| Mutton Shanks / Minced Mutton / Mutton Bones | Mutton | All mutton — herbs/spices distinguish the dishes |
| Byadagi Chilli | Chilli | Regional name not needed in token |

### Ingredient Token Format

Each falling ingredient is a **rounded token card** with emoji + short text:

```
┌─────────────┐
│ 🥥 Coconut  │
└─────────────┘
```

- Emoji provides visual variety at a glance
- Text label makes the game **fair** — Karnataka-specific ingredients
  (Ivy Gourd, Hyacinth Beans, Fried Gram, Urad Dal) are recognizable by
  text, not guesswork from emoji alone
- Token card styling: rounded corners, COK surface color (`--surface`),
  gold border on correct-catch flash, red border on wrong-catch

### Emoji Mapping (simplified ingredients)

| Ingredient | Emoji |
|-----------|-------|
| Chicken | 🍗 |
| Mutton | 🍖 |
| Fish | 🐟 |
| Rice | 🍚 |
| Coconut | 🥥 |
| Curry Leaves | 🌿 |
| Mustard | 🟡 |
| Tamarind | 🟤 |
| Garlic | 🧄 |
| Ginger | 🫚 |
| Pepper | 🫙 |
| Chilli | 🌶 |
| Mint | 🌱 |
| Coriander | 🍃 |
| Dill | 🌾 |
| Ivy Gourd | 🥒 |
| Chickpeas | 🫘 |
| Peas | 🫛 |
| Potato | 🥔 |
| Cashews | 🥜 |
| Urad Dal | 🟫 |
| Moong Dal | 🟢 |
| Cucumber | 🥒 |
| Hyacinth Beans | 🫛 |
| Fried Gram | 🟡 |
| Rice Flour | 🌾 |
| Jackfruit | 🍈 |
| Jaggery | 🟫 |
| Spices | 🧂 |

> Some emojis are imperfect matches (🥒 for both Ivy Gourd and Cucumber,
> 🟡 for both Mustard and Fried Gram). The **text label disambiguates** —
> that's the whole point of labelled tokens over emoji-only.

### Wrong Ingredients

Wrong ingredients = full ingredient pool minus the current dish's required set.
Random pick from the remainder. As streak grows, wrong-ingredient spawn
frequency increases (see difficulty ramp).

### No Immediate Repeat

The last completed dish is excluded from the random pick for the next round.
Prevents "oh, this one again" fatigue. After 2+ dishes, the pool opens back up.

---

## CTA — Connection to COK Property

The game is a **discovery layer** for the show, not just a toy.

### After Dish Complete
- Brief celebration shows dish name + "Watch this recipe →" link
- Link opens the YouTube episode in a new tab
- Auto-advances to next dish after ~1.2s (link is also available on game-over screen)

### After Game Over
- Show final score, best streak
- Show the **last attempted dish** with "Watch this recipe →" CTA
- "Play Again" button to restart

### Link Format
```
https://www.youtube.com/watch?v={videoId}&list=PL4tXltXT0TCWhrTT31fLGpTr2VoHHHov5
```

> ponytail: CTA is a plain anchor tag, no modal. Keep it simple.

---

## Analytics (GA4)

No backend or accounts, but track whether people are actually playing.
Events pushed via `dataLayer.push()` (GTM-friendly) with a `gtag()` fallback.
All calls are `try/catch` guarded — if neither is present, events silently no-op.

### Implementation

```js
function trackEvent(eventName, params = {}) {
  try {
    // Prefer dataLayer (GTM-managed GA4)
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        game_name: 'recipe_catcher',
        ...params
      });
      return;
    }
    // Fallback to direct gtag if available
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        game_name: 'recipe_catcher',
        ...params
      });
    }
  } catch (e) { /* analytics never breaks the game */ }
}
```

No script injection, no GA4/GTM dependency loaded by the game itself —
relies on whatever the host property already loads.

### Events

| Event | Trigger | Parameters |
|-------|---------|------------|
| `game_start` | User taps "Start" | — |
| `dish_completed` | All ingredients caught | `dish_name`, `streak`, `level` |
| `wrong_ingredient_caught` | Wrong token caught | `dish_name`, `caught_ingredient` |
| `game_over` | 3 hearts lost | `score`, `best_streak`, `dishes_completed` |
| `best_streak` | New best streak saved to localStorage | `best_streak` |
| `watch_recipe_click` | User clicks "Watch this recipe" | `dish_name`, `video_id` |

---

## Visuals & Assets

- **No image assets needed for v1** — emoji + text tokens, basket emoji (🧺)
  or simple CSS shape
- Match existing COK dark theme from `video_embed.html`:
  - `--bg: #131110`, `--surface: #1E1B18`, `--border: #332F2A`
  - `--accent: #F5C518` (gold), `--accent-secondary: #D4542E` (orange-red)
  - `--text: #F0EDE8`, `--text-muted: #7A756E`
- Fonts: Sora (headers) + DM Sans (body) — already loaded in property
- Ingredient checklist: checkbox style, fills gold (`--accent`) when caught
- Hearts: 3 × ❤, lose one per wrong catch (grey out / break animation)
- Dish-complete: brief gold flash + ingredient icons pop + celebration text
- Game-over: card overlay with score, best streak, CTA, replay button
- Falling tokens: rounded card style, `--surface` bg, `--border` outline,
  flash gold border on correct catch, red border on wrong catch

> ponytail: emoji + text over custom sprites. Swap to real food photos/SVGs
> when the game earns polish.

---

## Technical Approach

- **Single HTML file** — `game.html`, zero dependencies, zero build
- **Canvas 2D** for the play field (falling tokens + basket)
- **DOM overlay** for header (dish name + checklist) and HUD (streak/hearts)
  — easier than canvas text, stays crisp, accessible
- **Touch events**:
  - `touchstart` + `touchend` → detect swipe direction (delta X > threshold = swipe)
  - `touchstart` on left/right half (no swipe detected) → tap move
  - Swipe takes priority over tap if movement exceeds threshold
- **Keyboard**: ArrowLeft / ArrowRight as desktop fallback (one lane per keydown)
- **Game loop**: `requestAnimationFrame`, delta-time based
- **State machine**: idle → playing → dish-complete → game-over
- **No backend, no accounts** for v1
- **Viewport lock**: `position: fixed; overflow: hidden; height: 100dvh`

### Gameplay Constants

Hardcoded values so the game feels predictable across devices. All in px
relative to the canvas, which itself scales to viewport.

```text
Canvas:          100dvh height, width = height × (9/16), max 480px wide
Lanes:           3, each = canvasWidth / 3
Token height:    42px
Token width:     78% of lane width
Basket width:    80% of lane width
Basket height:   48px
Catch line Y:    canvasHeight × 0.82  (catch zone = bottom 18%)
Swipe threshold: 30px  (below this = tap, above = swipe)
Lane hop anim:   120ms ease-out (basket slides, not teleports)

Fall speed:
  Level 1:  180 px/sec
  Level 2:  240 px/sec
  Level 3:  300 px/sec  (capped)

Spawn interval:
  Level 1:  1500ms
  Level 2:  1100ms
  Level 3:  800ms  (capped)

Wrong-ingredient %:
  Level 1:  15%
  Level 2:  30%
  Level 3:  45%  (capped)

Missed-ingredient respawn cooldown: 2000-3000ms
Dish-complete delay:                1200ms
Level-up banner duration:           800ms
Hearts:                             3 (start), -1 per wrong catch
Spacing min gap:                    1.5 × tokenHeight (same lane)
```

### LocalStorage Keys

```text
cok_best_streak   — highest streak ever achieved (int)
cok_best_score    — highest score ever achieved (int)
```

Both read on game-over, written only if beaten. Used to display
"Best: X" on the title and game-over screens.

### Mobile Browser Safeguards

```css
html, body {
  margin: 0;
  overflow: hidden;
  height: 100%;
}

#game {
  position: fixed;
  inset: 0;
  height: 100dvh;
  touch-action: none;        /* prevent scroll/zoom gestures */
  overscroll-behavior: none; /* prevent pull-to-refresh */
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}
```

**Address-bar resize handling:** mobile browsers change viewport height
when the address bar shows/hides. Listen to `resize` and `visualViewport`
events; recompute canvas dimensions and lane positions on change. Use
`100dvh` (dynamic viewport height) over `100vh` to avoid jumpiness.

```js
window.visualViewport?.addEventListener('resize', recomputeLayout);
window.addEventListener('resize', recomputeLayout);
window.addEventListener('orientationchange', recomputeLayout);
```

### File
```
youtube season 4 links/
  game.html          ← the game (single file)
  GAME_PLAN.md       ← this document
```

### Integration
- Link "Game" nav item in `video_embed.html` → `game.html`
- Same header/footer styling as the rest of the property
- Standalone — also works opened directly

---

## Skipped for v1 (YAGNI)

| Skipped | Add when |
|---------|----------|
| Sound effects / music | Game proves fun, user requests |
| Leaderboard / accounts | Multiplayer or competition mode requested |
| Custom food sprites / photos | Polish phase after playtesting |
| S1-S3 dishes (45 more) | 15-dish pool feels stale |
| Timed mode / difficulty selector | Single ramp curve feels flat |
| Share score (social) | Virality becomes a goal |
| Pause button | Rounds are <60s, not needed yet |
| Drag-drop controls | Swipe/tap proves insufficient |
| Modal recipe preview | "Watch recipe" anchor link is enough |

---

## Build Estimate

- ~500-600 lines of HTML/CSS/JS in one file
- Canvas game loop + collision + state machine
- Curated dish data array (~15 entries with video IDs)
- Touch (swipe + tap) + keyboard input
- localStorage for best streak
- GA4 event calls (try/catch guarded)
- "Watch this recipe" CTA with YouTube links

**One @fixer pass, single file, no research needed.**

---

## Acceptance Criteria

A build is done when all of these pass:

- [ ] Game loads as a standalone single HTML file (`game.html`)
- [ ] User can start, play, lose hearts, complete dishes, and replay
- [ ] Basket moves **one lane per** tap / swipe / key press (no teleport)
- [ ] Swipe (delta > 30px) takes priority over tap; tap acts on screen half
- [ ] No page scroll happens during gameplay (`touch-action: none`, `overflow: hidden`)
- [ ] Canvas resizes correctly on address-bar show/hide and orientation change
- [ ] Ingredient token labels remain readable on mobile (text + emoji, not emoji-only)
- [ ] Correct ingredients check off in the header checklist (gold fill)
- [ ] Wrong catch removes one heart (3 hearts → game over)
- [ ] Missed correct ingredient resets combo + delays respawn (no heart loss)
- [ ] Difficulty ramps through 3 levels; speed caps at 300 px/sec; wrong % caps at 45%
- [ ] "Level Up" banner shows for 800ms on level change
- [ ] No immediate dish repeat (last dish excluded from next pick)
- [ ] Falling tokens never visually overlap (spacing rule enforced)
- [ ] Dish-complete celebration shows for 1200ms before auto-advance
- [ ] Best streak + best score persist in localStorage after refresh
- [ ] "Watch this recipe" CTA opens the correct YouTube video in a new tab
- [ ] CTA appears after dish-complete and on game-over screen
- [ ] GA4/dataLayer events fire without breaking if analytics is unavailable
- [ ] Game matches COK dark theme (bg `#131110`, gold `#F5C518`, orange-red `#D4542E`)
- [ ] Arrow Left/Right keys work as desktop fallback
