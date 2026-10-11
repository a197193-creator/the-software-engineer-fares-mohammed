import { useLanguage } from "../LanguageContext";
import { useEffect, useRef, useState } from "react";
import AvatarGuide from "./AvatarGuide";
import { avatarScenes } from "../avatarPoseRegistry";
export { avatarScenes } from "../avatarPoseRegistry";

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
      className={`section-avatar avatar-${section} ${compact ? "compact" : ""} ${visible ? "in-view" : ""} ${imageHidden ? "image-hidden" : ""}`}
      data-avatar-paused={paused || !motion}
      onPointerOver={(event) => {
        if (event.pointerType === "mouse")
          setPaused(
            !!event.target.closest(".avatar-speech, .avatar-guide-collapsed"),
          );
      }}
      onPointerLeave={() => setPaused(false)}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") setPaused((value) => !value);
      }}
    >
      {!imageHidden && (
        <div
          className="character-frame"
          data-avatar-slot={section}
          aria-hidden="true"
        >
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
