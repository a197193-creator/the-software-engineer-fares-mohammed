# Phase 1 — bilingual welcome and lightweight motion

Completed scope: cinematic welcome, English/cyan and Arabic/gold selection, the owner's video transition, professional bilingual hero, responsive typography, micro-interactions and integration with existing sections. Phase 2 scroll-controlled avatar storytelling and new avatar interactions remain deferred until explicit approval.

## Entry flow

`choose → transition → leaving → portfolio`

Each sphere and its corresponding language button use the same selection handler. A synchronous lock prevents duplicate selection. The language is saved before playback; document language, RTL direction and visible translations update together. The underlying portfolio is hidden and inert during selection. Keyboard focus stays inside the welcome dialog, and moves to the hero after dismissal.

The provided ten-second clip plays once, muted and inline, after a direct user gesture. Its selected-language overlay peaks around the energy burst and darkens near the ending. Completion, Skip intro, Escape, playback rejection and video error all reach the same guarded exit. An 18-second watchdog also prevents stalled loading from trapping visitors. Reduced motion and the existing Pause motion control bypass playback and continuous effects. All timers, media playback, observers and GSAP contexts clean up on unmount.

Returning visitors skip the welcome and use their saved language. The header changes language immediately without replaying the clip. The footer can reopen the complete welcome. Storage errors are caught; the current session still works.

## Animation ownership

| Element | Motion and owner |
| --- | --- |
| Guardian image and aligned sphere hotspots | Very small container scale, desktop only; CSS |
| Sphere inner effects | Staggered breathing scale, opacity and four-pixel float; CSS |
| Sphere button | Hover/focus scale and one selection pulse on its nested child; CSS |
| Language cards and buttons | Tiny card hover, button hover/press and selected-language contrast; CSS |
| Ambient particles | Four small opacity/translate loops, two on mobile; paused during video |
| Video transition | Actual media playback, opacity crossfade and timed color/ending layers |
| Hero heading, secondary heading, paragraph and CTA wrappers | One scoped GSAP entrance timeline |
| Hero buttons and icons | Inner hover/press scaling, independent of GSAP entrance wrappers |
| Hero background light | Slow opacity/scale breathing, only when ready and visible; disabled on mobile |
| Existing project cards and artwork | Independent CSS scale/elevation and symbol zoom; existing pointer tilt retained |
| Existing sections | Existing one-time GSAP content reveals and section-pose effects retained |

No new animation library, renderer, rig, skeletal movement, cross-section character path or scroll avatar timeline was added. Personal data and the remaining four project descriptions are preserved; the owner requested removal of the incorrect budget-app project.

## Verification

- Production Vite build succeeds, with no added dependency.
- English and Arabic entry play the supplied video and reach the correct bilingual hero.
- Skip before selection, Escape and Skip during playback exit safely; the dialog traps Tab/Shift+Tab and restores normal page scrolling.
- Returning-visitor reload preserves Arabic and avoids mounting a video; header switching works without replay.
- Emulated reduced motion disables sphere loops and bypasses video entry. Blocked video requests exercise the guarded fallback; network emulation is restored afterward.
- Chromium viewport checks at 320, 375, 768, 1024 and 1440 pixels: no horizontal overflow; narrow screens can scroll the welcome to reach both 47-pixel language buttons.
- Project filters, accessible DiaCare dialog dismissal/focus restoration, six guide stops, mobile navigation and light/dark themes work after the changes.
- The final four projects are MyCohort, DiaCare, TMC Research & Publications and UWC Appointment System. Filter counts are All 4, Mobile 2, Web 2, AI 1 (DiaCare).

These checks cover the in-app Chromium browser. Real-device Safari/Firefox testing and a formal performance/accessibility audit remain in `NEXT-STEPS.md`. The source video is landscape and includes baked Arabic text; separate localized/portrait clips are optional future assets, not generated in this phase.
