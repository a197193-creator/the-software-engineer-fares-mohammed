# Fares Mohammed — Software Engineering Portfolio

A responsive portfolio for a Software Engineering student at Universiti Kebangsaan Malaysia, built with React and Vite. The cinematic presentation uses near-black (`#05090b`), warm gold (`#efbc6d`), Cormorant Garamond headings and DM Sans body text. Its Arabian engineer character is based on the owner's supplied reference.

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
- `src/data.js`: verified profile links, four project records and tour copy.
- `src/LanguageContext.jsx` and `src/locales.js`: saved Arabic/English preference, RTL direction and translations.
- `src/components/WelcomeExperience.jsx` and `CinematicTransition.jsx`: language selection and a coded cinematic greeting on every page load.
- `src/intro.css`: language feedback, resolution-independent transition and sand cursor visuals.
- `src/readability.css`: larger, higher-contrast text throughout the portfolio.
- `src/components/SandCursor.jsx`: bounded desktop cursor ring and twelve fading sand grains; stops updating when idle.
- `src/components/PortfolioHero.jsx` and `src/welcome.css`: bilingual hero entrance and lightweight Phase 1 animation layers.
- `src/design.css`: color tokens, typography, navigation and primary page layout.
- `src/details.css`: project cards, dialogs, guide and supporting interface styles.
- `src/responsive.css`: responsive layout and reduced-motion overrides.
- `src/cinematic.css`: the current art direction, chapter strip, section poses, speech bubbles and responsive refinements.
- `src/components/SectionAvatar.jsx`: six section-owned character poses, quotes, visibility detection and chapter navigation.
- `src/components/Projects.jsx`: project filters, conceptual artwork and accessible native detail dialogs.
- `src/components/AvatarStage.jsx` and `AvatarScene.js`: preserved earlier Three.js implementation for possible future model work; these files are not loaded by the current presentation.
- `index.html`: title, search description, Google Fonts and Open Graph/Twitter metadata. Update the canonical, page and image URLs together when changing domains.

Email, LinkedIn, WhatsApp and CV remain unset because the owner deferred supplying them. These controls appear only when their verified values are added to `profile`. Place a supplied CV in `public/` and set `profile.cv` to its root-relative path. The public GitHub profile is already connected.

Project repository links, demos and screenshots remain unset until real materials are available. Add them to the corresponding project record; existing conditional UI will display them. The illustrated project panels are conceptual graphic identities, not application screenshots. Preserve the supplied project descriptions and avoid adding unverified outcomes or metrics.

## Character and motion

Phase 1 shows the bilingual guardian language screen on every fresh opening and refresh. It remembers the language without using that preference to skip the welcome. After selection, a four-second coded transition reveals a bilingual greeting with cyan or gold geometry and typography. The previous video and poster are removed from the public assets. The header switches language within the portfolio, and the footer's **Replay welcome / شاشة الترحيب** reopens the complete experience. Reduced motion shows a short static greeting. See `PHASE-1.md` for flow, animation ownership and verification. Advanced scroll-controlled avatar storytelling remains deferred until explicitly approved.

The hero uses an optimized cinematic image. Six consistent transparent WebP poses belong to the Home, About, Skills, Projects, Experience and Contact chapters. Each section has its own figure and readable quote; the character never travels across content. Intersection Observer fades the figure in and pauses its subtle four-second CSS breathing cycle outside the viewport. Hover pauses the pose, and touch toggles its pause state. The guide uses the corresponding pose at each stop.

Reduced-motion preferences and the guide's motion control provide static poses. Images below the fold load lazily and retain fixed layout dimensions. The previous avatar files remain as image-failure fallbacks. GSAP handles content reveals; Lenis smooth scrolling runs only on suitable desktop pointers. No Three.js renderer or character JavaScript animation loop is loaded. No real mesh, rigged GLB, articulated head movement or laptop animation is bundled.

## Publish and verify

For the existing Vercel project, use the Vite preset, build command `npm run build`, output `dist`, and Node.js 24. The configured public URL is `https://the-software-engineer-fares-mohammed.vercel.app/`.

Before publishing, run the production build and check desktop/mobile navigation, all four project filters, dialog keyboard focus and Escape dismissal, guide controls, theme, and reduced-motion behavior. Check `/og.png` and the social metadata on the deployed domain after publishing.

Avatar images are in `public/assets/`; the social preview is `public/og.png`. See `ASSET-NOTES.md` for provenance. Scratch conversion files in `tmp/` are excluded from version control.
