import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useStoryMotion } from "./StoryTypography";

export default function HeroMessage({ heroVisible }) {
  const { hero } = useLanguage();
  const { motion, ready } = useStoryMotion();
  const root = useRef(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [paused, setPaused] = useState(false);
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
    heroVisible &&
    visible &&
    pageVisible &&
    !paused &&
    !hovered &&
    !focused;
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      if (!document.hidden)
        setIndex((current) => (current + 1) % hero.messages.length);
    }, 6000);
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
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse" && !event.target.closest("button"))
          setPaused(true);
      }}
      onFocusCapture={(event) => setFocused(!event.target.closest("button"))}
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
      {motion && (
        <button
          className="hero-message-toggle"
          type="button"
          aria-label={paused ? hero.messageResume : hero.messagePause}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      )}
    </div>
  );
}
