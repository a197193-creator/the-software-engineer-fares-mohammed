# Portfolio animation audit and safe roadmap

Audit date: **9 October 2026 (Asia/Kuala_Lumpur)**. Baseline: **`1c722cd00b51523932e6ce312c99c9d76b6562ef`**, production at [the portfolio](https://the-software-engineer-fares-mohammed.vercel.app/). Working branch: **`codex/animation-audit`**.

**TASK 0 only:** this checkpoint adds documentation. No runtime files, sections, assets or animations are changed. TASK 1 is specified below as the first proposed implementation, pending scope confirmation/approval. The existing Welcome and programmed transition stay protected.

## Architecture assessment

| Area             | Actual implementation                                                                                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework        | React **19.3.0**, Vite **8.3.4**, JavaScript/JSX, `@vitejs/plugin-react` **6.1.2**. `src/main.jsx` mounts `LanguageProvider → App`.                                                                                                                                                              |
| Routing          | One static client-rendered page; no React Router, Next.js, API or backend. Six section IDs: `home`, `about`, `skills`, `projects`, `experience`, `contact`. `App.goTo()` uses `scrollIntoView()` and `history.replaceState()` for hash navigation. Welcome completion currently returns to Home. |
| State            | `App` owns active section, navigation/menu, project dialog, theme, motion and Welcome readiness. The guide owns its open/tour state; projects own their filter.                                                                                                                                  |
| Welcome boundary | `WelcomeExperience` and `CinematicTransition` are siblings of `.portfolio-content`. The main content is hidden until ready and inert while Welcome remains open. Welcome appears on every load; language preference persists. The current transition is HTML/CSS, **not a video**.               |
| Content          | `src/data.js` holds profile, four project records and six guide steps. About, Skills, Experience and Contact are inline in `App.jsx`; Hero and Projects are separate components. No Coda record exists.                                                                                          |
| Hosting          | Vercel static Vite build from GitHub. No `vercel.json` is present. This audit does not change or publish the production site.                                                                                                                                                                    |

### Existing animation ownership

| Tool/owner                  | Current work                                                                                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GSAP **3.15.0**             | `PortfolioHero` entrance timeline; `useMotion` section reveals and scrubbed experience timeline fill. Context cleanup reverts its changes.                                                                             |
| ScrollTrigger               | Registered in `useMotion.js`; controls reveals/timeline and refreshes after fonts are ready or language changes.                                                                                                       |
| Lenis **1.3.26**            | Desktop smooth wheel scrolling. Its RAF is driven by the GSAP ticker and feeds ScrollTrigger updates. Disabled for reduced motion, touch/small screens, Welcome, menus and project dialogs.                            |
| CSS                         | Welcome choreography, coded entrance, hero light breathing, section avatar entrances/4-second breathing, 38-second skills marquee, hover/press transitions and dialog entrance.                                        |
| IntersectionObserver        | Hero visibility and section-avatar visibility. Avatar breathing pauses offscreen and on hover/touch interaction.                                                                                                       |
| Native RAF/pointer handlers | `usePageTracking` updates the active section/header/progress; `SandCursor` interpolates one ring and fades a fixed pool of 12 grains, stopping when idle. Project tilt/spotlight and magnetic links use CSS variables. |
| Three.js **0.186.1**        | Installed, but `AvatarStage.jsx`/`AvatarScene.js` are **unmounted legacy code**. The current production build has no Three.js renderer chunk; the live page has no canvas. Do not reactivate it for backgrounds.       |

## Styles, palette and typography

Import order in `main.jsx`: **design → details → responsive → cinematic → welcome → intro → readability**. Later selectors override earlier designs. `welcome.css` also contains main Hero, RTL and project-interaction rules, so changing that file can affect both experiences.

Effective dark main tokens verified in the live DOM:

| Token        | Current                       | Requested background identity             |
| ------------ | ----------------------------- | ----------------------------------------- |
| Base         | `#05090B`                     | `#080B10`                                 |
| Surface      | `#0D1113`                     | `#101722`                                 |
| Primary text | `#F3F0E9`                     | `#F4F5F7`                                 |
| Main accent  | Gold `#EFBC6D`                | Cyan `#40DFFF`, controlled gold `#F5C66A` |
| Muted text   | `#C0C6CD` inside `.cinematic` | Preserve existing readable contrast       |

There is an existing light theme. Hero has its own opaque dark photo/background and local token overrides; other sections are largely transparent with faint warm gradients in Skills/Contact. A new background beneath the Hero will be concealed by its image unless a carefully scoped decorative layer is placed above the image and below content. Keep that image intact.

English: **DM Sans** body/UI, **Cormorant Garamond** display. Arabic: **Noto Sans Arabic** body/UI, **Noto Naskh Arabic** display. Fonts come from Google Fonts with fallbacks. `readability.css` makes most body copy 17px, welcome descriptions 16px and controls/labels larger. Preserve these gains.

For TASK 1, introduce prefixed background tokens scoped to the main portfolio rather than overwriting `:root`, all `--accent` values or Welcome's `--choice`. The cyan/gold balance must stay the same in Arabic and English. Existing navigation, button colors and copy do not need a redesign to establish the new background identity.

## Reusable components

| Component/data                                              | Reuse and boundary                                                                                                                                                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PortfolioHero`                                             | Existing image, localized copy, CTA wrappers and scoped entrance timeline. Preserve content and image; avoid a second transform owner on its text.                                                                  |
| `SectionAvatar`, `avatarScenes`                             | Six section-owned images, localized quotes, image fallbacks, visibility and pause behavior. Reuse the scene map for future storytelling.                                                                            |
| `ChapterRail`                                               | Six-stop chapter navigation using the same scene map. Preserve navigation structure.                                                                                                                                |
| `Guide`, `guideSteps`                                       | Localized tour copy, next/previous steps, section shortcuts and motion control. Currently a **text guide**, with no speech audio, speech synthesis or lip animation.                                                |
| `Projects`, `ProjectCard`, `ProjectVisual`, `ProjectDialog` | Four records, filters, restrained tilt/spotlight, conceptual CSS visuals and accessible native dialogs. Internal card/visual components can later be extracted if necessary; extraction is not required for TASK 1. |
| `Magnetic`, `SandCursor`                                    | Existing mouse feedback. Keep one cursor system. The older `Cursor` and `Preloader` exports are unused.                                                                                                             |
| `LanguageProvider`, `tr`, `heroCopy`, `welcomeCopy`         | Current localization contract. Reuse rather than adding a second translation system.                                                                                                                                |
| `useMotion`, `usePageTracking`, `Heading`                   | Current motion policy, scrolling/active-section source and inline heading helper. Extend deliberately; avoid new competing scroll engines.                                                                          |

## Asset inventory and gaps

Confirmed packaged assets in `public/assets`:

- `cinematic-hero.webp`: **1672 × 941**, 92,576 bytes; main guardian/environment artwork.
- `cinematic-0.webp` through `cinematic-5.webp`: six **600 × 850** transparent section poses, about 70–76 KB each; live dimensions/loading checked.
- `avatar-0.webp` through `avatar-5.webp`: six earlier transparent laptop/standing/celebration poses, about 55–72 KB each; current image-error fallbacks. Alpha/provenance documented in `ASSET-NOTES.md`.
- `welcome-guardian.webp`: **1280 × 647**, 96,150 bytes; existing language selection artwork.
- The 14 WebP files total **1,007,768 bytes**; this is the packaged inventory, not a claim that every file downloads on first paint. `public/og.png` and `favicon.svg` are also available.

Original avatar PNG, cinematic design board, Welcome JPEG and old MP4 remain on the Desktop. The old MP4 is not packaged or used; restore neither it nor its poster. No GLB/GLTF, rig, animation clips, Lottie, speech audio or self-hosted fonts are bundled.

Missing assets, in practical order:

1. **Real project screenshots/recordings and approved demos/repository links.** All four project screenshot/demo/GitHub fields are null; current artwork is conceptual. Keep the existing project facts.
2. **Approved bilingual spoken guide script and audio/voice choice**, if audible narration is desired. Reuse current text as a starting point; require user-initiated playback with transcripts/mute. The masked avatar does not need fake mouth movement.
3. **Authored motion frames or a rigged guardian model with clips**, only for true hand/laptop/body articulation. The current image poses support 2.5D movement/crossfades, not mesh rotation or skeletal gestures.
4. **CV/contact details**, still deferred: email, LinkedIn, WhatsApp and CV are null. They are content gaps, not blockers for background work.

**TASK 1 needs no new external image, model or video assets.** Grids, restrained panels, particles and light can be built in CSS using this guardian's existing visual identity.

## Proposed animation architecture

Keep separate layers and one owner per animated property:

```text
App's existing state: active section / motion / theme / Welcome readiness
  ├─ WelcomeExperience + CinematicTransition (protected existing boundary)
  └─ Main portfolio
      ├─ MainBackground (new, decorative, CSS-owned, pointer-events:none)
      ├─ Existing semantic sections and controls
      └─ Later section timelines / guide extensions (separate approved tasks)
```

- **MainBackground API:** accept `activeSection`, `motion`, `theme`, and `enabled`. Enable only after Welcome closes and the portfolio is ready; pause while covered, hidden or blocked by a modal. Reuse App's active section rather than observing/reading every section again.
- **Tokens:** `--world-bg`, `--world-navy`, `--world-cyan`, `--world-gold`, light intensity, drift distance, **8-second breathing**, 30–45-second drift and a roughly 1-second section-light transition. Scope them to the main background/portfolio wrapper. Provide light-theme values without changing the Welcome.
- **Layer budget:** two bounded atmospheric gradients, one faint static architectural grid, around six tiny particles and at most two small interface fragments on desktop. Mobile uses fewer details and no pointer parallax. No canvas/WebGL or full-screen animated blur.
- **Movement:** CSS transform/opacity for idle layers. For later scroll progress, use the existing ScrollTrigger/GSAP clock with refs/CSS variables; do not put per-frame coordinates in React state. Give parallax an outer wrapper and breathing an inner wrapper so they cannot overwrite each other.
- **Reading zones:** bright lighting at edges/artwork areas; subdued grid/panels under copy. Decorative nodes are `aria-hidden`, clipped to their own bounds and cannot intercept controls. Avoid readable fake project interfaces.
- **Motion policy:** reuse `motion`, `.motion-off` and reduced-motion media queries. Static fallback shows the same palette/composition; no dependency on animation completion. Use Page Visibility to pause new continuous motion.
- **Future typography:** animate line/block wrappers. Avoid splitting Arabic into individual letter nodes, which can break shaping; preserve semantic text and reading order.

## Ordered implementation roadmap

| Order      | Deliverable                                                                                                                                                                                                                                                                                 | Stop/checkpoint                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0          | This repository/live audit and safe branch/checkpoint.                                                                                                                                                                                                                                      | Review scope/approve TASK 1. No animations implemented here.                                                                                         |
| 1 — TASK 1 | Add `MainBackground.jsx` and scoped `main-background.css`; minimal mount/import/layer integration in `App.jsx`/`main.jsx`. Add slow cyan-led light, controlled gold, faint grid and bounded fragments. Keep every Welcome file/asset, copy, project, avatar behavior and navigation intact. | Test EN/AR, dark/light, desktop/mobile, reduced/paused motion, replay, menu/dialog layering, console and overflow. Summarize changed files and stop. |
| 2          | Main typography choreography using existing semantic wrappers/GSAP; preserve Arabic shaping and reduced-motion visibility.                                                                                                                                                                  | Separate approval and regression check.                                                                                                              |
| 3          | Extend the existing guide/quotes with controlled speech bubbles, optional user-triggered narration and accessible controls.                                                                                                                                                                 | Confirm voice/assets and avoid unsolicited audio.                                                                                                    |
| 4          | Section-scoped avatar 2.5D scroll choreography using existing poses, with layout/focus safe zones and mobile fallbacks.                                                                                                                                                                     | Approve storyboard first; true articulated movement requires additional assets.                                                                      |
| 5          | Cinematic project presentations around existing four cases and real evidence. Keep filters and native dialogs usable.                                                                                                                                                                       | Validate content, keyboard navigation and scrolling before any pinning.                                                                              |
| 6          | Measured polish/performance and optional 3D only if justified.                                                                                                                                                                                                                              | Test actual devices/browsers and publish after the agreed release gate.                                                                              |

## Risks and performance considerations

| Observed condition                                                                          | Consequence and control                                                                                                                                    |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seven overlapping style sheets, including main styles in `welcome.css`                      | Global token/selector changes can unintentionally alter Welcome or RTL. Add prefixed, main-scoped styles; do not reorganize the cascade in TASK 1.         |
| Existing CSS + GSAP + pointer transforms                                                    | Competing transforms can snap or erase motion. Assign separate nested nodes; keep project tilt/magnetic/cursor ownership intact.                           |
| Existing Lenis ticker and native scroll tracking                                            | A second smooth-scroll engine or permanent background RAF multiplies work. Reuse current state/clock and prefer CSS for idle background motion.            |
| Reveals refresh on fonts/language, not explicitly on project filter layout changes          | Future long/pinned timelines can become stale after filtering. Add debounced layout refresh at the appropriate future task; avoid pinning in TASK 1.       |
| Page tracking reads section bounds on scroll; its queued RAF is not canceled during cleanup | Fine with six sections today; do not duplicate it. Cancel a stored RAF if this hook is later modified.                                                     |
| Marquee runs even when offscreen; existing fixed glass UI uses backdrop blur                | New ambient loops increase compositing cost. Budget few layers, pause hidden work and avoid animated blur/backdrop filters.                                |
| Both Welcome image and main Hero use high fetch priority                                    | Do not preload more background assets. TASK 1 can use CSS only. Review actual LCP before changing the current loading policy.                              |
| Arabic line wrapping and language changes                                                   | Heights and motion distances differ. Derive positioning from layout, refresh after layout/fonts, test both languages. Do not tie main palette to language. |
| Dark photo, card surfaces, header, cursor and native dialog top layer                       | Test stacking/contrast rather than broadly lowering surface opacity. Background must remain below readable content and pointer-transparent.                |
| React remounts/replays and future visibility listeners                                      | Scope/revert GSAP contexts; remove listeners/timers/observers; restore styles. Static content must remain usable after motion is paused.                   |

## Verification performed for this audit

- Clean starting checkout; working branch created from `1c722cd`. Runtime source and public assets unchanged.
- `npm run build` passed: one JS bundle **429.09 KB / 142.58 KB gzip** and CSS **80.60 KB / 16.81 KB gzip**. No Three.js rendering chunk in current output.
- Live Arabic dark page inspected at **1101 × 884**: six sections, four projects, loaded cinematic images, no canvas/video, no horizontal overflow. Hash navigation to Projects works. Captured ignored `.qa/task0-baseline-hero.png` for later comparison.
- Live console warning/error scan was empty. This is a smoke audit, **not** Lighthouse, a frame-rate benchmark or Safari/Firefox/device certification. No runtime implementation changes were made.

Audit-only changed file: **`ANIMATION-AUDIT.md`**. The roadmap is a proposal; TASK 1 and later tasks have not been implemented in this checkpoint.
