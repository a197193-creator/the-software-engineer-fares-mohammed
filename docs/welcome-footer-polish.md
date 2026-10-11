# Welcome and footer polish — 11 October 2026

This pass follows the user's screenshot feedback and supersedes the earlier portal/section-drawing design in `premium-refinement.md`.

## Changes

- Preserved the existing primary app bar's visual styling. Its desktop/mobile links now follow the actual document order: Home, About, Skills, Projects, Experience, Contact.
- Removed the entire duplicate chapter-card rail from the render tree and its component export. All six actual portfolio sections and all five projects remain.
- Replaced the orb zoom with the earlier centered bilingual welcome-message presentation. No avatar or new scenery is rendered inside the transition. The language selection, message and main portfolio share the same live Three.js canvas/static fallback, including the current destination's camera progress. Existing guardian/orbs stay on language selection.
- Added a footer boundary for the visible guardian, applied both before and after interpolation/drift. The image stops at least 32px above the footer in its unrotated box; mild rotation retains a safe margin. The speech bubble hides when insufficient space remains above the avatar. The minimized launcher also moves above the footer. Desktop/mobile and language coordinate changes snap safely to the correct rail instead of sliding across body text.
- Increased the constant cursor ring from 22px to 42px, added a restrained rotating outer arc, enlarged the ambient glow and made the short particle trail more visible. Hover changes glow, not diameter. Native cursor, one controller, fine-pointer gating, reduced motion and listener/frame cleanup remain. Hidden cursor arcs pause.
- Removed the weak section SVG drawings and redundant landscape component. Desktop sections have no placeholder picture/gap; compact layouts keep an invisible dedicated guide slot so the speech bubble cannot cover headings.
- Prepared five independent, detailed image-maker prompts with exact dimensions, true alpha requirements, website colors, section-specific subjects, camera/composition, mobile-safe zones and explicit exclusions. An optional seamless alpha-loop prompt and still fallbacks are included in `section-artwork-prompts.md`.

## Files

`index.html`, `src/App.jsx`, `src/components/CinematicTransition.jsx`, `WelcomeExperience.jsx`, `CinematicCursor.jsx`, `PortfolioHero.jsx`, `SectionAvatar.jsx`, `SectionIntro.jsx`, `src/refinement.css`, `src/guideBoundary.js`, and `tests/refinement.test.mjs`.

Unused `src/portalGeometry.js` and `src/components/LandscapeScene.jsx` were removed. No new libraries or avatar artwork were introduced. Real project screenshots, verified profile copy and project detail views remain intact.

## Executed validation

- `npm test`: 2/2 passed — footer-boundary invariants under different viewport/avatar heights and rapid-scroll positions; all real projects/media retained.
- `npm run build`: passed. Initial JS 488.25 kB (163.14 kB gzip); CSS 128.44 kB (25.61 kB gzip). The existing deferred Three.js 736.44 kB warning remains.
- `git diff --check`: passed after fixing the SectionAvatar trailing blank line. No lint script is configured.
- English and Arabic at 1920, 1440, 1024, 768 and 390px: no page overflow; five projects preserved; no chapter cards or section drawings; navigation order matches section order.
- Actual English/Arabic message entrances: no transition avatar, one shared world canvas, correct localization. Both full-motion and reduced-motion flows executed. Touch-media emulation disables cursor decoration.
- Rapid orb double click locks all selection controls and mounts exactly one message transition. Resizing during the message retains the responsive presentation.
- Footer boundary checked at the bottom in both languages: avatar bottom approximately 32px above footer start; no overlap with footer/guide controls.
- Pointer interaction verified: 42px cyan English and gold Arabic ring, visible rotating arc, one cursor controller.
- No error-level console messages captured in these tested flows.
- Post-transition cleanup leaves no message overlay or body/root lock. DIACARE details still open with the real phone screenshot and modal focus; Escape closes it. Back returns to Home at scroll position zero. The mobile menu follows the new section order and Contact navigation closes it without overflow or a remaining lock.

## Remaining asset work

The replacement section illustrations are intentionally pending the user's image-maker outputs. Use the five prompts in `section-artwork-prompts.md`; prefer transparent still PNGs first. No fake project screenshots or second avatar will be used. Physical-device touch/frame-rate tests and a reliable real hidden-tab test remain outside the in-app browser's capabilities.
