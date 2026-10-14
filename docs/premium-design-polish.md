# Premium design polish — 2026-10-14

## Audit before edits
React/Vite single-page portfolio, hash navigation, GSAP timelines/ScrollTrigger, Lenis, deferred Three.js scenery. LanguageContext/locales own Arabic/English. Static alpha WebP poses remain driven by the existing guide controller.

High: portal was 3.6s plus .68s exit; cursor remained enabled during it. Medium: media lacked load states; cached image handling needed care; hardcoded surface/radius/timing/font values across 21 CSS imports; Arabic inherited Latin tracking on some labels. Low: header branding markup was separate but visible navigation was not duplicated; avatar already had real alpha, matching 600x850 anchors, crossfade and footer protection. Existing responsive boundaries 767/900/1099/1199/1350/1600/1700 serve different compositions; retained and tested rather than flattened.

## Approved direction and changes
User selected cooler near-black/navy, DM Sans and Noto Sans Arabic throughout headings and copy. The F identity mark remains its original artwork-like serif treatment.

- premium-system.css: semantic palette, 4/8px spacing scale, common radii/shadows/durations/layers, fluid headings, Arabic tracking/line height, shared surfaces and static-world fallback.
- index.html: same scene geometry, cooler scene/fog/grid/moon/foliage colors.
- CinematicTransition.jsx: one orb timeline 1.45s, overlapping travel/expansion/reveal; existing exit now .35s. Total normal journey 1.8s; reduced motion has no camera movement.
- WelcomeExperience/App: explicit busy state suspends cursor during transition and exit; effect cleanup restores it; next pointer event seeds current coordinates.
- HeaderShell: reusable semantic header shell for mutually exclusive gateway/portfolio headers. Project details retain native modal semantics above the existing main header, without duplicating nav.
- ProjectMedia: shared 16:10 secondary-card stage, larger featured stage, existing phone/browser/document framing and contain proportions; cached-image-safe loading state; inline tiny blurred WebP previews derived from all 13 real screenshots in projectPlaceholders.js. Original optimized screenshots and intrinsic sizes preserved.
- LanguageContext: apply document lang/dir before paint, preventing a frame of mismatched direction after text changes.
- Guide: alpha cutouts, shared anchor and crossfade preserved, quiet cyan rim and ground shadow, navy dialogue surface. No extra controller or invented pose.

## Executed checks
- npm run build: PASS. Main 499.95kB (167.65 gzip), CSS143.76kB (28.52 gzip); existing deferred Three736.44kB warning remains.
- npm test: 7/7 PASS; git diff --check PASS. No lint script exists.
- Browser EN and AR: widths360/768/1024/1440/1920, no page horizontal overflow, correct lang/dir/fonts, one global nav, five projects. Gateway checked at all five widths with both labeled orbs.
- EN and AR keyboard orb entry, cursor absent during transition, scroll lock released afterward.
- Resize during entry: overlay removed and lock released; next pointer move restores exactly one42px cursor.
- All five AR project dialogs at360px: keyboard opens, close focus, Escape closes, no internal horizontal overflow; all supplied hero screenshots loaded visibly. MyCohort intentionally has no screenshot.
- Reduced motion: no WebGL canvas, hidden decorative cursor, readable main content, no scroll lock or overflow.
- Desktop grid measured one featured row followed by two paired rows. Screenshots captured and inspected for English desktop, Arabic mobile, project presentation.
- No captured browser console errors.

## Limits / future work
No physical-device FPS, Lighthouse or full WCAG audit was run. Existing deferred Three chunk remains large; inline placeholders add roughly1.4kB gzip to main JS. The legacy CSS override stack and DOM-driven avatar architecture remain for a dedicated refactor rather than a rewrite here. Bilingual text has natural different lengths; no promise of identical section heights between languages. Header navigation stays behind an open native modal intentionally, with close/Escape navigation in the modal. Approved MyCohort screenshots would improve its preview; do not fabricate them. Existing source screenshot resolution sets the available detail. No new avatar assets needed.
