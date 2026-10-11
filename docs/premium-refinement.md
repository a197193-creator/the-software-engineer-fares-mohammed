# Premium journey refinement

This is the historical first refinement report. The later user-requested message-only entrance, removed chapter cards/section drawings, larger cursor and footer-safe avatar are described in `welcome-footer-polish.md`; that report supersedes those earlier visual choices.

## Investigation and approach

The application is a React/Vite single page with hash section navigation, LanguageContext, GSAP/ScrollTrigger and Lenis. The procedural Three.js environment is lazy loaded from the index entry. AvatarGuideContext supplies dialogue to the existing single journey guardian. All verified project and profile data stay intact.

Root causes found before editing:

- The header uses viewport padding while page-width and inline desktop avatar rail rules use unrelated widths and offsets.
- The last project spans both grid columns; another rule offsets the third panel. DIACARE is the existing explicitly featured project.
- Welcome and main cursor controllers have different diameters, hover scaling, colors, and interpolation. They hand off abruptly.
- The old welcome transition starts unrelated full-screen geometry instead of measuring the chosen language orb.
- The global header remains mounted underneath the separate welcome header. A hidden React avatar movement controller also runs alongside the visible index guardian.
- Every section repeats LandscapeScene's trees and mountains.
- All screenshot previews claim 960×640 intrinsic dimensions and a 3:2 box, including real portrait mobile screens.

Reuse the current guardian cutout, SVG LanguageOrb, GSAP, localization, native project dialog, pointer surfaces, dialogue provider and image registry. Use one centered container system with a consistent desktop guide column; full-bleed environment layers remain independent. Only the welcome header or main app bar is mounted at a time. One persistent cursor runs across the visitor journey. A measured portal timeline owns its own transforms; pose attention is applied to image layers, separately from guardian positioning.

New reusable pieces: portal geometry utility, meaningful SectionIntro SVGs, screenshot metadata, ProjectMedia/ProjectGallery and a shared scroll-controller registry. No new dependencies or fabricated screenshots. The MyCohort project has no supplied application screenshot and keeps its labeled conceptual project map. Static guardian images support pose changes and mirroring, not real facial rigging or lip sync.

Additional causes found during rendered testing: the global blocked-motion selector paused the mobile menu's own entrance, and native hash scrolling competed with Lenis during browser history navigation. Blocking now pauses main content while allowing menu/dialog feedback. The active scroll controller owns programmatic section navigation, including Back/Forward, with native scrolling as its fallback.

## Completed changes

1. Welcome captures the selected orb's actual SVG bounds, glyph transforms and orbit position. A scoped GSAP timeline pulses, centers and expands that shared element before revealing the existing bilingual welcome copy and guardian. Repeated selection is locked. Skip, Escape, Back and resizing use the same guarded cleanup. Reduced motion receives a brief static welcome.
2. One persistent cursor replaces the welcome/main handoff controllers. Its 22px ring uses frame-rate-independent interpolation, centralized language accents, a six-particle maximum and a stationary sleep state. Hover changes glow rather than diameter. Native pointer and nonblocking overlays remain. Touch media, reduced motion, editable controls and dialogs disable decoration.
3. Navigation, outer section containers, chapter rail, welcome cards and footer share centered width/gutter tokens. A logical end column reserves space for the desktop guardian. Tablet/mobile use dedicated guide slots. Full-bleed scenery stays independent of content geometry.
4. DIACARE remains the explicitly featured project. The grid uses one featured row followed by paired rows, equal-height cards and a mobile single column. No last-card span or third-card offset remains.
5. The single visible guardian reuses existing poses, determines facing from actual adjacent content bounds and crossfades pre-oriented image layers. English/Arabic composition follows real content placement. Positioning and attention do not write to the same transform.
6. Only the welcome header or primary app bar is mounted. Language switching, mobile navigation, focus handling, section offsets and history navigation are retained.
7. About, Skills, Projects, Experience and Contact use distinct lightweight identity, code, interface, milestone and communication SVG introductions. Generic LandscapeScene decorations were removed from those sections; the established ambient world remains.
8. Real portrait, browser and document screenshots use measured intrinsic dimensions and contain-based presentation. Each details dialog has a prominent selectable screenshot, all existing thumbnails and original-size links. Native modal focus, Escape, close controls and scroll locking remain.
9. Removed unused cursor and hidden avatar movement controllers, old cursor CSS and conflicting transition opacity rules. New motion uses shared duration/easing tokens; hidden/offscreen/reduced-motion behavior and cleanup are preserved.

## Main files

- `src/App.jsx`: app bar lifecycle, section/history navigation, focus, cursor/theme integration.
- `src/components/WelcomeExperience.jsx`, `CinematicTransition.jsx`, `src/portalGeometry.js`: measured portal and welcome lifecycle.
- `src/components/CinematicCursor.jsx`: sole pointer controller.
- `src/refinement.css`: shared layout, cursor, portal, section identities, media and motion fallbacks; imported last in `src/main.jsx`.
- `index.html`: existing guardian attention, pose crossfades and guide positioning.
- `src/components/SectionIntro.jsx`: section-specific decorative SVGs.
- `src/components/Projects.jsx`, `ProjectPreview.jsx`, `ProjectMedia.jsx`, `src/projectMedia.js`, `src/project-showcase.css`: grid, media and galleries.
- `src/scrollController.js`, `src/hooks/useMotion.js`, `src/motion.css`: exclusive section scroll ownership and overlay animation coordination.
- `src/components/PortfolioHero.jsx`, `Effects.jsx`, existing pointer/intro/detail/responsive CSS: obsolete controller/style cleanup.
- Removed unused `AvatarController.jsx`, `SandCursor.jsx`, `useAvatarMotion.js`; original avatar artwork remains available.
- `tests/refinement.test.mjs`, `package.json`: executable geometry/media integrity checks.

