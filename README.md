# Fares Mohammed — Software Engineering Portfolio

A responsive portfolio for a Software Engineering student at Universiti Kebangsaan Malaysia, built with React and Vite. The presentation uses ink (`#0d0e12`), amber (`#ffd27a`) and lavender (`#aaa0ff`), with Syne headings and DM Sans body text.

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

The production output is `dist/`. The portfolio is a static site with no required environment variables or server-side services.

## Customize

- `src/App.jsx`: page structure, navigation, theme, motion controls and guide.
- `src/data.js`: verified profile links, five project records and tour copy.
- `src/design.css`: color tokens, typography, navigation and primary page layout.
- `src/details.css`: project cards, dialogs, guide and supporting interface styles.
- `src/responsive.css`: responsive layout and reduced-motion overrides.
- `src/components/Projects.jsx`: project filters, conceptual artwork and accessible native detail dialogs.
- `src/components/AvatarStage.jsx` and `AvatarScene.js`: progressively enhanced Three.js character scene and static fallbacks.
- `index.html`: title, search description, Google Fonts and Open Graph/Twitter metadata. Update the canonical, page and image URLs together when changing domains.

Email, LinkedIn, WhatsApp and CV remain unset because the owner deferred supplying them. These controls appear only when their verified values are added to `profile`. Place a supplied CV in `public/` and set `profile.cv` to its root-relative path. The public GitHub profile is already connected.

Project repository links, demos and screenshots remain unset until real materials are available. Add them to the corresponding project record; existing conditional UI will display them. The illustrated project panels are conceptual graphic identities, not application screenshots. Preserve the supplied project descriptions and avoid adding unverified outcomes or metrics.

## Character and motion

The supplied black-and-gold avatar is presented with six transparent raster poses. On suitable desktop devices, Three.js adds a **2.5D sprite scene** with depth, lighting effects and section-aware movement. No true 3D character mesh or rigged GLB is bundled. The scene accepts a future `modelUrl`, but a real model must be supplied before that path is used.

Mobile, reduced-motion preferences, paused motion, limited devices and renderer failures use the static character fallback. The scene is loaded progressively; portfolio content remains usable without it. GSAP and Lenis support the enhanced desktop presentation, with motion controls available to visitors.

## Publish and verify

For the existing Vercel project, use the Vite preset, build command `npm run build`, output `dist`, and Node.js 24. The configured public URL is `https://the-software-engineer-fares-mohammed.vercel.app/`.

Before publishing, run the production build and check desktop/mobile navigation, all four project filters, dialog keyboard focus and Escape dismissal, guide controls, theme, and reduced-motion behavior. Check `/og.png` and the social metadata on the deployed domain after publishing.

Avatar images are in `public/assets/`; the social preview is `public/og.png`. See `ASSET-NOTES.md` for provenance. Scratch conversion files in `tmp/` are excluded from version control.
