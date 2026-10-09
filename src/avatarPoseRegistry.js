// Verified local WebP cutouts: all cinematic poses share a transparent 600 × 850 canvas.
// The Hero uses its existing environment artwork; this cutout is its failure fallback.
export const avatarScenes = {
  home: {
    image: "/assets/cinematic-0.webp",
    fallback: "/assets/avatar-0.webp",
    pose: "closed-laptop",
    intent: "welcoming",
    number: "01",
    name: "Home",
    quote: "I build ideas into reality.",
    dock: { x: 0, tilt: 0 },
  },
  about: {
    image: "/assets/cinematic-1.webp",
    fallback: "/assets/avatar-4.webp",
    pose: "thinking",
    intent: "explaining",
    number: "02",
    name: "About Me",
    quote: "Curiosity is where improvement begins.",
    dock: { x: -36, tilt: -0.25 },
  },
  skills: {
    image: "/assets/cinematic-3.webp",
    fallback: "/assets/avatar-4.webp",
    pose: "arms-crossed",
    intent: "explaining",
    number: "03",
    name: "Skills",
    quote: "Still learning. Always building.",
    dock: { x: -28, tilt: 0.2 },
  },
  projects: {
    image: "/assets/cinematic-2.webp",
    fallback: "/assets/avatar-2.webp",
    pose: "working-laptop",
    intent: "presenting",
    number: "04",
    name: "Projects",
    quote: "Every project starts with a problem worth solving.",
    dock: { x: 0, tilt: -0.2 },
  },
  experience: {
    image: "/assets/cinematic-4.webp",
    fallback: "/assets/avatar-3.webp",
    pose: "looking-forward",
    intent: "reflecting",
    number: "05",
    name: "Experience",
    quote: "Experience turns knowledge into confidence.",
    dock: { x: -32, tilt: 0.25 },
  },
  contact: {
    image: "/assets/cinematic-5.webp",
    fallback: "/assets/avatar-2.webp",
    pose: "open-laptop",
    intent: "connecting",
    number: "06",
    name: "Contact",
    quote: "Let’s build something meaningful.",
    dock: { x: -32, tilt: 0 },
  },
};

// A bounded, visit-wide decode cache prevents loading flashes and duplicate preloads.
const decoded = new Map();
function decodeImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = async () => {
      try {
        await image.decode();
      } catch {
        /* Loaded images remain usable. */
      }
      resolve(src);
    };
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

export function loadAvatarPose(section) {
  if (!decoded.has(section)) {
    const scene = avatarScenes[section] || avatarScenes.home;
    decoded.set(
      section,
      (async () =>
        (await decodeImage(scene.image)) ||
        (await decodeImage(scene.fallback)))(),
    );
  }
  return decoded.get(section);
}
