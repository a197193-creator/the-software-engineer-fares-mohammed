# Asset provenance

## Avatar poses

Generated with the built-in ImageGen tool from the character reference supplied by the owner.

Prompt: “Preserve the supplied black-and-gold avatar in six full-body poses on a transparent 3×2 sheet; consistent camera, scale and lighting; remove background, captions and logos.”

The transparent sheet was cropped into six WebP pose assets with Sharp, preserving alpha. The poses are standing with a closed laptop, looking at a laptop, typing, holding a laptop in one hand, standing with a hand in a pocket, and celebrating.

The original sheet is preserved outside the public website in the local avatar-assets folder. The portfolio references only its packaged WebP assets.

The previous Three.js presentation used these transparent raster images as a 2.5D sprite scene. The current section figures retain them as image-failure fallbacks. No true 3D character mesh, rig, or GLB conversion is bundled.

## Cinematic revision — October 2026

Generated with the **built-in ImageGen tool**, using the owner's cinematic design board as the visual identity reference. The final website assets are `public/assets/cinematic-hero.webp` and `public/assets/cinematic-0.webp` through `cinematic-5.webp`.

The hero source is 1672 × 941 pixels. The six-pose source is a 1536 × 1024 transparent atlas. Its actual alpha was verified; the dark backdrop visible in the generation preview is not baked into the character cutouts. Sharp cropped the equal cells, excluded the narrow row boundary, trimmed transparent margins and normalized each pose into a 600 × 850 transparent canvas without stretching. WebP exports preserve alpha. The hero is about 93 KB and individual poses are about 70–76 KB.

Original ImageGen outputs remain untouched at:

- `C:\Users\User\.codex\generated_images\01a11c42-0ddb-7b80-91d8-d173d78763d3\exec-46d24a74-5c0f-477a-95f9-64a37ada9a30.png` — hero.
- `C:\Users\User\.codex\generated_images\01a11c42-0ddb-7b80-91d8-d173d78763d3\exec-27ed1d1e-929d-4f07-af31-14887b5c9ebb.png` — pose atlas.

Hero generation specification:

> Use case: ads-marketing. Asset type: photographic artwork for a cinematic software engineer portfolio hero. Use the attached design board only as a character, lighting and atmosphere reference. Generate a wide 16:9 image with no interface, labels, logos, text or bubbles. Place the realistic black-and-gold Arabian engineer around 64% of the width, with the head near the top and a closed unbranded dark laptop held at the waist. Preserve the black headwrap with fine gold embroidery, face covering, dark sunglasses and tactile black robes. Leave the left 38% nearly black for live HTML copy and the far-right 17% dark for a live speech bubble. Use softly blurred carved Arabian arches and restrained warm candle bokeh, cinematic gold rim light and natural fabric texture. Fade the top and bottom toward black. No cyberpunk, neon, additional characters or watermark.

Pose atlas generation specification:

> Use case: stylized-concept. Asset type: one production sprite atlas for the same portfolio character. Use the attached design board as the identity and style reference. Produce a consistent realistic black-and-gold Arabian engineer across a three-column, two-row sheet of equal cells, with a genuinely transparent background. Keep the same headwrap, fine gold embroidery, black face covering, dark sunglasses, proportions, camera and studio lighting. Each pose is full-body with margin, the same head/foot baseline and no clipping. Top row: standing with a closed laptop; thoughtful with one hand near the chin; working at an open laptop and looking toward it. Bottom row: confident with arms crossed; composed three-quarter side view looking forward; relaxed standing with an open laptop. Keep laptop branding and readable code absent. No labels, text, floor, environment, extra characters or watermark. Preserve clean silhouette edges for splitting into separate web assets.

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

Project graphics are conceptual layouts made from CSS and Lucide icons, not screenshots of the applications. Lucide supplies the interface icons. Cormorant Garamond and DM Sans are loaded from Google Fonts with Georgia and system font fallbacks. The SVG favicon is a code-native gold F monogram.

## Phase 1 bilingual welcome — October 9, 2026

The owner supplied `C:\Users\User\Desktop\WhatsApp Image 2026-10-09 at 10.55.51 AM.jpeg` and `C:\Users\User\Desktop\animation after choose language.mp4`. No new character image or model was generated for this phase. At the owner's request, the transition video was subsequently replaced by code, and the packaged MP4/poster were removed. The original desktop source files are untouched. The following video notes document the earlier revision.

- `welcome-guardian.webp`: same 1280 × 647 image, exported as WebP at quality 90 (96,150 bytes). Cyan-left and gold-right sphere buttons use normalized image coordinates and share its aspect-ratio container.
- `welcome-transition.mp4`: original H.264 video stream, 848 × 478, 24 fps, approximately ten seconds (1,673,322 bytes). FFmpeg remuxed it with fast-start metadata and removed the audio track; visual frames were not altered. Playback is also muted and inline.
- `welcome-video-poster.webp`: the provided video's actual opening frame (25,586 bytes), used as a loading poster.

The earlier clip showed gold on the left and cyan on the right, unlike the static image, and included baked Arabic text. It was not mirrored. The current programmed entrance localizes all its text and uses no video. Noto Naskh Arabic and Noto Sans Arabic provide suitable Arabic display and body typography, with local font fallbacks.

## Current programmed entrance

`CinematicTransition.jsx` and `intro.css` render the new entrance from CSS circles, axes, six small stars, an F seal and live bilingual HTML text. No raster video, external animation service, new model or additional library is used. The selection image remains the owner's WebP guardian. The cursor uses one ring and a fixed pool of twelve tiny grains, with a requestAnimationFrame loop that ends when its position and particle fades settle. It is hidden on small screens, touch pointers and reduced motion. `readability.css` increases normal body text to 17 pixels and welcome descriptions to 16 pixels, with larger controls and stronger contrast.
