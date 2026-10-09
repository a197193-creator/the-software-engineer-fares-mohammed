# Task 6 — Floating project showcase

Implemented locally on `codex/cinematic-integration`, from Task 5 checkpoint
`e2b40fb`, together with the subsequently requested Task 7 integration.

## Result

The Projects section now presents DiaCare as the featured panel, with MyCohort,
TMC Research & Publications, and UWC Appointment System in secondary panels.
Layered technical frames, faint cyan grids, restrained entry/floating motion,
pointer lighting, and keyboard focus provide depth without a rendering engine.
Tablet uses two columns; mobile uses one column with floating and tilt disabled.

All existing project data, filters, case-study dialogs, and the profile GitHub
destination remain. Contribution disclosures use the existing solution text.
The existing single AvatarGuide introduces Projects; no second avatar controller
or new dialogue system was added. Welcome, Hero copy, and navigation structure
were preserved.

No application screenshots or project-specific repository/demo URLs exist in the
data. The panels therefore say **Project overview / Conceptual project map** and
show actual existing features, rather than fabricated application interfaces.
Project-specific external actions appear only when real URLs are supplied.

## Files

- `src/components/Projects.jsx`: featured arrangement, contribution disclosures,
  explicit detail buttons, conditional external links, preserved native dialogs.
- `src/components/ProjectPreview.jsx`: reusable overview from project data;
  reserved-size, lazy, asynchronously decoded image path for future screenshots.
- `src/hooks/useProjectEntrance.js`: outer-panel GSAP entry and visibility-gated
  inner CSS floating, with cleanup.
- `src/project-showcase.css`: workspace, panels, depth, focus, RTL-compatible
  logical borders/alignment, mobile/static fallbacks.
- `src/locales.js`, `src/main.jsx`: bilingual labels and stylesheet integration.

Entry, floating, and pointer tilt each own a separate element. Hover scaling
uses CSS scale/translate; it does not overwrite the card tilt transform.

## Executed verification

- Production build passed; final bundle sizes are recorded in `TASK-7.md`.
- Desktop English: opened all four project dialogs; Escape closed each. Tested
  All work, Mobile, Web, and AI filters with the expected project sets.
- Keyboard: contribution disclosure toggled with Enter; focus outline visible.
  Dialog close restored focus to its opening button.
- Desktop Arabic: Projects dialogue and DiaCare detail view displayed in RTL.
- Mobile 375x812, touch/coarse pointer: one column, no tilt/floating/decorative
  cursor, no horizontal overflow; DiaCare dialogs worked in both languages.
- Reduced motion: static panels, readable headings, full dialogue without typing.
- Pointer: observed separate outer entry, inner float, and card tilt transforms;
  native cursor preserved and decorative overlays had pointer-events:none.
- Compiled preview console showed no new errors/warnings in the recorded window;
  no broken loaded images were observed.

Proof images and raw browser observations are in ignored `.qa/`:
`task6-showcase-desktop.png`, `task6-showcase-mobile.png`, `task7-results.json`.
The future screenshot-loading/error branch and project-specific external links
could not be exercised with real assets because those fields are null.

No push or production deployment was performed. Stop here for review.
