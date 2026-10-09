import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, SkipForward } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { welcomeCopy } from "../locales";

// Phase 1 media only. Future language-specific clips can be configured here.
export const welcomeAssets = {
  image: "/assets/welcome-guardian.webp",
  poster: "/assets/welcome-video-poster.webp",
  videos: {
    en: "/assets/welcome-transition.mp4",
    ar: "/assets/welcome-transition.mp4",
  },
  energyPeak: 2.5,
};
function InteractiveSphere({
  language,
  disabled,
  selected,
  onChoose,
  onHighlight,
}) {
  return (
    <button
      className={`interactive-sphere sphere-${language} ${selected ? "selected" : ""}`}
      type="button"
      disabled={disabled}
      onClick={() => onChoose(language)}
      onPointerEnter={() => onHighlight(language)}
      onPointerLeave={() => onHighlight(null)}
      onFocus={() => onHighlight(language)}
      onBlur={() => onHighlight(null)}
      aria-label={welcomeCopy[language].button}
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <span className="sphere-breath" aria-hidden="true">
        <span className="sphere-ring" />
      </span>
      <span className="sphere-tag">
        {language === "en" ? "ENGLISH" : "العربية"}
      </span>
    </button>
  );
}
function LanguageChoice({ language, disabled, onChoose, onHighlight }) {
  const text = welcomeCopy[language];
  return (
    <section
      className={`language-choice choice-${language}`}
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
      onPointerEnter={() => onHighlight(language)}
      onPointerLeave={() => onHighlight(null)}
    >
      <span className="language-label">{text.label}</span>
      <h2>{text.heading}</h2>
      <p>{text.description}</p>
      <button
        className="language-cta"
        type="button"
        disabled={disabled}
        onClick={() => onChoose(language)}
        onFocus={() => onHighlight(language)}
        onBlur={() => onHighlight(null)}
      >
        {text.button}
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </section>
  );
}
export default function WelcomeExperience({ motion, onReveal, onComplete }) {
  const { language, setLanguage, welcome } = useLanguage();
  const [phase, setPhase] = useState("choose");
  const [highlight, setHighlight] = useState(null);
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const root = useRef(null),
    video = useRef(null),
    lock = useRef(false),
    finished = useRef(false),
    callbacks = useRef({ onReveal, onComplete }),
    selectedRef = useRef(language),
    timer = useRef(null),
    exitTimer = useRef(null);
  callbacks.current = { onReveal, onComplete };
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    lock.current = true;
    clearTimeout(timer.current);
    video.current?.pause();
    setLanguage(selectedRef.current);
    setPhase("leaving");
    callbacks.current.onReveal();
    exitTimer.current = setTimeout(
      () => callbacks.current.onComplete(),
      motion ? 680 : 0,
    );
  }, [motion, setLanguage]);
  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current
      ?.querySelector(".language-cta")
      ?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = before;
      clearTimeout(timer.current);
      clearTimeout(exitTimer.current);
      video.current?.pause();
    };
  }, []);
  useEffect(() => {
    if (!motion && phase === "transition") finish();
  }, [motion, phase, finish]);
  function choose(value) {
    if (lock.current) return;
    lock.current = true;
    selectedRef.current = value;
    setLanguage(value);
    setSelected(value);
    setHighlight(value);
    if (!motion) {
      finish();
      return;
    }
    setPhase("transition");
    root.current.scrollTop = 0;
    root.current.querySelector(".intro-skip")?.focus({ preventScroll: true });
    timer.current = setTimeout(finish, 18000);
    const player = video.current;
    if (!player) {
      finish();
      return;
    }
    const source = welcomeAssets.videos[value];
    if (player.getAttribute("src") !== source) {
      player.src = source;
      player.load();
    }
    player.muted = true;
    try {
      player.play()?.catch(finish);
    } catch {
      finish();
    }
  }
  function updateEnergy() {
    const player = video.current;
    if (!player || !root.current) return;
    const pulse = Math.max(
      0,
      1 - Math.abs(player.currentTime - welcomeAssets.energyPeak) / 0.9,
    );
    const ending = Number.isFinite(player.duration)
      ? Math.max(
          0,
          Math.min(1, (player.currentTime - (player.duration - 0.9)) / 0.9),
        )
      : 0;
    root.current.style.setProperty("--energy", String(pulse * 0.18));
    root.current.style.setProperty("--ending", String(ending));
  }
  function keyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      finish();
    }
    if (event.key !== "Tab") return;
    const items = [...root.current.querySelectorAll("button:not(:disabled)")];
    if (event.shiftKey && document.activeElement === items[0]) {
      event.preventDefault();
      items.at(-1)?.focus();
    } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
      event.preventDefault();
      items[0]?.focus();
    }
  }
  return (
    <div
      ref={root}
      className={`welcome-experience phase-${phase} ${playing ? "video-playing" : ""}`}
      data-highlight={highlight || "none"}
      data-selected={selected || "none"}
      dir="ltr"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      onKeyDown={keyDown}
    >
      <h1 id="welcome-title" className="sr-only">
        Fares Mohammed — Choose your language / اختر لغتك
      </h1>
      <header className="welcome-header">
        <div className="welcome-brand">
          <span>F</span>
          <div>
            <strong>FARES MOHAMMED</strong>
            <small>SOFTWARE ENGINEERING PORTFOLIO</small>
          </div>
        </div>
        <button className="intro-skip" onClick={finish} type="button">
          <span lang={language}>
            {phase === "choose" ? "Skip intro / تخطّي المقدّمة" : welcome.skip}
          </span>
          <SkipForward size={15} />
        </button>
      </header>
      <div className="welcome-scene">
        <div className="welcome-depth">
          <img
            className="welcome-image"
            src={welcomeAssets.image}
            width="1280"
            height="647"
            alt=""
            fetchPriority="high"
          />
          <div className="welcome-image-shade" />
          <InteractiveSphere
            language="en"
            disabled={phase !== "choose"}
            selected={selected === "en"}
            onChoose={choose}
            onHighlight={setHighlight}
          />
          <InteractiveSphere
            language="ar"
            disabled={phase !== "choose"}
            selected={selected === "ar"}
            onChoose={choose}
            onHighlight={setHighlight}
          />
        </div>
      </div>
      <div className="welcome-ambient" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="language-choices">
        <LanguageChoice
          language="en"
          disabled={phase !== "choose"}
          onChoose={choose}
          onHighlight={setHighlight}
        />
        <LanguageChoice
          language="ar"
          disabled={phase !== "choose"}
          onChoose={choose}
          onHighlight={setHighlight}
        />
      </div>
      <div className="transition-video-layer" aria-hidden="true">
        <video
          ref={video}
          src={welcomeAssets.videos.en}
          poster={welcomeAssets.poster}
          preload="metadata"
          playsInline
          muted
          onPlaying={() => setPlaying(true)}
          onTimeUpdate={updateEnergy}
          onEnded={finish}
          onError={() => {
            if (lock.current) finish();
          }}
        />
        <div className="transition-energy" />
        <div className="transition-ending" />
      </div>
      <div className="welcome-status" role="status" aria-live="polite">
        {phase === "choose" ? (
          <>
            <span lang="en">Choose your language</span>
            <i />
            <span lang="ar" dir="rtl">
              اختر لغتك
            </span>
          </>
        ) : (
          <span lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
            {welcome.entering}
          </span>
        )}
      </div>
    </div>
  );
}
