# Task 5 — Cinematic cursor and pointer interactions

Implemented on `codex/cursor-interactions`, based on Task 4 checkpoint `8bf5c7a`.
This task changes only pointer decoration and interaction feedback. It does not
change the Welcome assets/transition, avatar dialogue/movement, navigation,
project structure, or section copy.

## Files

- `src/components/CinematicCursor.jsx`: main-only cyan field, interpolated ring,
  and six recycled DOM particles. Particles live for 340 ms at maximum opacity
  0.24. The native cursor remains visible. The field has no blur filter, sits
  below content in the isolated site stack, and has a separate Hero photo layer
  below the existing photo darkness mask. Only the ring can turn gold over a
  primary button; the field and trail remain cyan in both languages.
- `src/hooks/usePointerSurface.js`: shared card/magnetic behavior. Caches geometry
  per pointer entry, batches writes with requestAnimationFrame, clamps magnetic
  movement to 4 px horizontally/3 px vertically and card tilt to 1.5 degrees.
  Resets on leave, cancellation, focus, scroll, resize, visibility, and settings.
- `src/pointer.css`: scoped theme/motion tokens; subtle hover, press, underline,
  card light, visual zoom, and reduced-motion/touch fallbacks. Card lighting stays
  within its existing conceptual visual rather than covering descriptive text.
- `src/components/Effects.jsx`, `src/components/Projects.jsx`: replace existing
  direct mousemove style writes with the shared hook. Existing card visuals and
  project opening buttons remain intact.
- `src/App.jsx`, `src/main.jsx`: minimal integration and stylesheet import.
  Existing SandCursor still runs on the Welcome; the new system starts only after
  the transition and suspends during a project dialog or mobile navigation.

## Behavior and performance

No new packages, canvas, global mousemove React state, hidden native cursor, or
new avatar transforms. The cursor RAF sleeps after interpolation and particles
settle. Surface RAFs run only when a pointer sample is queued. All added listeners,
media-query listeners, the Hero resize observer, and animation frames are cleaned up. Decorative nodes
have pointer-events:none and aria-hidden. Keyboard use hides the decoration.

Touch/coarse-pointer devices and reduced-motion users receive static interaction
feedback. The existing site-wide Pause motion control also disables the system.
The optional extra avatar proximity reaction was omitted because Task 4 already
owns avatar pointer movement and speech-bubble pause behavior.

## Verification

- Production build passed. JS 449.48 kB / 148.93 kB gzip; CSS 94.42 kB /
  19.29 kB gzip. Task 4 JS was 445.24 kB / 147.56 kB gzip.
- Desktop 1280x720: cyan pointer tracking; gold ring on the primary CTA;
  bounded magnetic displacement; reset on leaving; card tilt/light; native
  cursor preserved; decorative overlays do not intercept hits.
- Opened MyCohort and closed with Escape: native dialog works, focus returns to
  its opening button, and decoration is hidden while the dialog is open.
- Arabic: RTL layout, same cyan pointer palette, no horizontal overflow.
- Runtime reduced-motion emulation: decoration hidden, button scale 1,
  magnetic offset zero, and the existing motion control changes to Enable motion.
- Touch-only emulation (hover:none/pointer:coarse) and 375x812 CSS viewport:
  decoration hidden even with mouse input, no horizontal overflow, mobile menu
  and project opening/closing work, card tilt stays at zero.
- All temporary viewport, reduced-motion, and touch overrides restored.
- The complete English Welcome selection/transition still reaches the Hero;
  main cursor decoration stays hidden until that transition completes.
- No new console warnings/errors during the compiled preview checks; formatting
  and `git diff --check` passed. Site-wide Pause/Enable motion was tested directly.

A bounded before/after comparison used an isolated build of `8bf5c7a` and the new
compiled preview: English Projects heading, motion enabled, 1280x720, 120 pointer
samples at 50 ms cadence plus 15 small bidirectional wheel events. CDP metrics:

| Metric | Task 4 | Task 5 |
| --- | ---: | ---: |
| Sample duration | 6.346 s | 6.008 s |
| Main-thread task time | 5.565 s | 5.195 s |
| Task time / sample duration | 87.7% | 86.5% |
| Script time | 0.557 s | 0.471 s |
| Style recalculation time | 2.959 s | 2.956 s |
| Layout count / duration | 0 / 0 s | 0 / 0 s |

No increased main-thread utilization or additional layout was observed in this
sample. This is a local comparison, not a universal FPS guarantee; the existing
site's section animations/style recalculation remain part of both samples.
Raw metrics and screenshots are retained under ignored `.qa/`.

## Delivery

Local checkpoint only. No deployment or push is included in Task 5. Stop here
until the next task is approved.
