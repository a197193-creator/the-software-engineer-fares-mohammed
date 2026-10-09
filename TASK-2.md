# TASK 2 — Animated typography

Review checkpoint: `codex/animated-typography`, based on audit commit `d17c2bb`.
The implementation is local; the production deployment has not been changed.

## Implemented behavior

- Main H1/H2 headings reveal complete words through line/word masks, with gentle upward movement, opacity and a short stagger. Highlighted words scale from 0.97 to 1.
- Existing section headlines and supporting facts are retained. Short supporting statements enter after their headings; body paragraphs remain readable without word splitting.
- Existing GSAP ScrollTrigger starts entrances at `top 88%`, once per section. Each animation owns its typography targets; the older generic reveal skips their ancestors to prevent compounded motion.
- The Hero cycles three relevant focus statements every six seconds. It runs only after the Welcome closes, while the Hero and at least 25% of the message are visible.
- Hovering or focusing the message pauses it. Touching the text pauses it until the explicit resume control is used. The pause/resume control supports keyboard input.
- `visibilitychange` stops the timer when the document is hidden. A second `document.hidden` guard protects the timer callback. Resume starts a fresh six-second interval without catching up through missed messages.
- Every phrase shares the same CSS grid cell. All phrases contribute to its intrinsic height, so changing the active phrase does not move the description or buttons.

## Localization and accessibility

- English and Arabic phrases live in the existing `heroCopy` localization object. No new experience, projects, technologies or achievements were added.
- Arabic words, diacritics and punctuation stay together. No character-level splitting is used; existing RTL direction and Arabic fonts are preserved.
- H1/H2 elements retain their semantic level, IDs and complete accessible names. Visual word wrappers are hidden from assistive technology so each heading is read as one phrase.
- Inactive Hero phrases are hidden from assistive technology. Automatic changes are not live-announced; the control has localized accessible names.
- Reduced motion and the existing site motion switch produce static, visible text and the first Hero phrase. No timer runs and no pause control is needed in this mode.
- Resting text is visible in CSS; animation cleanup restores it. The cinematic Hero heading stays readable against its dark image in either existing theme.
- Existing metadata, links, skip navigation and project dialog semantics are retained.

## Changed files

| File                                 | Purpose                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| `src/components/StoryTypography.jsx` | Main typography context, reusable headings/statements and scoped GSAP cleanup. |
| `src/components/HeroMessage.jsx`     | Visibility-aware, pausable six-second focus message cycle.                     |
| `src/typography.css`                 | Word/line masks, intrinsic message space, controls and static fallbacks.       |
| `src/App.jsx`                        | Main context and section heading/support integration.                          |
| `src/components/PortfolioHero.jsx`   | Hero typography/message integration; removes duplicate heading tweens.         |
| `src/components/Projects.jsx`        | Section heading/support integration only.                                      |
| `src/hooks/useMotion.js`             | Avoids animating typography ancestors a second time.                           |
| `src/locales.js`                     | Three professional focus statements and controls in both languages.            |
| `src/main.jsx`                       | Imports the scoped typography stylesheet.                                      |

No Welcome, transition, avatar, cursor, background, project-card layout, project data, dependency, asset or metadata files were changed. TASK 1's background work is outside this checkpoint.

## Verification

- Production build: `npm run build` passed; no dependencies were added.
- `git diff --check` passed. A scoped diff confirmed that protected assets/components, project data and metadata are unchanged.
- Chromium browser checks covered English/Arabic at desktop width 1280px and narrow widths 375px and 320px, with no horizontal content overflow.
- Staggered opacity, upward movement and highlighted scaling were observed during entrance; Arabic headings retained complete words and became fully visible after scrolling.
- A timed Hero cycle kept its height and CTA position identical before/after the change. At the narrowest Arabic width, the grid reserves the extra line required by the longest phrase.
- Focus pause, pointer hover pause, explicit pause for more than six seconds, keyboard resume and resumed rotation passed.
- The Hero phrase stayed unchanged for more than six seconds while the visitor was in Projects.
- Reduced-motion emulation showed all headings at opacity 1 with no transforms, a static first message, and no timer/control. Temporary emulation settings were restored afterward.
- Welcome language selection/transition, navigation, project filtering and the DiaCare details dialog continued to work.
- Browser warning/error logs were empty during final checks. React effects, stable context values, observer/timer/listener disposal, semantic headings and keyboard controls were reviewed.

The inactive-tab guard was reviewed in code; the in-app test browser keeps documents visible, so a real background-tab switch was not reproduced there. Safari and physical-device testing have not been performed. No universal frame-rate or SEO score is claimed.

## Review

Open `http://127.0.0.1:5173/` while the local development server is running. Review both languages, scroll through the section headings, then test the Hero pause/resume control. The saved preview is `.qa/task2-hero-final.png`.

Stop at TASK 2 for approval. Publishing and later animation tasks are separate next steps.
