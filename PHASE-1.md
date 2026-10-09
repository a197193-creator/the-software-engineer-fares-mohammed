# Phase 1 — bilingual welcome and lightweight motion

The current revision replaces the low-resolution video with a coded greeting, strengthens language selection, enlarges live text and adds a restrained sand cursor. It preserves all four projects and existing sections. Phase 2 scroll-controlled avatar storytelling and new cross-section character interactions remain deferred.

## Entry behavior

`choose → transition → leaving → portfolio`

The welcome appears on every page opening and refresh, including when a language preference already exists. Storage remembers language only; it never skips the welcome. The footer can also reopen the experience. Storage failures are caught and do not block entry.

Both the sphere and card button choose their language. Neutral initial focus avoids favoring one choice. Hover and keyboard focus highlight the relevant card and sphere without dimming other text. A synchronous lock prevents duplicate selection.

The programmed transition mounts only after selection. It uses thin rotating geometry, six stars, a letter seal, large bilingual greeting text and a decorative light trace. English uses cyan; Arabic uses gold. Native CSS completes the sequence after 4.2 seconds, and an independent bounded timer shares the guarded exit in case animation events are unavailable. The overlay then fades for 680 milliseconds while the hero appears. Skip and Escape work throughout. Reduced motion replaces the animated sequence with a 2.2-second static greeting and immediate dismissal.

The portfolio remains inert while covered; the welcome traps keyboard focus. After it closes, normal scrolling resumes and focus moves to the hero. The header can switch language inside the portfolio without restarting the transition. Timers, observers, event listeners, animation frames and GSAP contexts clean up correctly.

## Animation ownership

| Element                              | Motion and owner                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| Selection image                      | Tiny desktop container breathing, with anchored sphere buttons                              |
| Sphere inner layers                  | Breathing/floating halo and focus ring                                                      |
| Sphere button / selection card / CTA | Separate hover, press, focus and selection feedback                                         |
| Programmed entrance                  | CSS owns individual orbit, seal, text and trace nodes; no overlapping transform controllers |
| Hero entrance                        | Scoped GSAP timeline on headings and CTA wrappers                                           |
| Hero buttons and background light    | CSS on inner buttons and visible ambient layer                                              |
| Sand cursor                          | One ring position plus twelve bounded grains; only runs while moving/fading                 |
| Existing project cards and sections  | Existing tilt/reveals retained, with separate CSS scale and readable typography             |

Body copy is generally 17 pixels; language descriptions use 16 pixels. Small screen language cards use concise descriptions at the same readable size. Original full descriptions remain on larger displays. Labels, controls, guide text and project details are larger and have stronger contrast.

## Verification and limits

The production build succeeds without new dependencies. Browser checks cover Arabic/English entry and hero content, refresh replay with saved language, skipping and Escape, keyboard focus, reduced-motion static entry, phone/tablet/desktop layout, cursor feedback and project dialog/filter regression. The deployed page never mounts or fetches the former video. The cursor remains transparent to pointer input, preserves the native cursor and is hidden on small screens/touch/reduced motion.

The current projects remain MyCohort, DiaCare, TMC Research & Publications and UWC Appointment System. Filter counts are All 4, Mobile 2, Web 2 and AI 1. No reconstructed mesh or advanced scroll avatar timeline is added. Real-device Safari/Firefox testing and a formal performance/accessibility audit remain in `NEXT-STEPS.md`.
