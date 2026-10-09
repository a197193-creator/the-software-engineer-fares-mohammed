# TASK 3 — Section-aware avatar guide

Review branch: `codex/avatar-guide`, based on TASK 2 checkpoint `7c0bacb`.
The implementation is local. Nothing has been pushed or deployed to production.

## Experience

- The existing masked guardian, section images and fallback images are retained. The current section's quote area becomes a cyan/gold speech bubble; other section artwork stays as before.
- One guide bubble explains the section and offers previous/next navigation through Home, About, Skills, Projects, Experience and Contact.
- An IntersectionObserver watches a narrow reading band around 40–46% of the viewport. A 350 ms debounce commits a section only after it settles. Navigation targets cannot change the message before they become visible.
- The previous message fades away and its typing timer pauses while the next section settles. Only the active section can mount a live speech message.
- Complete words reveal with a short initial typing indicator and restrained pauses at punctuation. Both languages use whole words; Arabic joining, marks and punctuation are preserved.
- Clicking/tapping the message, or activating it from the keyboard, completes it immediately. Completed messages stay complete when revisiting a section in the same page session.
- Minimize, dismiss for this visit and restore controls are available. Escape minimizes a focused bubble. Explicit collapse/restore moves focus to the relevant control without scrolling or taking focus during automatic section changes.
- `sessionStorage` remembers the minimized/dismissed choice through refreshes during the visit. Storage failure falls back to React state.
- The guide stays beside the existing avatars rather than following the pointer or covering content in a fixed panel. On phones, the existing avatar areas precede long About/Experience/Contact content, so visitors reach the guide near the section introduction. The project avatar space reserves the bubble height; project cards and their layout are untouched.
- Global guide shortcuts and the existing site motion switch remain available in a normal-flow footer toolbar. The fixed guide panel has been replaced by section-local bubbles and compact restore controls.

## Accessibility and motion

- Each active bubble exposes one complete localized message in an atomic polite status. Visual typing words are hidden from assistive technology, so individual word/character updates are not live-announced.
- The bubble is modeless. It does not trap focus, intercept page scrolling or automatically focus itself when the section changes.
- Full text participates in layout from the beginning, preventing typing from changing bubble height. Buttons have readable labels, visible focus styles and touch-friendly heights.
- Reduced motion and the site's motion switch display the complete message immediately, with no typing dots or entrance animation.
- Guide messages/timers are unmounted during the Welcome transition, mobile navigation and project dialogs. The observer and all typing/debounce timers are cleaned up.
- Static WebP assets have no mouth controls wired into the portfolio. No lip sync, audio autoplay, speech synthesis, new character, 3D rig or advanced avatar movement has been introduced.

## Implementation files

| File                                    | Responsibility                                                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `src/components/AvatarGuide.jsx`        | Reusable section bubble, word presentation, navigation and accessible controls.                                               |
| `src/components/AvatarGuideContext.jsx` | Visible-section detection, debounce, visit preference and completed-message cache.                                            |
| `src/hooks/useGuideTyping.js`           | Cancellable word timing and instant completion. Its presentation lifecycle is separate from future audio/rig synchronization. |
| `src/guideDialogue.js`                  | Central English/Arabic dialogue and UI copy for the actual six sections.                                                      |
| `src/avatar-guide.css`                  | Holographic bubble, restrained transitions, responsive avatar slots and static fallbacks.                                     |
| `src/components/Guide.jsx`              | Normal-flow visit controls, project/contact shortcuts and preserved motion control.                                           |
| `src/components/SectionAvatar.jsx`      | Wraps the original caption with the guide; image sources and existing avatar motion are unchanged.                            |
| `src/LanguageContext.jsx`               | Exposes guide copy through the existing localization context.                                                                 |
| `src/App.jsx`                           | Provider integration and Welcome/menu/dialog availability guards.                                                             |
| `src/main.jsx`                          | Imports the guide stylesheet.                                                                                                 |
| `src/components/StoryTypography.jsx`    | Two-line initialization fix required by the preserved site motion control.                                                    |

## Integration fix

Testing found that resuming site motion near the footer could crash GSAP refresh while the existing heading timelines were still initializing. Each heading now refreshes its own ScrollTrigger immediately after adding its tween, before later triggers are created. The visual typography behavior is retained. This follows the initialization ordering described in the [official GSAP refresh documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/refresh/).

## Verification

- `npm run build` passed. Final bundles: JS 439.36 kB / 145.71 kB gzip; CSS 87.32 kB / 18.13 kB gzip. No dependencies were added.
- English desktop flow at 1280px reached the correct message for all six sections, with one live bubble and no horizontal overflow.
- Arabic mobile flow at 320px reached all six messages. Geometry checks found no overlap with headings, body content, skill cards, the project toolbar/cards, timeline or contact controls. English and Arabic Hero layouts were also checked at 375px.
- Arabic words progressed from 0 to 4 of 13 while the complete message remained accessible. An English message progressed to 2 of 15, then a click completed all 15 immediately.
- Minor scrolling left the current completed message intact. Section changes and language changes replaced the previous message without simultaneous live bubbles.
- Escape minimization, focus restoration, explicit reopen, completed-message reuse and dismissal persistence after reload passed.
- Reduced-motion emulation produced complete visible text, `typing=false`, no dots and no surface animation. Temporary viewport/media emulation was restored afterward.
- Resuming motion from the footer passed three times after the initialization fix, without a blank page or new console errors.
- The DiaCare dialog opened and closed as before; live guide count was zero during the dialog and one after closing.
- Welcome language selection and the existing cinematic transition continued to work; live guide count was zero during the transition.
- A scoped diff confirmed that Welcome/transition files, assets, project data/cards, Hero content, mouse effects, backgrounds, metadata and dependencies were not edited.
- Hook dependencies, context values, observer/timer cleanup, keyboard controls and semantic accessibility were reviewed. Browser logs contained no new warnings/errors after the integration fix.

QA used the in-app Chromium browser, responsive emulation and its accessibility tree. Physical devices, Safari and a real screen-reader session have not been tested. No universal frame-rate or accessibility certification is claimed.

## Review and future work

Local preview: `http://127.0.0.1:5173/` while the development server is running.
Saved previews: `.qa/task3-guide-final.png` and `.qa/task3-ar-mobile.png`.

Review TASK 3 before publishing or starting another animation task. Real voice/lip sync would require verified audio assets and a suitable facial rig; these remain future work.
