# TASK 4 — Scroll-synchronized 2D guardian

Review branch: `codex/avatar-scroll`, based on TASK 3 checkpoint `67d492c`.
The implementation is local; no GitHub push or Vercel deployment has been performed.

## Existing project and assets

The portfolio is a React/Vite single-page application with hash navigation, GSAP/ScrollTrigger typography and Lenis desktop scrolling. This task uses those existing libraries and adds no dependency, rendering engine, model or image.

Inspected the actual WebP files and their alpha channels, alongside `ASSET-NOTES.md`. The six cinematic cutouts are RGBA, transparent, **600 × 850** pixels and approximately **70–76 kB** each. Their shared canvas provides consistent proportions and foot alignment without stretching.

| Section    | Actual primary image / pose                      | Existing fallback                           |
| ---------- | ------------------------------------------------ | ------------------------------------------- |
| Home       | `cinematic-0.webp`: standing, closed laptop      | `avatar-0.webp`: closed laptop              |
| About      | `cinematic-1.webp`: thoughtful, hand near chin   | `avatar-4.webp`: hand in pocket             |
| Skills     | `cinematic-3.webp`: arms crossed                 | `avatar-4.webp`: hand in pocket             |
| Projects   | `cinematic-2.webp`: working with an open laptop  | `avatar-2.webp`: typing with laptop         |
| Experience | `cinematic-4.webp`: composed side view           | `avatar-3.webp`: holding laptop in one hand |
| Contact    | `cinematic-5.webp`: standing with an open laptop | `avatar-2.webp`: typing with laptop         |

The earlier six `avatar-0` through `avatar-5` cutouts are transparent **418 × 627** WebPs, approximately **55–72 kB**. They also include looking at a laptop (`avatar-1`) and a celebration pose (`avatar-5`), which remain unused rather than being substituted without a section purpose.

The existing opaque `cinematic-hero.webp` (1672 × 941) remains the Hero artwork. It receives a restrained whole-image camera drift and uniform breathing, without putting another full-body character over the large portrait. The Home cutout remains its image-failure fallback. The Welcome guardian and programmed transition are unchanged. There are no packaged GLB/GLTF models, rigs, mouth frames, character videos or voice recordings. The unused older Three.js module is not activated.

## Experience and architecture

- `useActiveSection` is the **existing** guide detector extracted into a shared hook. IntersectionObserver watches the 40–46% reading band, then waits 350 ms before committing a section. Dialogue and pose changes therefore use the same section and settling interval.
- One `AvatarController` selects the decoded image for the settled section. React portals place it in the section's existing `character-frame` art slot. At most two enhanced layers are retained during a short outgoing/incoming dissolve; there is one current animated pose after settling. Existing inactive artwork stays as a static section illustration.
- Section changes transfer the guide between the authored left/right art positions using a dissolve and a small entrance movement. The image stays clipped to its art slot throughout. It does not fly across headings, cards or links, or simulate walking.
- Opacity tweens use existing GSAP and start from the current opacity when a transition reverses. The spring wrapper preserves its transform when a recently departing layer becomes current again. Incoming images are decoded before display; stale asynchronous results are ignored and retirement timers are cancelled when the selection changes.
- `useAvatarMotion` follows normalized section progress with a damped spring (mass 1, stiffness 170, damping 26). Desktop movement includes approximately ±12 px of scroll parallax, controlled pose-specific horizontal docking, a small tilt, and at most ±4 px of pointer following. Uniform scale changes remain below 1% on cutouts.
- Translation/tilt, entrance motion and idle breathing own **separate nested nodes**. They cannot overwrite each other's transforms or those of typography, project cards or the existing cursor.
- Idle motion uses a 7.5-second CSS cycle: 2 px of floating and 0.3% uniform scale. Hero breathing uses a 9-second cycle. There is no face/body deformation, articulation or new mouse trail.
- The spring updates styles without React scroll state. It sleeps once settled; CSS handles idle breathing. Bounds are read after scroll/layout/pointer updates, rather than on every idle frame. Offscreen and inactive-tab movement stops. Observers, listeners, RAF handles and tweens have cleanup paths.
- The current and neighboring pose images are warmed after Welcome finishes, with one bounded decode cache. Primary failures use the existing fallback image; there is no new asset download service.

### Responsive and accessible behavior

On desktop, pose offsets keep the face visible near its existing speech bubble. The Projects avatar and bubble have separate horizontal space so the laptop is visible. Below 1100 px, a small full-body avatar sits above the dialogue in the existing art area. That area reserves enough height for the message, so typing does not move the following content.

Tablet movement uses 55% of the desktop range; mobile uses 22%, disables pointer following and removes the idle loop. The site's motion switch and `prefers-reduced-motion` use static original cutouts and complete readable dialogue. Welcome, mobile navigation and project dialogs suspend the enhanced controller.

