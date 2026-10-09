# Task 7 — Cinematic integration and performance

Implemented on local branch `codex/cinematic-integration`, alongside the
authorized Task 6 project presentation. No unrelated sections were redesigned.
Welcome source, assets, and its animation timeline were not edited.

## Improvements

- Central motion tokens and Subtle / Balanced / Cinematic presets. Balanced is
  the default; the bilingual footer control remembers the choice. Cinematic
  falls back to Balanced outside suitable desktop pointer environments.
- OS reduced motion overrides every preset. Changing that OS preference no
  longer overwrites the user's saved motion choice. The existing Pause motion
  remains available; it cannot override OS reduced motion.
- Main entry starts after Welcome completes. Main CSS ambient motion pauses
  while Welcome, navigation, or a project dialog blocks interaction and when
  the document is hidden. Hero rotation respects guide availability; typing
  timers pause when the document is hidden.
- Project entry, floating, pointer tilt, avatar spring, avatar breathing, and
  pose opacity remain separate transform/opacity owners. Avatar dialogue and
  pose selection still share the existing debounced section detector.
- Localized the scroll-progress transform write to its bar, eliminating the
  previous inherited root CSS variable update on every scroll frame. Removed
  unused inherited avatar progress writes and pointer-triggered geometry reads.
- Shared environmental listeners across pointer surfaces; canceled queued RAFs
  and removed ticker/listener/observer registrations on cleanup. Avatar spring
  promotes a layer only while running. Lenis now reacts to viewport/pointer
  eligibility changes and is disabled in Subtle/reduced/inactive/blocked modes.
- Fixed mobile menu navigation measuring its target before the menu released
  the scroll lock. English Contact previously stopped short and left the guide
  on Experience. Navigation now waits a frame for cleanup. Navigation and guide
  also handle a short final section at the bottom of the document.

## Changed files

Task 6 project files are listed in `TASK-6.md`. Additional Task 7 files:

- `src/motionConfig.js`: durations, easing, stagger, scale, float, glow, presets.
- `src/components/MotionSettings.jsx`: central preference/device/visibility state.
- `src/motionEnvironment.js`: reference-counted shared environmental listeners.
- `src/motion.css`: scoped main motion, pause/static behavior and control styling.
- `src/App.jsx`, `src/main.jsx`: provider, readiness, effective motion, menu repair.
- `src/components/Guide.jsx`: bilingual intensity selection and reduced-motion note.
- `src/hooks/useMotion.js`, `src/hooks/useActiveSection.js`: localized progress,
  reactive Lenis lifecycle, tokenized reveals, end-of-page section handling.
- `src/components/StoryTypography.jsx`, `src/components/PortfolioHero.jsx`:
  shared entry values and Welcome-to-main coordination.
- `src/hooks/useAvatarMotion.js`, `src/components/AvatarController.jsx`:
  motion strength, fewer geometry/style writes, tokenized pose opacity durations.
- `src/components/CinematicCursor.jsx`, `src/hooks/usePointerSurface.js`:
  preset particle counts/strength and shared listener cleanup.
- `src/components/HeroMessage.jsx`, `src/hooks/useGuideTyping.js`: pause gating.
- `src/locales.js`: natural Arabic settings/project labels.
- `TASK-6.md`, `TASK-7.md`: implementation and verification records.

## Tests actually executed

| Check                                                                               | Result                                                                                       |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Production build                                                                    | Passed, no new dependency                                                                    |
| English Welcome keyboard selection; full transition and skip paths                  | Passed; main focus reached Hero                                                              |
| Arabic Welcome full transition after refresh                                        | Passed; dismissed guide state survived the visit refresh                                     |
| Desktop English/Arabic journey through About, Skills, Projects, Experience, Contact | Correct active guide, single bubble, no observed overflow                                    |
| Mobile English/Arabic 375x812 journey, all six sections                             | Passed; English Contact failure fixed and entire English journey rerun                       |
| Mobile navigation / dialog / guide controls                                         | Passed; menu closed, dialogs opened/closed, guide dismiss/restore worked                     |
| Four project dialogs and all four filters                                           | Passed on English desktop; Arabic and mobile DiaCare also tested                             |
| Keyboard disclosure, Escape, focus return                                           | Passed; visible focus indicators observed                                                    |
| Subtle, Balanced, Cinematic                                                         | Tested; Balanced restored; mobile Cinematic effectively Balanced                             |
| Arabic reduced-motion Welcome and all six sections                                  | Static readable text, full words, no float/cursor; controls disabled appropriately           |
| Runtime OS reduced-motion on/off                                                    | Effective motion stopped/restored without losing user choice                                 |
| Lenis viewport changes, without menu interaction                                    | Mounted at 1000px, removed at 750px, restored at 1280px                                      |
| Hero message swap after 6.5 seconds                                                 | Different phrase; both measured 357 x 26.39px                                                |
| Project pointer / modal coordination                                                | Separate transform owners; floating paused during dialog; clicks not blocked                 |
| Loaded assets / console                                                             | No broken loaded images, no video element, no new errors/warnings in compiled preview window |

