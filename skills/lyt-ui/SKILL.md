---
name: lyt-ui
description: Build or adapt websites, desktop interfaces and mobile apps using Tony Liu's LYT UI visual language, accessible controls and settings patterns. Includes framework-independent theme tokens and a plain-web reference; use when LYT styling or continuity with this design system is requested.
---

# LYT UI

Use calm neutral surfaces, restrained blue interaction accents, generous spacing,
system typography and clear settings. Preserve the target product's identity.
This package supplies a design system and a web foundation, not native widgets
for every framework.

## Workflow

1. Inspect the target platform, stack, existing theme and explicit product constraints.
   For an existing interface, identify a bounded screen or component set; preserve
   business logic, user content, routes and drafts. Do not replace the whole app
   merely to adopt these rules. Resolve only consequential missing requirements.
2. Read [foundations](references/foundations.md) and load
   [tokens.json](assets/tokens.json). Use `lyt` unless the user requests another
   theme. Keep brand, accent, data and status colors in separate roles.
3. Read [controls](references/controls.md) for any interactive UI and
   [platforms](references/platforms.md) for the target platform. For settings,
   language and About, also read [settings and versions](references/settings.md)
   and [internationalization](references/i18n.md).
4. Map roles to the target technology's central theme/resources. Preserve the
   logical spacing scale; adapt physical sizes and native behaviors. For plain
   web, copy `assets/web/` and `assets/tokens.json` together. Import `base.css`
   and use `theme.mjs` with the token URL explicitly supplied. Other stacks must
   implement and test their own bindings; do not claim these JS helpers work
   as SwiftUI, Compose, Flutter or Qt components.
5. Implement the requested screen and all relevant states. Add real behavior
   to actions; hide capabilities the product does not have. Maintain edits,
   selection, scroll and focus while changing theme or locale. Use native
   controls when they satisfy the interaction contract.
6. Run the observable checks in [verification](references/verification.md).
   Inspect the running result at wide and narrow widths, with keyboard,
   long text, dark mode and RTL when supported. Report what actually ran,
   what is only specified, and which devices or assistive technologies remain
   untested. A source scan or responsive website is not native-platform proof.

## Resources and customization

- `assets/tokens.json`: portable JSON schema v1; roles, units and resolution
  are defined in foundations. `sage` demonstrates a centralized small override.
- `assets/web/base.css`: original optional HTML/CSS foundation, not a complete
  component library. Applications still supply semantics, state and behavior.
- `assets/web/theme.mjs`: theme resolution, CSS binding and WCAG contrast math.
- [Provenance](references/provenance.md): what was observed in the source,
  what was merely proposed there, and what LYT UI deliberately changes.

Keep all of this directory when installing. No private source, author machine,
network service, React, Tailwind or external font is required. Copying only
`SKILL.md` is incomplete. Keep the accompanying LICENSE with redistributed files.
