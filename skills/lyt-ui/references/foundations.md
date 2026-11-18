# Foundations and theme contract

LYT defaults: quiet gray surfaces, clear blue actions, system type, generous space and rounded panels. One dominant action per task. Keep product branding distinct. These defaults deliberately enlarge PathBlender's compact tool layout.

## Portable token schema v1

`../assets/tokens.json` is the source of truth. Resolve by shallow merging `common`, `themes[light|dark]`, `presets[name].common`, then `presets[name][light|dark]`. No recursive aliases or framework syntax. Values are strings: opaque colors are sRGB hex, overlay may use hex alpha; lengths carry units; line heights, weights and layer indices are unitless. Shadow is a web serialization of offset/blur/color; native adapters translate it into platform elevation/shadow primitives. Rem means a multiplier of the user's base text size (16 CSS px at the web default), not a native physical pixel. Never convert rem to fixed native font sizes without supporting text scaling.

| Roles | Meaning and defaults |
| --- | --- |
| canvas, surface, raised | App background, content panel, inset/raised region |
| text, muted | Primary and secondary text; muted still passes normal-text contrast |
| divider, control-border | Decorative separators vs boundaries essential to recognizing controls |
| accent, on-accent | Action fill and its contrasting label |
| accent-hover, accent-pressed | Pointer hover and activation fill |
| accent-text, selected, focus | Links/selected labels, selected surface, focus ring |
| disabled-bg, disabled-text | Disabled presentation; also set native disabled semantics |
| brand | Identity only, not a status or interaction color |
| success/warning/error and *-bg | State text and background; always include words or symbols |
| data-a/b/c | Stable categories, paired with labels/line patterns; never assign via accent |
| overlay, shadow | Modal backdrop and restrained floating surface shadow |
| font-body, font-mono | System UI and tabular identifiers; no downloaded fonts |
| text-small/body/section/title | 0.875/1/1.25/2 rem; body 400, labels 500, headings 600 |
| line-body/heading | 1.6 / 1.25; controls grow with wrapping and text scaling |
| space-1/2/3/4/6/8/12 | 4/8/12/16/24/32/48 px equivalents at 16 px base |
| radius-control/panel/pill | 10 px / 16 px / fully rounded; never mask focus |
| border-width, focus-width/offset | 1 px edge; 2 px ring with 3 px gap |
| target-desktop/touch | 44 / 48 CSS px equivalents; platform units in platforms.md |
| layer-* | Base 0, sticky 10, popover 20, dialog 30, status 40; native modal/top-layer semantics win |
| motion-fast/normal/ease | 120 / 180 ms, decelerating curve; reduce-motion removes transitions |
| content-max | 72 rem; readable text lines roughly 60–75 characters |

Default surfaces are light `#f5f5f7`/white and dark `#1c1c1e`/`#242529`. New interaction colors are chosen for readable text; do not substitute the historical blue just because it looks familiar. Use `lyt` by default. `sage` changes only accent roles and two radii centrally; brand, data and semantic colors remain unchanged. Add presets in the same JSON, not per-page overrides. Re-run contrast validation for every modified role and state.

## Appearance and state

Persist the user's **mode** (`system`, `light`, `dark`), separately from the resolved theme. System is the default; subscribe to live OS changes only for resolution, never overwrite a fixed choice. Set platform color-scheme semantics too. Keep preset, language and optional icon preferences independent. Apply theme to the existing tree: retain drafts, scroll, selected tab, focus and open operations. Missing/invalid storage falls back to defaults; denied storage means session-only behavior with a clear notice. Namespace storage to the consuming product and version its schema; never use the reference product's keys. Cross-window synchronization must merge preferences without overwriting unsaved forms.

A neutral surface is not automatically a control: essential boundaries need `control-border`, not the faint decorative `divider`. Use text labels as well as selected fills, checkmarks and native checked state. Hover is supplemental; press and focus must work with keyboard and touch. Disabled controls explain why through nearby text, not a tooltip unreachable by keyboard. Destructive actions use error roles and explicit action wording, independent of the current accent.

## Contrast and symbols

Normal text >=4.5:1, large text >=3:1; essential control boundaries and focus indicators >=3:1 against adjacent surfaces. Test text on hover, pressed, selected and semantic backgrounds, not only the canvas. Focus on a filled primary uses an offset ring against its surrounding surface. Disabled text remains readable even though WCAG exempts it. A decorative divider need not pass 3:1; do not use it as the sole control boundary. Numerical checks use WCAG sRGB relative luminance, and do not certify entire WCAG compliance.

Icons use one coherent 24-unit stroke grid, currentColor, roughly 18–20 CSS px in controls; decorative shapes are hidden from accessibility. Supply localized names for icon-only buttons and an accessible help pattern. Product icons are optional assets belonging to the product, not LYT UI's generic mark. No PathBlender artwork is shipped. Motion should explain state changes, never block an action; loading must remain understandable with animation disabled.
