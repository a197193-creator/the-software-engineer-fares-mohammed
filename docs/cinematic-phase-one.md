# Cinematic refinement and academic update — 12 October 2026

## Scope

This implements the first enhancement pass after the audit, plus the user's
explicit request for stronger scrolling and their supplied latest academic
result. Existing content, five projects, screenshots, avatar poses, bilingual
navigation, Welcome replay and every-refresh gateway behavior are preserved.
No new model, generated screenshot, rendering library or contact backend was
introduced. The next-phase avatar consolidation and project routes remain out
of this pass.

## Visitor-visible improvements

- The selected language orb is captured at its current position/glyph animation
  state, pulses, travels to viewport center, expands, and blends into the
  message-only welcome over the same live background. One GSAP timeline owns
  this sequence. Rapid selection is locked; skip, back navigation, significant
  resize, reduced motion and unmount safely cancel it. Refresh/replay remain.
- All five transparent section illustrations gain a desktop scroll-linked
  approach, settle and recession. Their extra inner scene layer is independent
  of the existing entrance, idle float and pointer tilt. Hover light uses the
  moving artwork alpha, without a rectangular backdrop. Compact/touch layouts
  keep the simpler reveal; reduced/Subtle stays static.
- Real project panels enter from more noticeable depth, with geometry-aware
  horizontal entry and paired-row timing. They settle into the unchanged
  1–2–2 grid. Keyboard focus completes a panel immediately. Workspace edge/grid
  lighting was refined, without changing media or verified project copy.
- Word reveals replay coherently when returning to a section; small chapter
  accents track approach progress. The existing world camera moves through a
  deeper desktop path, and its existing rim light gently changes by section.
- The same guardian stays below the header and above full-width reading
  surfaces. It suspends presentation when usable space is too small, without
  resetting guide preference/dialogue. Fixed 600×850 geometry is scaled with
  transforms; repeated width/height/top writes were removed where possible.
- Header includes the existing CV download. Canonical/social URLs and both CV
  portfolio links now use the working production hostname.

## Verified academic content

The saved `.cfm` contains only "No Information." The user-supplied examination
result image is the evidence for cumulative GPA **3.33**, and **A- in Statistics
and Probability, TTTT1713, session 2025/2026 Semester 3**. The user confirmed this
was a retake. A bilingual expandable learning-log card records those facts;
the existing degree, UKM and August 2027 expected graduation remain unchanged.
The report/image are not copied into the public website. No other coursework
or academic achievements were inferred.

The downloadable CV retains its two-page design and includes CGPA 3.33/4.00.
Statistics retake details live in the portfolio disclosure rather than expanding
the CV. Both CV pages were rendered and visually reviewed after regeneration.

## Performance and lifecycle

`worldCapability.js` selects the existing static fallback for reduced/paused
motion, Subtle, light theme, data-saving and constrained hardware hints. Unknown
hardware remains eligible. The policy is checked before and after importing
Three.js. Disposed canvas context listeners are removed locally. The static
fallback is revealed immediately on policy changes, avoiding an empty scene.
Compact fallback pages stop the world loop when no actual consumer needs it.
Speech updates no longer invalidate guide layout on every word.
One document-flow ResizeObserver refreshes scroll geometry after project filters,
native disclosures, fonts or localization change section heights, and informs
the existing guide controller of those layout changes.

Existing hidden-tab handling, DPR caps (1 mobile/1.35 desktop), WebGL render caps
and resource disposal remain. No 60fps, WCAG AA or Lighthouse90+ claim is made;
physical-device profiling and a full contrast audit remain later work.

## Executed checks

- `npm run build`: passed. Initial JS498.04kB /166.51kB gzip; CSS138.82kB /
  27.40kB gzip. The existing deferred Three.js736.44kB warning remains.
- `npm test`: **7/7 passed**. Portal source/viewport coverage, invalid geometry,
  header/reading boundaries, constrained-device policy, existing footer guard,
  and real project/media preservation. No lint script is configured.
- Real English portal travel/reveal captured; exactly one portal, cursor and
  header, with clean handoff and scroll-lock release. Arabic rapid double-click
  produced one locked portal and a stable42px gold cursor. Resize cancellation
  and browser Back released overlays/body/root locks.
- Both languages at1920,1440,1024,768,390px: one header, five projects/five
  illustrations, CV control, correct language/direction, no horizontal overflow.
- English/Arabic academic disclosure opened; verified CGPA and retake data.
  Mobile Arabic disclosure and header navigation were exercised.
- All five project dialogs opened and closed with Escape in Arabic390px; focus
  entered Close and each dialog stayed within the viewport. Existing media kept.
- Desktop project scroll sampling: featured opacity progressed0.4822→1 with
  scale0.9783→1, then remained at rest. Actual grid rows were1/2/2 with equal
  widths within paired rows.
- Arabic Web filter → All work: retained visible Web cards settled at opacity1
  in their new first row, then all five projects returned without overflow or
  stale invisible rows. Layout refresh also covers expanded academic results.
- Guide at stripTop420 ended approximately29px above it; when stripTop280/180/80
  left too little space the guardian hid rather than crossing the header.
  It returned to the rail after the strip passed. Rotation accounts for the
  small difference from the32px mathematical gap.
- Subtle before/after refresh: no WebGL canvas, fully visible fallback and
  static section scenes. Returning to Balanced restored exactly one canvas.
- Reduced-motion Arabic: all section scenes/project panels had opacity1 and
  transform none; no WebGL canvas or remaining Welcome lock.
- No error-level page console logs captured during the tested flows. Saved
  screenshots were inspected. Hidden-tab behavior has code cleanup but was
  not verified with a physical inactive-tab test.

## Main implementation map

- Portal: `WelcomeExperience.jsx`, `CinematicTransition.jsx`,
  `portalGeometry.js`, `portal-transition.css`.
- Scroll: `SectionIntro.jsx`, `section-story.css`, `useProjectEntrance.js`,
  `scroll-showcase.css`, `StoryTypography.jsx`, `useMotion.js`, `typography.css`.
- Guide/world: `index.html`, `guideBoundary.js`, `worldCapability.js`,
  `refinement.css`.
- Education: `EducationSnapshot.jsx`, `academicProfile.js`, `education.css`.
- Integration/CV: `App.jsx`, `main.jsx`, `tools/build_cv.py`, and the matching
  `public/` and `output/pdf/` CV PDFs.
- Tests: `guideSafety.test.mjs`, `portalGeometry.test.mjs` and existing tests.

## Later priorities

1. Consolidate the visible avatar and dialogue into one React-owned component.
2. Project routes/shared transitions and a true lightbox, keeping current modal
   behavior and honest verified content.
3. Contact-form delivery and validation once its service is chosen.
4. Physical-device performance, contrast and bilingual SEO/prerendering.

No extra assets were needed for this pass. A dedicated Education pose and
approved MyCohort screenshots would improve later phases.
