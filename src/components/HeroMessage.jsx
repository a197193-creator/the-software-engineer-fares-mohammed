import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { useStoryMotion } from "./StoryTypography";
import { useAvatarGuide } from "./AvatarGuideContext";

export default function HeroMessage({ heroVisible }) {
  const { hero } = useLanguage();
  const { motion, ready } = useStoryMotion();
  const guide = useAvatarGuide();
  const root = useRef(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.25),
      { threshold: 0.25 },
    );
    observer.observe(root.current);
    const change = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", change);
    };
  }, []);
  const running =
    motion &&
    ready &&
    guide.available &&
    heroVisible &&
    visible &&
    pageVisible &&
    !hovered &&
    !focused;
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      if (!document.hidden)
        setIndex((current) => (current + 1) % hero.messages.length);
    }, 3200);
    return () => clearTimeout(timer);
  }, [running, index, hero.messages]);
  const current = motion ? index : 0;
  return (
    <div
      ref={root}
      className="hero-message"
      role="group"
      aria-label={hero.messageLabel}
      tabIndex={motion ? 0 : undefined}
      data-running={running}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <span className="hero-message-label">{hero.messageLabel}</span>
      <div className="hero-message-stack" aria-live="off">
        {hero.messages.map((message, position) => (
          <span
            key={message}
            className="hero-message-item"
            data-current={position === current}
            aria-hidden={position !== current}
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}
