import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, SkipForward } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { welcomeCopy } from "../locales";
import CinematicTransition from "./CinematicTransition";
import { usePointerSurface } from "../hooks/usePointerSurface";
import LanguageOrb from "./LanguageOrb";

export const welcomeAssets = {
  image: "/assets/welcome-guardian-orbless.webp",
};

// Capture the real SVG before changing phase pauses its CSS orbit animations.
// This is a visual snapshot of our own DOM, not another orb renderer/controller.
function captureOrb(welcome, language) {
  const source = welcome?.querySelector(`.sphere-${language} .language-orb`);
  if (!source) return null;
  const bounds = source.getBoundingClientRect();
  const clone = source.cloneNode(true);
  const originals = [source, ...source.querySelectorAll("*")];
  const copies = [clone, ...clone.querySelectorAll("*")];
  originals.forEach((element, index) => {
    const style = getComputedStyle(element);
    const copy = copies[index];
    copy.style.animation = "none";
    copy.style.transition = "none";
    copy.style.transform = index === 0 ? "none" : style.transform;
    copy.style.transformOrigin = style.transformOrigin;
    copy.style.opacity = style.opacity;
    copy.style.filter = style.filter;
    copy.style.color = style.color;
  });
  // Keep SVG paint references independent of the fading source DOM.
  const ids = new Map();
  clone.querySelectorAll("[id]").forEach((element) => {
    const id = element.id;
    ids.set(id, `portal-${id}`);
    element.id = ids.get(id);
  });
  clone.querySelectorAll("[fill], [stroke]").forEach((element) => {
    for (const attribute of ["fill", "stroke"]) {
      const value = element.getAttribute(attribute);
      if (!value?.startsWith("url(#")) continue;
      const id = value.slice(5, -1);
      if (ids.has(id)) element.setAttribute(attribute, `url(#${ids.get(id)})`);
    }
  });
  return {
    bounds: { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height },
    node: clone,
  };
}
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
      onClick={(event) => onChoose(language, event.currentTarget)}
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
export default function WelcomeExperience({ motion, onReveal, onComplete, onAccent }) {
  const { language, setLanguage, welcome } = useLanguage();
  const [phase, setPhase] = useState("choose");
  const [highlight, setHighlight] = useState(null);
  const [selected, setSelected] = useState(null);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const root = useRef(null),
    portal = useRef(null),
    lock = useRef(false),
    finished = useRef(false),
    callbacks = useRef({ onReveal, onComplete }),
    selectedRef = useRef(language),
    exitTimer = useRef(null);
  callbacks.current = { onReveal, onComplete };
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    lock.current = true;
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
      clearTimeout(exitTimer.current);
    };
  }, []);
  useEffect(() => {
    // Back/forward cancels the portal without leaving a scroll lock or overlay.
    window.addEventListener("popstate", finish);
    return () => window.removeEventListener("popstate", finish);
  }, [finish]);
  function highlightLanguage(value) {
    if (lock.current) return;
    setHighlight(value);
    onAccent(value);
  }
  function choose(value) {
    if (lock.current) return;
    lock.current = true;
    portal.current = captureOrb(root.current, value);
    selectedRef.current = value;
    setLanguage(value);
    setSelected(value);
    setHighlight(value);
    onAccent(value);
    setPhase("transition");
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
      data-orb-motion={motion}
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
            onHighlight={highlightLanguage}
          />
          <InteractiveSphere
            language="ar"
            disabled={phase !== "choose"}
            selected={selected === "ar"}
            onChoose={choose}
            onHighlight={highlightLanguage}
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
          onHighlight={highlightLanguage}
        />
        <LanguageChoice
          motion={motion}
          language="ar"
          disabled={phase !== "choose"}
          onChoose={choose}
          onHighlight={highlightLanguage}
        />
      </div>
      {phase !== "choose" && selected && (
        <CinematicTransition
          language={selected}
          motion={motion}
          origin={portal.current}
          active={phase === "transition"}
          onFinish={finish}
        />
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
