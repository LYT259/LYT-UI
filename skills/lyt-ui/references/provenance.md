# Provenance and design decisions

Read-only reference: PathBlender source snapshot `f3e1f40c2c0c053be4a2addf4581ee73a6150cd5`; earlier design proposal snapshot `7fed540`, `FRC_软件通用_UI_规范.md`. Paths below are relative to that separate source project. No private collaboration documents, assets, storage keys, update endpoints or business flows are distributed here.

| Evidence | Observed in source | LYT decision |
| --- | --- | --- |
| packages/web/src/theme.tsx and app.css | System/light/dark with live system listener and independent accent persistence; neutral layered surfaces; separate heatmap/status roles | Preserve role separation and system semantics; new contrast-checked blue and sage values |
| components/PreferencesPanel.tsx | General/controls/about, desktop-only updates; theme/accent/language held as drafts and saved together | Appearance/language immediate with explicit explanation; workspace draft remains a Save/Cancel transaction |
| components/LanguagePicker.tsx | Search with native labels and stable order; active descendant, arrows, Enter, Escape, IME guard and selected check | Reimplement in plain JS; modal anchored dialog on wide web and sheet on narrow web; keep input editing keys |
| components/SelectControl.tsx | Custom single-select, portal positioning, skip disabled, keyboard movement and viewport containment | Use native select for simple lists; custom behavior only where search needs it |
| i18n/index.tsx and language-search.ts | 43 registered language choices, endonyms, aliases, stable English sort keys, RTL ar/he, system choice and English fallback | Small explicit demo registry; no claim that 43 languages are necessary or reviewed |
| version.ts, version-info.ts, build-version.ts | Beta.N version arithmetic, generated app metadata, About display with optional commit | General SemVer examples; root manifest generates package version, separate fictional product manifest, no upstream release cadence |
| app.css and component styles | Compact tool layout, system fonts, pale separators and restrained motion | Roomier 16 px body, 24/32 px grouping, larger targets and opaque contrast-tested secondary text |

## Proposed upstream rules are not implementation proof

The older guide asks for immediate language changes, four icon artwork variants, and cross-platform accessibility checks. Current PreferencesPanel stages language until Save, so the guide and current implementation differ. The inspected files do not prove every platform's runtime icon behavior, screen-reader compatibility or translation accuracy. LYT makes icon customization optional and publishes support status honestly. A style guide's contrast targets do not prove its example colors pass: historical white on `#007aff` is about 4.02:1 and white on `#0a84ff` about 3.65:1, below 4.5:1 for normal text. Those combinations are not copied into the new default.

## New LYT decisions

Roomier typography/spacing, the sage preset, framework-independent token schema, optional capability boundaries, immediate reversible settings, draft-form transaction, simplified language registry, mobile selector sheet, independent trial and reproducible contrast checks are new decisions. They should not be described as existing PathBlender behavior.

## Licensing and implementation provenance

The upstream project declares Apache-2.0. It was inspected for behavior and design ideas; its source, translations, icons, logo, media and bundled assets are not copied. The new code, documentation, sample text and simple SVG geometry are independently written for LYT UI and licensed MIT, copyright 2026 Tony Liu. The system font stack references installed fonts without distributing font files. Node/browser built-ins provide runtime functionality; there are no third-party runtime packages or remotely loaded assets. No upstream license is being relabeled. Any future copied asset requires its own provenance and license review.
