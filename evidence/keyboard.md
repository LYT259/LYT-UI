# Mounted-browser keyboard observation

Date: 2026-11-17. Stillroom reference at 1280 × 720 CSS viewport, Chromium browser provided by the workspace.

Using browser click/fill/key actions (not synthetic KeyboardEvent): opened Workspace, entered `Keep this draft · 保留草稿`, changed to dark mode and sage, opened Language, searched 中文, pressed ArrowDown and Enter. Readback showed `lang=zh-Hans`, `data-theme=dark`, `data-preset=sage`, the exact draft intact, dialog closed, and active focus on `language-open`.

This verifies that particular keyboard commit path, focus return and draft retention. It is not a screen-reader audit or native-platform test. Later matrix checks use DOM-dispatched actions and identify themselves accordingly.