Existing TASK 3 `AvatarGuide`, `guideDialogue.js` and `useGuideTyping` remain the dialogue system. Whole-word Arabic typing, RTL layout, instant completion, one atomic screen-reader message, completed-message reuse, minimize/dismiss and visit persistence are preserved. Speech bubbles remain readable while the character moves; keyboard interaction or hovering the bubble pauses character movement. No audio autoplay, fake lip sync or chatbot backend has been added. Pose intent metadata (`welcoming`, `explaining`, `presenting`, `reflecting`, `connecting`) and the separate typing lifecycle can support a later audio integration.

## Changed files

| File                                    | Change                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/avatarPoseRegistry.js`             | Central verified poses, section intents/docking and decoded image/fallback cache.                |
| `src/components/AvatarController.jsx`   | Section selection, safe portal placement, opacity transitions and neighboring preloads.          |
| `src/hooks/useActiveSection.js`         | Shared visibility/debounce logic extracted from the guide provider.                              |
| `src/hooks/useAvatarMotion.js`          | Bounded spring, pointer/scroll progress, visibility/interaction pause and cleanup.               |
| `src/avatar-motion.css`                 | Nested idle/entrance motion, clipped art slots, responsive guide placement and static fallbacks. |
| `src/components/AvatarGuideContext.jsx` | Reuses the shared section detector; visit and dialogue state retained.                           |
| `src/components/SectionAvatar.jsx`      | Uses the registry, exposes art slots and interaction state, retires the competing old idle loop. |
| `src/components/PortfolioHero.jsx`      | Dedicated wrappers for the existing portrait and its motion hook; Hero content unchanged.        |
| `src/App.jsx`                           | Mounts the shared controller.                                                                    |
| `src/main.jsx`                          | Imports the scoped stylesheet.                                                                   |
| `TASK-4.md`                             | Asset inventory, architecture, verification and limits.                                          |

## Verification

Tested the **compiled production build** at `http://127.0.0.1:5174/`, alongside initial development checks.

- `npm run build` passed: JS **445.24 kB / 147.56 kB gzip**, CSS **89.96 kB / 18.61 kB gzip**. No dependencies or public assets changed. `git diff --check` passed.
- English desktop at 1280 × 720: Home portrait and all five section cutouts matched their dialogue, loaded successfully, with one live bubble and no horizontal overflow.
- Forward/backward wheel scrolling in About changed progress **0.3820 → 0.2768** and spring Y **−2.89 → −5.41 px** while the completed message stayed complete.
- Moving the desktop pointer across the viewport changed the bounded About X position approximately **−39.87 → −32.25 px**. Focus inside the message paused motion; leaving the controls resumed it.
- Rapid large wheel changes in both directions kept one live bubble and loaded pose layers. Subsequent final-build checks verified the new GSAP dissolves and correct section poses without new console warnings/errors.
- Arabic at 320 × 720 and 375 × 812: all six section messages/poses were checked. Words retained Arabic shaping; instant completion worked. Guide geometry stayed within the reserved art areas, with no overlap with content/control rectangles and no horizontal overflow. Some long sections require ordinary scrolling to see the whole avatar/dialogue area.
- English tablet at 900 × 900: all five cutout/dialogue pairs passed, with no overlap with section text, skill cards, timeline, project toolbar/grid or contact controls. Parent containers that contain the bubble were excluded from overlap checks.
- Reduced-motion emulation: enhanced cutout count was zero, Hero transform was `none`, all 16 words of the Projects message were visible, and typing was false. Enabling site motion afterward restored the controller without a blank page.
- The Projects "Mobile" filter retained two cards; the DiaCare dialog opened/closed. Enhanced avatar and bubble counts were zero while the dialog was open, then restored after Escape.
- Mobile menu and Welcome transition suspended the controller and speech bubbles. Language selection/transition continued to work.
- Dismissing the Arabic guide remained effective after refreshing and completing Welcome; explicit reopening restored the bubble.
- Temporarily blocked the primary Experience image using browser network controls. The animated and static images both loaded the existing **`avatar-3.webp`** fallback at 418 px natural width. Blocking and cache emulation were restored; clean final-build verification had no new warnings/errors.
- Scoped diff confirmed no changes to Welcome/transition assets or files, project cards/data, dialogue copy, cursor, global theme, typography styles, metadata or dependencies.

QA used Chromium responsive emulation and its accessibility tree. Physical phones, Safari and a real screen reader were not tested. No universal FPS, Lighthouse score or device certification is claimed. Temporary viewport/media/network overrides were restored.

Saved previews: `.qa/task4-avatar-desktop.png`, `.qa/task4-ar-mobile.png`; asset inspection: `.qa/task4-asset-inventory.png`.

## What current images can and cannot do

The existing images support cinematic docking, whole-image float/breathing, small planar tilts, scale/parallax, pointer following and pose dissolves. They cannot create independent arm/hand/laptop movement, authentic walking, facial expressions or realistic lip sync. Those would need authored animation frames/clips or a properly rigged model; voice would also need approved audio and suitable mouth controls. These assets have not been invented or generated.

Next priorities: review this phase, check an actual phone/Safari, then publish the approved version. Additional articulation/audio is optional future work, rather than a prerequisite for this working 2D guide.
