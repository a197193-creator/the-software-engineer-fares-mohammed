# Moving text and supplied section artwork — 11 October 2026

Later update: the supplied PNGs now reuse the shared card interactions at the
user's request. See [shared-card-artwork-motion.md](shared-card-artwork-motion.md)
for the subsequent hover/float implementation and checks.

## Changes

- Hero messages change every 3.2 seconds instead of 6. The pause/resume button and its reserved column were removed. Hover and keyboard focus freeze both phrase rotation and the existing writing effect; leaving resumes them. Touch no longer sets an irreversible pause. Typing uses elapsed time (26ms per English grapheme / 85ms per complete Arabic word).
- The technology strip runs in 22 seconds instead of 38. Its container and track use LTR for the technology names even on an Arabic page. Two identical, nonshrinking groups each fill at least a viewport, avoiding the former RTL blank stretch. Hover/focus pauses the strip. Reduced motion and Subtle intensity show one wrapped, static list of all eight technologies.
- The existing single guide respects the full-width strip as a reading boundary, keeping its avatar and bubble above passing words. This uses the existing footer clamp and cached scroll measurements, without a second animation controller.
- Five supplied illustrations now appear before their matching sections. Transparent stills are lazy-loaded with explicit dimensions, without panels, CSS float loops, new lights, or fake screenshots. Mobile guide space is separate from the artwork and headings.
- Existing welcome, avatar poses, navbar, verified copy, real project screenshots and all five projects remain.

## Artwork exports

The supplied files were JPEGs, which cannot contain alpha. Four had a painted checkerboard; Skills had a dark backdrop. The built-in **imagegen** tool prepared transparent cutouts. Export sizing/compression then placed them proportionally on a 1920 × 480 transparent canvas; no stretching or clipping. Originals were kept unchanged.

The available image tool does **not** export animated WebP or VP9 WebM. The user's explicitly permitted transparent-PNG fallback was used. **No 6-second / 24fps animation is being claimed.** Background extraction may alter fine rendered details; these AI cutouts are not guaranteed pixel-identical to the JPEGs. Original transparent or layered artwork is the best source for a future exact animation.

| Section | Supplied JPEG suffix | Export | Bytes |
| --- | --- | --- | ---: |
| About | `6mb4du6mb4du6mb4` | `about-intro.png` | 441437 |
| Skills | `r63srar63srar63s` | `skills-intro.png` | 397710 |
| Projects | `sem1z5sem1z5sem1` | `projects-intro.png` | 472882 |
| Experience | `74t7vz74t7vz74t7` | `experience-intro.png` | 420449 |
| Contact | `7zcpbb7zcpbb7zcp` | `contact-intro.png` | 179370 |

Each file is 1920 × 480 RGBA with alpha spanning 0–255 and is below 0.5 MB. Website files: `public/assets/sections/`. User exports: `C:/Users/User/Desktop/Portfolio section artwork/Ready transparent PNG/`.

## Executed checks

- `npm test`: 2/2 passed (existing guardian boundary and genuine project/media checks).
- `npm run build`: passed. Initial JS 487.96 kB / 163.11 kB gzip, CSS 129.25 kB / 25.73 kB gzip. Existing deferred Three.js warning remains (736.44 kB).
- English hover: phrase and partially written text unchanged for 3.6 seconds; leaving resumed and advanced the phrase after 3.4 seconds. Arabic hover: unchanged for 3.5 seconds. No Hero pause buttons remain.
- English strip sampled for a full 22-second cycle, including wraparound: 9 visible words at every sampled point. Corrected Arabic strip sampled across 22.2 seconds: 8–9 visible words at every sampled point. Hover reported `animation-play-state: paused`; normal tracking reported `running`.
- Both languages at 1920, 1440, 1024, 768 and 390px: no horizontal page overflow, five artwork images, one navbar, no Hero pause buttons, artwork bounds inside the viewport.
- All five artwork assets loaded successfully with natural dimensions 1920 × 480. Five real project cards remain.
- Reduced-motion Arabic mobile: Hero static and complete, strip animation `none`, duplicate copy hidden, first copy wrapped with all eight technologies; PNG artwork retained. Emulation restored afterwards.
- Desktop and mobile screenshots inspected for transparent blending, correct direction and separate guide space. No error-level console logs captured in these checks. No lint script is configured.
- At 1440px with the strip mid-screen, the avatar's visible rotated box ended about 30px above the band; its bubble hid when there was insufficient space above the avatar. The full text band remained unobstructed.

## Main files

`src/components/HeroMessage.jsx`, `SectionIntro.jsx`, `src/App.jsx`, `src/typography.css`, `src/design.css`, `src/responsive.css`, `src/motion.css`, `src/refinement.css`, `src/locales.js`, `index.html`, and the five `public/assets/sections/*-intro.png` assets.

## Imagegen prompt set

All five requests used the supplied JPEG as an **edit target**, with `transparent_background: true`. Common requirements: extract only the background; true alpha, no baked checkerboard/black matte; same object arrangement, materials, lighting, camera and negative space; no new objects/text/particles; still PNG only. The specific targets were:

- **About:** preserve the cyan identity tile, closed dark notebook, warm gold compass and existing cyan circuit connections. Remove checkerboard in all negative space and retain semitransparent edge lighting.
- **Skills:** preserve the tall dark phone, three empty browser frames, two cylindrical database groups, gold/cyan geometric cluster and thin cyan paths. Extract the near-black background; do not turn abstract placeholders into real interfaces.
- **Projects:** preserve two layered dark browser panels, small phone and cyan connections; remove checkerboard. No real screenshots, added code, labels or UI details.
- **Experience:** preserve the three milestone assemblies (notebook/tiles, modular dark blocks and open gold compass), stacked bases and single thin cyan path; remove checkerboard including inside the compass lid opening.
- **Contact:** preserve the original dark envelope and thin cyan/gold signal curves/endpoints; remove checkerboard, with no additional or thicker glow.

For a future animated delivery, retain the user's original specification: exactly 6 seconds / 24fps with genuine alpha, locked camera, at most 5px main-object and 3px secondary drift at 1920 × 480, existing path brightness variation at most 10%, no new visuals, matching first/last frame, and matching PNG fallback.
