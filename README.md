# Fares Mohammed - Software Engineering Portfolio

A bilingual React/Vite portfolio for a Software Engineering student at Universiti Kebangsaan Malaysia. The presentation combines a dark cinematic environment, cyan and gold interfaces, restrained crimson lighting, the supplied masked guardian avatar and accessible project details.

Live site: https://the-software-engineer-fares-mohammed.vercel.app/

## Run

Use Node.js 22.12+ or Node.js 24 LTS.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

Production output is `dist/`. This is a static portfolio; it does not require environment variables or a backend.

## Content and files

- `src/data.js`: verified email, LinkedIn, GitHub, WhatsApp and CV links.
- `src/projectContent.js`: five project records, bilingual descriptions, contributions, review status, screenshot captions and verified destinations. Coda is excluded.
- `src/locales.js` and `src/LanguageContext.jsx`: Arabic/English copy, language preference and RTL direction.
- `src/components/Projects.jsx`: filters, project cards, native detail dialogs and screenshot galleries.
- `public/projects/`: 13 actual project screenshots from supplied evidence, converted to WebP. DIACARE screenshots use demonstration content.
- `public/Fares-Mohamed-Elnagar-CV.pdf`: downloadable two-page CV.
- `output/pdf/`: final CV artifact for local review.
- `tools/build_cv.py`: editable ReportLab source. Requires Python with ReportLab and Windows Segoe UI/Georgia fonts; regeneration also updates the public download.
- `src/App.jsx`: page structure, navigation, internship/education and contact sections.

The owner lives in **Kajang**; **Cheras** is the internship location. Experience is explicitly labelled **Software Engineering Intern**, with scheduled completion on 19 January 2027. Expected graduation is August 2027, based on the supplied CV.

Project content distinguishes academic work and prototypes. UWC does not claim production appointments or live payments. TMC previews retain pending review/approval status. MyCohort details stay limited to confirmed internship involvement. Historical DIACARE test evidence is dated rather than represented as a new test run.

## Character and motion

The Welcome screen appears on every fresh load and refresh. Language selection enters a coded cinematic greeting; the footer can replay it. Language preference persists without skipping Welcome.

The main portfolio uses the existing Three.js atmospheric environment, with a reduced-motion/static fallback. A single avatar controller coordinates the supplied 2D WebP poses with section-aware bilingual speech. The avatar images are not a rigged 3D character. GSAP content reveals, pointer effects and the existing Subtle/Balanced/Cinematic controls remain intact.

Avatar assets are in `public/assets/`; the social preview is `public/og.png`. See `ASSET-NOTES.md` and existing motion documentation for implementation history.

## Publish and verify

Use the existing Vercel project with build command `npm run build`, output `dist`, and Node.js 24. Verify the linked project before deploying; do not create a replacement project for routine updates.

Check Welcome, language switching, desktop/mobile navigation, project filters and dialogs, screenshot loading, keyboard dismissal, guide controls, contact destinations and the CV download. Also check Arabic RTL and reduced-motion behavior. A successful build alone does not verify browser flows.
