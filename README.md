# The Software Engineer Fares Mohammed

A personal portfolio for Fares Mohammed, a Software Engineering student at Universiti Kebangsaan Malaysia. Built with React and Vite, with a black-and-gold character companion, restrained motion and responsive layouts.

## Run locally

Requires Node.js 22.12+ or 24 LTS.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## What is included

- Home, selected projects, skills, experience, about and contact sections.
- Five project detail dialogs and Mobile / Web / AI filters.
- Six avatar poses that crossfade as the visitor moves between sections.
- An optional six-stop guided tour, section shortcuts, previous / next controls and a motion toggle.
- Native dialogs with keyboard dismissal, semantic navigation and a mobile menu.
- Reduced-motion support, page metadata and a custom favicon.

## Update the content

`src/data.js` contains the profile, project details and tour copy. Email, LinkedIn, WhatsApp and CV are intentionally unset at the owner's request. The connected public GitHub profile is available. To add contact details, replace the relevant `null` values with verified URLs. To add a CV, place the chosen PDF under `public/` and set `profile.cv` to its root-relative URL, for example `/Fares-Mohammed-CV.pdf`.

Project GitHub links, demos and screenshots are unset until real materials are supplied. The colored project panels are graphic identities, not application screenshots. The MyCohort/TMC, Coda and UWC detail text expands the project summaries supplied for this portfolio; review it when adding project-specific evidence. No outcomes or adoption metrics are invented.

The character is a raster sprite animation: gentle CSS movement and transitions between six poses. It is not a rigged 3D model. The supplied character's black-and-gold clothing, mask and glasses are preserved.

## Deploy

Use the Vercel Vite preset, `npm run build`, output directory `dist` and Node.js 24. Link the repository and its production branch to enable redeployment after content changes. This portfolio has no server-side dependencies and needs no environment variables.

## Assets

The avatar poses live in `public/assets/avatar-0.webp` through `avatar-5.webp`. See `ASSET-NOTES.md` for the generation prompt. UI icons use Lucide; typography uses DM Sans, Space Grotesk and Instrument Serif via Google Fonts, with local system fallbacks.

## Verification

Production build, mobile/desktop layouts, project filters, project dialogs, guided tour, navigation and motion controls are checked in the browser before release. No old CV or private contact details are bundled.
