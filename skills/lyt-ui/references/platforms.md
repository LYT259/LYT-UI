# Platform mappings and support boundaries

| Platform | Theme/type mapping | Input/navigation | Verification required |
| --- | --- | --- | --- |
| Web | CSS custom properties, rem, color-scheme and prefers-color-scheme | Semantic HTML, focus-visible, native keyboard, dynamic viewport, logical CSS | Browser keyboard/zoom/reflow/RTL, accessibility tree and screen reader |
| Desktop | Host resources/theme dictionary; system fonts and window chrome | Native app menu and shortcuts; standard close/minimize; multiwindow prefs without losing local drafts | Windows/macOS/Linux shell and installer separately; browser tests are not desktop tests |
| iOS | Semantic colors and text styles; system font/Dynamic Type, pt | Standard navigation/back gesture, sheets, 44 pt targets, safeAreaInset and keyboard avoidance | SwiftUI/UIKit implementation on device/simulator, VoiceOver and larger text |
| Android | Theme resources/Compose Material mapping, sp text, dp geometry | System Back/predictive Back, 48 dp targets, insets/IME handling, TalkBack semantics | Compose/View implementation on device/emulator, TalkBack and font scale |

Core principles and interaction contracts cover all four. Only plain web assets and a running web reference are supplied. Native mappings above are guidance, not shipped components or successful native tests. Do not import React/Tailwind as a core dependency just because an example uses them in another project.

Map token roles to semantic resource names centrally. Preserve the feeling (neutral hierarchy, restraint, generous space) with native density and typography. Mobile may collapse navigation into a list/detail flow; do not mimic a desktop titlebar or replace familiar Back behavior. Pointer hover is never the sole route to actions. Keep standard keyboard text editing and IME behavior; reserve shortcuts only when they don't override platform conventions.

Use safe-area insets and dynamic viewport height on mobile web; account for the keyboard covering focused fields/sheet results. Text reflow at 200% and 400% browser zoom is separate from making the viewport narrow. Touch emulation is not physical touch. OS high-contrast/forced-colors and reduced-motion override decorative styling. Loading text must survive removal of its spinner. Visible focus must not be clipped by overflow or sticky headers. Focus order follows reading order; avoid positive tabindex.

Use native roles and names, live regions only for asynchronous feedback, and a real focus trap only for modal dialogs. The reference does not certify screen-reader interoperability: actual VoiceOver/TalkBack/NVDA testing remains necessary. If an adapter is unavailable, implement a bounded screen against these contracts, then report the specific toolkit/device/browser tested. Never mark the whole platform validated after only compiling it.
