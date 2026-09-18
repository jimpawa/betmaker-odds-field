# betmaker-odds-field

Extracted the **Odds field** prototype (option 2) out of
`~/Downloads/BetMaker Direct (standalone).html` — a Claude Design
self-extracting bundle that rendered ten BetMaker options side by side in
393×844 device frames on a review page.

Deliverable: `index.html` — that one screen as a plain responsive web page for
Maze. See `../README.md` for the build pipeline and what was stripped.

## Key facts about the source bundle format
Claude Design "(standalone)" exports are one HTML file with four
`<script type="__bundler/...">` payloads on single lines:
`manifest` (uuid → {mime, compressed, base64 data}), `ext_resources`
(id → uuid), `page_order`, and `template` (the whole page as a JSON string).
Compressed entries are gzip. `src/` in this project holds the extraction +
rebuild scripts, reusable for any other Claude Design standalone export.

## Not done yet
Not published anywhere — Maze needs a URL, so a GitHub Pages repo under
`jimpawa` is the obvious next step if Jim wants it hosted.
