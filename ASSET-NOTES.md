# Asset provenance

## Avatar poses

Generated with the built-in ImageGen tool from the character reference supplied by the owner.

Prompt: “Preserve the supplied black-and-gold avatar in six full-body poses on a transparent 3×2 sheet; consistent camera, scale and lighting; remove background, captions and logos.”

The transparent sheet was cropped into six WebP pose assets with Sharp, preserving alpha. The poses are standing with a closed laptop, looking at a laptop, typing, holding a laptop in one hand, standing with a hand in a pocket, and celebrating.

The original sheet is preserved outside the public website in the local avatar-assets folder. The portfolio references only its packaged WebP assets.

The Three.js presentation uses these transparent raster images as a 2.5D sprite scene. No true 3D character mesh, rig, or GLB conversion is bundled. The static fallback uses the same supplied character assets.

## Social preview

`public/og.png` was generated with the built-in ImageGen tool in one call, using `public/assets/avatar-0.webp` as the supplied identity reference. The source image was inspected before generation. The final opaque RGB PNG is 1734 × 907 pixels (approximately 1.91:1); it is copied into the project without resizing. Its text, composition and character identity were visually checked.

The original generated output remains at `C:\Users\User\.codex\generated_images\01a11c7b-1436-77d0-9793-7dff70249d4c\exec-907b4961-0902-4618-8b44-0186e47651dd.png` on the creation machine. The deployed site uses only the packaged copy.

Generation prompt:

> Use case: ads-marketing.
> Asset type: premium Open Graph social preview card for Fares Mohammed's software engineering portfolio.
> Primary request: Create one polished landscape card in a 1.91:1 aspect ratio, ideally 1200x630 pixels, with an opaque deep near-black #0d0e12 backdrop.
> Input image 1: identity reference and hero compositing source. Preserve the supplied character's identity, black robe with gold embroidered trim, black face covering, dark glasses, dark hair, gold straps, and laptop. Use the actual supplied avatar as the hero, recognizable and faithful to the reference.
> Composition: elegant editorial layout, typography on the left occupying about 60 percent of the card; avatar on the right, composed from head through much of the robes with a generous inset from the top. Confident, uncluttered spacing, a few extremely subtle thin grid accents. All text fully legible, completely inside generous safe margins.
> Typography: oversized geometric sans serif, precise modern typesetting. The headline may stack into two lines as FARES / MOHAMMED. Exact headline text: "FARES MOHAMMED". Smaller subtitle: "SOFTWARE ENGINEERING". Supporting line: "MOBILE · WEB · AI". Do not add any other words.
> Palette and lighting: near-black #0d0e12, warm amber #ffd27a as the principal accent, ivory headline, very subtle lavender #aaa0ff rim accent around the avatar. Restrained atmospheric glow behind the character, elegant highlights, rich fabric detail.
> Constraints: opaque background; preserve the character's identity and clothing; high-end portfolio branding; exact text spelling; clean spacing; restrained effects; no fake app screenshots; no additional characters, logos, badges, watermarks, or extraneous text.

## Other visuals

Project graphics are conceptual layouts made from CSS and Lucide icons, not screenshots of the applications. Lucide supplies the interface icons. Syne and DM Sans are loaded from Google Fonts with system font fallbacks. The existing SVG favicon remains packaged locally.