## Verification

Executed against the production Vite build in the in-app browser:

| Scenario | Result |
| --- | --- |
| English and Arabic at 1920, 1440, 1024, 768 and 390px | Outer navigation/project containers aligned; correct direction; no page overflow; all five projects present. |
| Desktop five-project arrangement | Exactly 1–2–2; both paired rows have equal card heights. Mobile stacks vertically. |
| Orb selection and welcome | Both languages exercised with real UI activation; source-origin portal, correct language, one app bar, clean handoff. |
| Rapid orb double click | One transition; all language selection controls locked. |
| Skip, refresh, replay, direct `#projects` load | Welcome replay and refresh available; current valid anchor retained; locks released. |
| Resize and Back during portal | Guarded cancellation completes the normal fade; no residual overlay/scroll lock. |
| Main Back/Forward | Correct Home/Projects position and heading focus after fixing Lenis/native competition. |
| Cursor | One controller; 22px ring retained; cyan English/gold Arabic accents observed; no random button recoloring. |
| Mobile touch media | Decorative cursor hidden; Arabic language selection and handoff work in a 390px viewport. Physical touch dispatch is unsupported in this browser. |
| All six section guide states | Hero, About, Skills, Projects, Experience and Contact titles update correctly; minimize, dismiss across navigation and reopen work. |
| Avatar facing | English desktop faces left toward content; Arabic desktop faces right; compact layouts target adjacent bubble. No facial rigging fabricated. |
| Project details | All five dialogs opened in English desktop and Arabic mobile; all 13 real screenshots selected on mobile; no modal overflow, correct contain proportions. |
| Modal keyboard behavior | Focus enters dialog, Escape closes, trigger focus returns, body/root locks released. Original-size screenshot links retained. |
| Mobile menu | Entrance visible after selector fix; keyboard focus inside; Contact navigation closes it and releases lock. |
| Reduced motion | Static orbs and section art; no portal zoom; readable Arabic welcome/main; cursor hidden. |
| Dynamic Hero phrase | Phrase changes after its interval with unchanged Hero/message heights. |
| Console | No error-level messages captured during the tested flows. |
| Asset and project destination requests | 27/27 HEAD requests returned 200: all 13 screenshots, six poses, welcome cutout, CV, three repository links and three live project demos. |

`npm test`: 2/2 tests passed (portal corner coverage at all target viewports, preserved featured project and real screenshot integrity). `npm run build`: passed. `git diff --check`: passed. The repository has no configured lint command, so no lint pass is claimed.

Production output: initial JS 496.38 kB / 165.61 kB gzip; CSS 130.02 kB / 25.91 kB gzip; deferred Three.js 736.44 kB / 186.85 kB gzip. The existing Three.js chunk still produces Vite's >500 kB warning. No additional rendering library was introduced.

## Limitations and follow-up priorities

1. Supply approved MyCohort screenshots if available; its current conceptual map is honestly labeled and remains functional.
2. Profile the existing Three.js environment on physical midrange phones. Responsive/touch-media checks were executed, but physical touch gestures and frame-rate measurements were not.
3. Real facial/lip animation requires a rigged model or suitable animation assets; the current guardian remains a sharp static-pose guide.
4. Tab-visibility pausing has explicit listener/timeline cleanup, but the in-app browser did not expose a reliable hidden-tab state for a real inactive-tab test.

Viewport changes during the measured portal intentionally finish with a normal fade rather than replaying stale geometry. LinkedIn/WhatsApp contact destinations were preserved; no messages were sent.

## Production verification — 11 October 2026

- Application commit: `5e840c0`, on `codex/premium-journey-refinement` and the existing default branch `codex/portfolio`.
- Vercel deployment `dpl_FwTanJWFSi86z1MzUnBjjssSXjaL` completed with `READY` status on the existing project.
- Live URL: https://the-software-engineer-fares-mohamme.vercel.app/#home
- Published English desktop orb → welcome → Hero, project 1–2–2 geometry, loaded gallery images and modal keyboard flow verified. Published Arabic RTL, Contact dialogue, mobile orb handoff/menu/Home navigation also verified. No captured console errors or broken loaded images; one app bar; released scroll locks.
- All 27 asset/project destination requests also returned 200 on production.
- Desktop checkout `C:/Users/User/Desktop/the-software-engineer-fares-mohammed` fast-forwarded to the implementation while preserving the user's untracked evidence/avatar folders. Primary source remains `C:/Users/User/Documents/ChatGPT/protofolio`.
- Local QA screenshots are in the ignored `.qa/` directory, including `premium-welcome-production.png`, `premium-portal-production.png`, `premium-hero-production.png`, `premium-gallery-production.png`, and `premium-mobile-ar-production.png`.
