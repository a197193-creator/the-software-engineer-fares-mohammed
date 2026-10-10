import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, SkipForward } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { welcomeCopy } from "../locales";
import CinematicTransition from "./CinematicTransition";
import LandscapeScene from "./LandscapeScene";
import { usePointerSurface } from "../hooks/usePointerSurface";
import LanguageOrb from "./LanguageOrb";

export const welcomeAssets = {
  image: "/assets/welcome-guardian-orbless.webp",
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
      <LanguageOrb language={language} />
      <span className="sphere-tag">
        {language === "en" ? "ENGLISH" : "العربية"}
      </span>
    </button>
  );
}
function LanguageChoice({ language, disabled, onChoose, onHighlight, motion }) {
  const text = welcomeCopy[language];
  const surface = useRef(null);
  usePointerSurface(surface, { enabled: motion && !disabled, kind: "card" });
  return (
    <section
      ref={surface}
      className={`language-choice motion-card choice-${language}`}
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
      onPointerEnter={() => onHighlight(language)}
      onPointerLeave={() => onHighlight(null)}
    >
      <span className="language-label">{text.label}</span>
      <h2>{text.heading}</h2>
      <p>
        <span className="welcome-description-full">{text.description}</span>
        <span className="welcome-description-short">
          {text.descriptionShort}
        </span>
      </p>
      <button
        className="language-cta"
        type="button"
        aria-label={text.button}
        disabled={disabled}
        onClick={() => onChoose(language)}
        onFocus={() => onHighlight(language)}
        onBlur={() => onHighlight(null)}
      >
        <span className="welcome-description-full">{text.button}</span>
        <span className="welcome-description-short">
          {language === "ar" ? "العربية" : "English"}
        </span>
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
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const root = useRef(null),
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
    setLanguage(selectedRef.current);
    setPhase("leaving");
    callbacks.current.onReveal();
    exitTimer.current = setTimeout(
      () => callbacks.current.onComplete(),
      motion ? 680 : 0,
    );
  }, [motion, setLanguage]);
  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);
  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = before;
      clearTimeout(timer.current);
      clearTimeout(exitTimer.current);
    };
  }, []);
  useEffect(() => {
    if (phase !== "transition") return;
    // CSS completion and this bounded timer share the same guarded exit.
    timer.current = setTimeout(finish, motion ? 4200 : 2200);
    return () => clearTimeout(timer.current);
  }, [motion, phase, finish]);
  function choose(value) {
    if (lock.current) return;
    lock.current = true;
    selectedRef.current = value;
    setLanguage(value);
    setSelected(value);
    setHighlight(value);
    setPhase("transition");
    root.current.scrollTop = 0;
    root.current.querySelector(".intro-skip")?.focus({ preventScroll: true });
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
      className={`welcome-experience phase-${phase}`}
      data-highlight={highlight || "none"}
      data-selected={selected || "none"}
      data-orb-motion={motion && phase === "choose"}
      data-page-visible={pageVisible}
      dir="ltr"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      tabIndex={-1}
      onKeyDown={keyDown}
    >
      <h1 id="welcome-title" className="sr-only">
        Fares Mohammed — Choose your language / اختر لغتك
      </h1>
      <LandscapeScene variant="welcome" motion={motion} />
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
            {phase === "choose" ? "Skip / تخطّي" : welcome.skip}
          </span>
          <SkipForward size={15} />
        </button>
      </header>
      <div className="welcome-scene">
        <div className="welcome-depth">
          {/* The lights and orb controls share the cutout's normalized coordinates. */}
          <div className="welcome-light welcome-light-en" aria-hidden="true" />
          <div className="welcome-light welcome-light-ar" aria-hidden="true" />
          <img
            className="welcome-image"
            src={welcomeAssets.image}
            width="1765"
            height="891"
            alt=""
            fetchPriority="high"
          />
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
          motion={motion}
          language="en"
          disabled={phase !== "choose"}
          onChoose={choose}
          onHighlight={setHighlight}
        />
        <LanguageChoice
          motion={motion}
          language="ar"
          disabled={phase !== "choose"}
          onChoose={choose}
          onHighlight={setHighlight}
        />
      </div>
      {phase !== "choose" && selected && (
        <CinematicTransition language={selected} onFinish={finish} />
      )}
      <div
        className="welcome-status"
        role="status"
        aria-live={phase === "choose" ? "polite" : "off"}
      >
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
