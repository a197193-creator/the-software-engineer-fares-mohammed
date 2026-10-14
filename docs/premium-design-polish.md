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

## Follow-up — chosen language colors and Cinematic default

English now uses cyan #40DFFF and Arabic gold #F5C66A consistently for name/role highlights, buttons, navigation, guide borders/actions, focus indicators, academic highlights, project lighting and static scenery. Neutral body text stays readable on the same dark navy base. Both gateway orbs retain their separate language colors. Existing WebGL rim, architecture trim, moon and blossom materials blend toward the selected hue with no scene remount or new animation loop; the moon texture is neutral so tint remains accurate.

Cinematic is the default desktop intensity: 5px float (previous3), 1.035 hover scale, 1.02 card scale, 32px generic reveal, deeper8.5-unit world camera progression, slow12-second camera drift and restrained lighting variation. No additional particles were added. Smaller/touch screens still resolve Cinematic to Balanced; reduced motion resolves to Subtle/static. A one-time versioned migration updates the old automatically persisted Balanced default; previous Subtle survives. After migration, all visitor intensity choices persist unchanged.

Executed: build PASS,7/7 tests PASS, diff check PASS. Browser checked actual cyan/gold name, role, eyebrow and CTA computed colors; inspected EN/AR screenshots and live hue changes with a single canvas. Default desktop Cinematic confirmed. Explicit Balanced→refresh remains Balanced, selecting Cinematic restores it.360px mobile resolves Balanced, no overflow. Reduced motion has0canvas and gold-tinted static fallback in Arabic. No captured console errors. Changes:premium-system.css,index.html,motionConfig.js,MotionSettings.jsx.

## Follow-up — living letter edges and atmospheric depth

- `LetterWaterfalls.jsx` and `cinema-depth.css`: one decorative overlay, two gutter-anchored waterfalls, deterministic English/Arabic letters, selected-language cyan/gold. Duplicated tracks loop seamlessly using CSS transforms; no new JavaScript frame loop. Desktop has five tracks per side, smaller desktops three, tablet/mobile one. The existing visibility/motion settings pause or disable motion; dialogs, menus and the portal suspend the streams. The overlay is aria-hidden and never intercepts input.
- `index.html`: one shared 128px procedural light texture supplies a soft moon halo, low mist layers and ground illumination. The existing Three.js renderer owns all updates and resource disposal. The scene follows the selected language palette. Balanced uses one mist layer; Cinematic uses three. Static fallback and existing DPR/frame caps are preserved.
- `CinematicTransition.jsx`: two restrained optical rings join the existing orb timeline, sharing its origin, travel and cleanup. No extra transition controller or scroll lock.
- `SectionIntro.jsx` and `StoryTypography.jsx`: a stronger but bounded Cinematic entrance on existing transform layers; Arabic remains animated by whole words.
- `cinema-depth.css`: softer role highlights, balanced heading wrapping, clearer surfaces, restrained edge lighting and shared button depth. DM Sans/Noto Sans Arabic, real content and dark-only mode remain unchanged.
- `App.jsx`/`main.jsx`: mount the waterfall once and load the finishing styles.

Browser checks executed locally: EN/AR glyphs and cyan/gold changes; visible stream transform progression over a timed sample; no horizontal overflow at 360,390,768,1024,1440 and1920px; desktop and mobile screenshots inspected. Reduced-motion emulation disables CSS letter animation and removes the WebGL canvas, with readable headings. Subtle disables moving letters; restoring Cinematic works. English keyboard orb selection completes, with the overlay removed. DIACARE details open by keyboard and mouse; streams pause behind the dialog and resume after Escape. No captured console errors. No new dependencies or assets required.

This is an atmospheric refinement, not a photorealistic environment or a rigged avatar. Physical-device FPS, Lighthouse and battery usage were not measured. The existing large deferred Three.js bundle warning remains; no 60fps or Lighthouse-score claim is made. Mobile intentionally has fewer letters and less atmosphere to protect reading space and rendering cost.

Final local validation: production build PASS; 7/7 tests PASS; git diff --check PASS. Main JavaScript503.37kB/168.67kB gzip, CSS151.52kB/29.76kB gzip, deferred Three736.44kB/186.85kB gzip. No lint script is configured.
