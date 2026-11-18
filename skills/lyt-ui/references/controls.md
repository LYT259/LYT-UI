# Control contracts

Use native controls when they satisfy the behavior. The web foundation is styling, not a prebuilt accessible widget library. Keep visible labels and programmatic names aligned. Do not insert interactive descendants inside a button or listbox option. State must have a non-color cue.

| Control | Required behavior |
| --- | --- |
| Button | Verb label; Enter/Space activates once; distinguish primary/secondary/destructive. Disabled prevents action and has nearby reason. Loading preserves width and name, prevents duplicate submission, announces progress. |
| Icon button | Same target size as other buttons; localized accessible name; focusable/clickable help when meaning is unclear. No hover-only action. |
| Text input | Persistent label, optional hint via describedby; error linked via describedby and invalid state. Preserve invalid input; explain recovery; focus first invalid field after submit. Don't validate IME mid-composition. |
| Select | Native select preferred for short lists; committed value visible; label and disabled options. Native keyboard/typeahead rules apply. A custom select must implement listbox focus, arrows, Home/End, Enter/Space selection, Escape cancellation and Tab dismissal. |
| Searchable selector | Trigger identifies current value. Search by native name, aliases and code. Keep active keyboard option distinct from committed selection. Up/Down moves active item, Enter commits, Escape cancels and returns focus, empty results offer clearing. Ignore composition events. Input Home/End retain text editing; use Ctrl+Home/End to move first/last option in this reference. |
| Switch | Immediate boolean only; checked state and label, Space toggles. Large label hit area. Don't use for a multi-step action or a setting pending Save. |
| Segmented choice | One exclusive value, use radio group semantics; arrows select per platform. Label the group; wrap/stack under long text rather than truncating choices. |
| List | Semantic list of rows; separate actions have their own buttons. Selection has checked/selected semantics and a visible mark. No whole-row action containing nested buttons. |
| Tabs | One selected tab, one tab stop, arrows follow visual orientation (reverse horizontal in RTL), Home/End first/last. Activate immediately only for already-loaded panels. Associate each tab/panel by IDs. |
| Dialog | Named title, true modal background inertness, initial focus suited to task, Escape/Cancel with no mutation, focus returns to opener. Destructive or draft-reset confirmation defaults focus to Cancel. Never trap the user in a nonmodal panel. |
| Hint / tooltip | Essential guidance stays visible. Supplemental info may use a button-driven popover/disclosure available on tap, focus and keyboard; Escape dismisses floating content. No information only in title/hover. |
| Loading | Text and busy state; progress when measurable. Keep Cancel if operation is cancellable. Don't announce every animation frame. |
| Empty | Explain why empty and one real way to add/filter/reset. Distinguish empty data from failed retrieval. |
| Error | Plain cause, preserved inputs and actionable recovery. Blocking errors use alert sparingly; background status uses polite live region. Success is text plus state, never just green. |

## Layout and dismissal

Desktop uses roomy 44 CSS px targets by default; denser products may opt in after testing keyboard/precision pointers. Touch uses at least 48 CSS px targets in the web reference, 44 pt iOS, 48 dp Android. Targets need separation, especially destructive actions. Text controls must grow with text; avoid fixed-height label clipping.

For a wide screen the language reference uses an anchored dialog with search and a scrollable list. Narrow screens use the same state in a full-width selection sheet with a visible Close control. Modal sheet traps focus; a nonmodal popover instead dismisses on Tab leaving and must not trap focus. This difference is intentional. Keep input and the active option visible above the soft keyboard; limit height to dynamic viewport, listen to VisualViewport if the host needs it. Scroll only the option container when moving active options. Reposition on scroll/resize or use native popover anchoring. Don't open another page just to copy desktop geometry.

## Reference scope

The demo implements native input/select/radio/switch, buttons, a custom searchable language dialog, tabs, lists, confirmation, help disclosure, busy/empty/error states. Inline SVG help and arrow shapes are original. This is a plain HTML/CSS/JS implementation. Use these contracts when translating to a component framework, not DOM code inside native toolkits.
