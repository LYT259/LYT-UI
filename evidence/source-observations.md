# Read-only source and runtime observations

Date: 2026-11-17. Source inspected at PathBlender commit `f3e1f40c2c0c053be4a2addf4581ee73a6150cd5`; reference guide at `7fed540`. The source worktree was clean when inspected. No source/reference worktree modifications were made.

The public website attempt failed with a proxy connection error. An existing local web distribution was served read-only and opened in the mounted browser. Its build provenance was not established as identical to the source HEAD, so runtime observations are explicitly of that existing distribution.

Observed: Preferences had General, Controls and About; no Updates in the web UI. General displayed Follow system/Light/Dark, five accent choices, a language trigger, Cancel and disabled Save. Opening the language selector displayed endonyms, English names and current-selection cues. Searching 中文 narrowed the list to Chinese choices. ArrowDown then Enter selected 简体中文; the document stayed English, a changes-apply-on-save notice appeared, and Save became enabled. The interface therefore stages the selection before Save. No Save was clicked; no upstream user data was changed.

Source-specific evidence and the older guide's conflicting immediate-language proposal are recorded in the skill's references/provenance.md. Full upstream source and private notes are intentionally absent from this public package.
