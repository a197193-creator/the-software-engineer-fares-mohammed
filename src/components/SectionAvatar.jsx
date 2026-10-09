import { useLanguage } from "../LanguageContext";
import { useEffect, useRef, useState } from "react";
import AvatarGuide from "./AvatarGuide";

export const avatarScenes = {
  home: {
    image: "/assets/cinematic-0.webp",
    fallback: "/assets/avatar-0.webp",
    quote: "I build ideas into reality.",
    name: "Home",
    number: "01",
  },
  about: {
    image: "/assets/cinematic-1.webp",
    fallback: "/assets/avatar-4.webp",
    quote: "Curiosity is where improvement begins.",
    name: "About Me",
    number: "02",
  },
  skills: {
    image: "/assets/cinematic-3.webp",
    fallback: "/assets/avatar-4.webp",
    quote: "Still learning. Always building.",
    name: "Skills",
    number: "03",
  },
  projects: {
    image: "/assets/cinematic-2.webp",
    fallback: "/assets/avatar-2.webp",
    quote: "Every project starts with a problem worth solving.",
    name: "Projects",
    number: "04",
  },
  experience: {
    image: "/assets/cinematic-4.webp",
    fallback: "/assets/avatar-3.webp",
    quote: "Experience turns knowledge into confidence.",
    name: "Experience",
    number: "05",
  },
  contact: {
    image: "/assets/cinematic-5.webp",
    fallback: "/assets/avatar-2.webp",
    quote: "Let’s build something meaningful.",
    name: "Contact",
    number: "06",
  },
};

/** Each pose belongs to its section; CSS motion can never carry it over content. */
export default function SectionAvatar({
  section,
  motion = true,
  compact = false,
  imageHidden = false,
}) {
  const { tr } = useLanguage();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const scene = avatarScenes[section];
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <figure
      ref={ref}
      className={`section-avatar avatar-${section} ${compact ? "compact" : ""} ${visible ? "in-view" : ""} ${motion && visible && !paused ? "idle-enabled" : ""} ${imageHidden ? "image-hidden" : ""}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") setPaused((value) => !value);
      }}
    >
      {!imageHidden && (
        <div className="character-frame" aria-hidden="true">
          <div className="character-halo" />
          <img
            className="character-image"
            src={scene.image}
            alt=""
            width="600"
            height="850"
            loading={section === "home" ? "eager" : "lazy"}
            onError={(event) => {
              if (!event.currentTarget.src.endsWith(scene.fallback))
                event.currentTarget.src = scene.fallback;
            }}
          />
        </div>
      )}
      <AvatarGuide section={section} scene={scene}>
        <figcaption className="avatar-speech">
          <span className="speech-mark" aria-hidden="true">
            “
          </span>
          <p>{tr(scene.quote)}</p>
          <span className="speech-signature">
            FARES / {tr(scene.name).toUpperCase()}
          </span>
        </figcaption>
      </AvatarGuide>
    </figure>
  );
}

export function ChapterRail({ goTo, active }) {
  const { tr } = useLanguage();
  return (
    <nav
      className="chapter-rail"
      aria-label={tr("Explore the portfolio chapters")}
    >
      {Object.entries(avatarScenes).map(([id, scene]) => (
        <button
          className={`chapter-card ${active === id ? "current" : ""}`}
          key={id}
          onClick={() => goTo(id)}
          aria-label={`${tr("Explore")} ${tr(scene.name)}`}
        >
          <span className="chapter-label">
            <b>{scene.number}.</b> {tr(scene.name)}
          </span>
          <span className="chapter-picture">
            <img
              src={scene.image}
              alt=""
              width="180"
              height="240"
              loading="lazy"
              onError={(event) => {
                if (!event.currentTarget.src.endsWith(scene.fallback))
                  event.currentTarget.src = scene.fallback;
              }}
            />
            <span className="chapter-quote">
              <i aria-hidden="true">“</i>
              {tr(scene.quote)}
            </span>
          </span>
          <span className="chapter-link">
            {tr("Explore chapter")}
            <span>↗</span>
          </span>
        </button>
      ))}
    </nav>
  );
}