Sampled dark project body/context colors measured 11.02:1 against their solid
card surface; title measured 16.67:1. These samples are not a certification of
every color, theme, or state. Arabic shaping uses complete words, and full guide
messages appear once in an accessible status rather than per-character updates.
Screen-reader semantics were inspected; no physical screen-reader session was run.
Hidden-tab pausing and listener cleanup were source-reviewed; hidden-tab behavior
was not separately exercised through a real tab visibility change.

## Measured performance and limitations

Final build: JS **456.81 kB / 151.06 kB gzip**, CSS **105.72 kB / 21.19 kB gzip**.
Task 5 was JS 449.48 / 148.93 gzip and CSS 94.42 / 19.29 gzip. No new package or
3D engine was added. The installed Three dependency remains unused/unbundled.
Existing 14 WebP avatar/Welcome assets are roughly 55–96 kB each; neighboring
poses warm only after Welcome. Project screenshots will load lazily when supplied.

A local six-second pointer/wheel workload used the same cadence as Task 5:

| CDP metric                   | Task 5 sample | Task 7 sample |
| ---------------------------- | ------------: | ------------: |
| Style recalculation duration |       2.956 s |       0.476 s |
| Script duration              |       0.471 s |       0.806 s |
| Main task duration           |       5.195 s |       3.350 s |
| Layout duration              |             0 |    0.000565 s |

Style work fell about 84% and task time about 36%; script work increased with
the new panels/integration. Task 6 also changed the DOM, so these are bounded
local observations, not a controlled cross-device benchmark or FPS guarantee.
During the Task 7 sample, 1080 observed RAF intervals had median 5.6ms, p95 5.7ms,
and CLS 0. A separate English journey observation measured CLS **0.0513**, not
zero. Its trailing idle frame sample is not used as a whole-journey frame-rate
claim. Metrics preceded the final small menu/preference/Lenis lifecycle repairs;
affected behavior was retested after those repairs, not rebenchmarked.

No production Lighthouse, network-throttled cold-load, real low-end phone, Safari,
or Firefox measurement was run. The JS bundle and larger project DOM remain
performance considerations. Future tuning should follow real-device measurements
before adding effects. Temporary motion/device overrides and diagnostics were
removed; the preview ends in English, normal desktop, Balanced, motion enabled.
Raw observations/screenshots remain in ignored `.qa/task7-results.json` and
`.qa/task6-showcase-*.png`. Historical development HMR errors from intermediate
edits are outside the compiled-preview test window.

## Remaining work, highest priority first

1. Supply actual project screenshots, permitted repository/demo URLs, the chosen
   CV, and contact details. Current maps and GitHub-only contact are intentional
   because those assets/details have not been supplied.
2. Review this local checkpoint and approve the next action. No GitHub push or
   production deployment was performed for Tasks 6–7.
3. Validate the deployed version on real phones and additional browsers; measure
   cold-load performance and trace the remaining small journey layout shifts.
4. The dedicated living global background proposed in Task 1 is absent in the
   current repository. Existing Hero atmosphere and project grids were audited;
   a new global background was not introduced during this integration scope.
5. Optional avatar realism: no GLB/GLTF, facial rig, mouth shapes, speech audio,
   or real skeletal animation assets exist. Current 2D poses support the guide;
   future speech/lip sync would require those assets. No fake lip sync or audio
   playback was added.

Tasks 6–7 stop at this local review checkpoint.
