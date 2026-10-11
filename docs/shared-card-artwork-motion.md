# Shared Skills-card and section-artwork motion — 11 October 2026

## Cause and fix

Skills already used `MotionCard` and the shared pointer controller. The legacy
`.skill-card:hover` transform in `design.css` overrode pointer tilt with a fixed
4px vertical shift. Shared hover feedback was also restricted to widths of
1100px and above. Removed the legacy rule and separated the mouse-capability
query from the desktop-only idle-floating query.

Shared cards now use the existing motion tokens for tilt, hover scale, 2px lift
in Balanced mode, tracking light and return to rest. Entrance, idle float and
pointer transforms still live on separate wrappers. No second controller or
library was introduced; Welcome interactions remain unchanged.

The five supplied About, Skills, Projects, Experience and Contact PNGs now reuse
`MotionCard`. Their hover light is masked by their genuine image alpha. Hover
does not add a rectangular shadow, border or background to the illustrations.
The assets, aspect ratio, lazy loading and independent mobile guide slot remain.
This is code-driven interaction on existing PNGs, not a generated video export.

Subtle intensity disables shared idle floating. Touch-only devices receive no
pointer tilt or tracking light. Reduced motion and paused motion retain static
surfaces. Static `scale`/`translate` values use CSS variables so the production
CSS compiler cannot fold them into `transform` and leave hover scale active.

## Executed verification

- `npm run build`: passed. Initial JavaScript 488.04 kB / 163.10 kB gzip; CSS
  129.79 kB / 25.84 kB gzip. The existing deferred Three.js chunk warning remains.
- `npm test`: existing 2/2 tests passed. `git diff --check`: passed. No lint script
  is configured.
- Real mouse movement, English at 1440px: all four Skills cards returned nonzero
  3D tilt, scale 1.01, lift -2px and tracking light; leaving reset tilt and light
  and resumed idle floating.
- English at 1024px: Skills hover scale, tilt, lift and border feedback worked
  below the former width cutoff, with no horizontal overflow.
- All five section illustrations: pointer response, scale 1.01, lift -2px,
  matching alpha mask, no box shadow, and loaded 1920px-wide original PNGs.
- Arabic RTL at 1440px: Skills card and illustration hover worked; Skills text
  remained right-aligned.
- Emulated reduced motion, including a hovered card: all four Skills cards and
  five illustrations had scale 1, no translation or transform, no float, and no
  tracking light.
- 390px mobile, English and Arabic: five artworks/four Skills cards retained;
  no horizontal overflow. Touch emulation reported coarse pointer/no hover;
  artwork hover stayed inactive with no tilt, light or float. Mobile navigation
  and language switching were exercised. Device emulation was restored.
- No error-level page console logs captured during these checks. Screenshots
  were saved in `.qa/` and visually inspected. Physical-device FPS was not
  measured.

## Changed implementation files

`src/components/SectionIntro.jsx`, `src/design.css`, `src/journey-polish.css`,
`src/motion.css`, `src/refinement.css`.
