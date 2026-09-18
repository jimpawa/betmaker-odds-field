# BetMaker — Odds field (Maze build)

**Live:** https://jimpawa.github.io/betmaker-odds-field/

`index.html` — the **Odds field** prototype only (option 2 from the original
"BetMaker Direct (standalone).html" review page), rebuilt as a normal
responsive web page: no device frame, fills the viewport at any size.

Single self-contained file (~1.1 MB): fonts, icon sprite, React and all app
code are inlined, so it works from any static host or straight off disk.

## What changed vs. the source bundle
- Only `OptSlider` ("2 · Odds field") is mounted — the review-page shell
  (title, standfirst, chips, the second prototype) is gone.
- JSX is precompiled, so Babel-standalone (3.1 MB) is dropped; React/ReactDOM
  are the 18.3.1 **production** UMD builds.
- Fonts: Roboto 400 + 700 only (nothing in this screen computes to 500/900),
  the variable + italic faces are dropped.
- Casino artwork is dropped — unused by this screen.
- `src/override.css` turns `.phone` into the page: 100% × 100% of the
  viewport, no radius/shadow, chrome full-bleed, content column capped at
  680 px with `max()` gutters, safe-area padding on the bottom nav, and the
  betslip sheet tracking the same column.

## Rebuilding
```
cd src && node compile.js && cd .. && python3 src/build.py   # writes src/build/odds-field.html
```
`src/assets/` holds everything extracted from the original bundle.

## Verification
`src/check.mjs` renders at 390×844, 768×1024, 1440×900, 360×640 and 740×400;
`src/flow.mjs` types odds → Generate Betslip → betslip sheet.
Both pass with no console or page errors and no horizontal overflow.
