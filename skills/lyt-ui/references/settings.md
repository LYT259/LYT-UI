# Settings, About and versioning

## Settings structure

Use one stable entry named Settings (platform Preferences naming is acceptable). On desktop honor the standard application menu/shortcut; on mobile use the product's established navigation and normal Back behavior. Suggested groups: Appearance, Language, Workspace, About. Show optional Updates or Icon Appearance only when the product can actually perform them. Wide: side navigation and readable content column. Narrow: stacked navigation or a section list leading to a detail page; don't squeeze a desktop sidebar.

Appearance and language are reversible, immediate settings in LYT's default pattern. Explicitly say changes apply immediately. A workspace/profile form is a transaction: keep a draft until Save, validate on submit, Cancel restores its last saved value, and warn before navigation that would discard it. In the reference, panel switches keep the same form nodes and draft. Do not render an ambiguous Save button underneath controls that already saved themselves. Persist successful changes only; storage errors must not be called saved.

Search matches translated group titles, field labels and useful aliases. It must find settings in other groups, offer a clear empty result, and navigate to the result while retaining drafts. Hidden groups are not deleted. Clear the query without resetting data. Reset describes its exact scope and asks confirmation for destructive preference changes. Default reset restores system theme/language, default accent and notification preference, not workspace content. Persist a versioned preference object; safely handle corrupt, missing, old or unavailable storage. Synchronize independent windows only if the product needs that capability.

## About

Main location: Settings > About, reachable without hunting through a footer. Show product name, concise product version, and actual distribution channel. Expand Details for build ID/commit, build date if known, runtime/platform where useful, design-system version and licenses. Technical details are for diagnosis, not a giant heading. Copy details may be supplied only with a working fallback and success/error feedback. Keep version strings and hashes in LTR isolation within RTL text.

| Kind | Example (illustrative, not this product's release) |
| --- | --- |
| Stable product | `2.4.0` |
| Pre-release | `2.5.0-beta.2`, concise `2.5.0 · Beta 2` |
| Development | `2.5.0-dev.20261117+abc1234` |
| Separate build ID | `abc1234`, attached to diagnostic details |
| Update channel | stable / beta / development; not derived from theme or language |
| LYT UI / skill version | The package's version, unrelated to the consuming product |

Have one authoritative product manifest. Generate display/installer metadata from it at build time. Don't hand-maintain identical versions in several UI files. Commit hash is generated from the checked-out source; unknown is displayed as unknown, never made up. SemVer build metadata doesn't affect precedence, so update selection needs a proper product release policy. Build timestamps must be generated, not a remembered date. LYT UI's root package.json owns its version; build generates a version JSON alongside the distributable skill. A copied skill reads that generated VERSION.json.

## Platform-gated capabilities

Web updates arrive by deployment/reload; PWA update prompts require a real service-worker lifecycle and must protect unsaved work. Desktop updates require a signed, configured updater/feed with idle/checking/current/found/failure/install states; Check is not Install. Store mobile apps use the platform store/update mechanisms. Never add a fake Check for updates button to a static website. The reference explicitly has no updater. Runtime alternate icons are also optional: OS support, launcher caches and bundle resources determine what can change. If provided, icon style/appearance is independent of interface theme/accent, with honest platform limitations. LYT does not require four icon variants in every product.
