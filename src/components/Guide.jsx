import { useLanguage } from "../LanguageContext";
import { useEffect, useRef, useState } from "react";
import { Compass, X, ArrowRight, ChevronLeft, Pause, Play } from "lucide-react";
import { guideSteps } from "../data";
import { avatarScenes } from "./SectionAvatar";

export default function Guide({ active, goTo, motion, setMotion, tourSignal }) {
  const { tr, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const step =
    index === null
      ? guideSteps.find((s) => s.id === active) || guideSteps[0]
      : guideSteps[index];
  const close = () => {
    setOpen(false);
    setIndex(null);
    triggerRef.current?.focus();
  };
  useEffect(() => {
    if (tourSignal) {
      setIndex(0);
      setOpen(true);
    }
  }, [tourSignal]);
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        setIndex(null);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);
  function next() {
    const current =
      index === null ? guideSteps.findIndex((s) => s.id === active) : index;
    if (current === guideSteps.length - 1) {
      close();
      return;
    }
    setIndex(current + 1);
    goTo(guideSteps[current + 1].id);
  }
  return (
    <aside className="guide" aria-label={tr("Portfolio guide")}>
      {open && (
        <div id="guide-panel" className="guide-panel">
          <div className="guide-header">
            <span>
              <Compass size={15} />
              {tr("YOUR PERSONAL GUIDE")}
            </span>
            <button
              ref={closeRef}
              className="icon-button"
              aria-label={tr("Close guide")}
              onClick={close}
            >
              <X size={18} />
            </button>
          </div>
          <div className="guide-profile">
            <img
              src={avatarScenes[step.id].image}
              alt={tr("Fares’ digital companion")}
              width="64"
              height="96"
              onError={(event) => {
                if (
                  !event.currentTarget.src.endsWith(
                    avatarScenes[step.id].fallback,
                  )
                )
                  event.currentTarget.src = avatarScenes[step.id].fallback;
              }}
            />
            <div>
              <strong>{tr("A little character.")}</strong>
              <span>{tr("A lot of curiosity.")}</span>
            </div>
          </div>
          <div aria-live="polite">
            <span className="eyebrow">
              {index === null
                ? tr(active.charAt(0).toUpperCase() + active.slice(1))
                : language === "ar"
                  ? `المحطة ${index + 1} من ${guideSteps.length}`
                  : `STOP ${index + 1} OF ${guideSteps.length}`}
            </span>
            <h3>{tr(step.title)}</h3>
            <p>{tr(step.text)}</p>
          </div>
          <div className="guide-controls">
            {index !== null && index > 0 && (
              <button
                className="icon-button"
                aria-label={tr("Previous tour stop")}
                onClick={() => {
                  setIndex(index - 1);
                  goTo(guideSteps[index - 1].id);
                }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <button className="guide-next" onClick={next}>
              {tr(step.action)}
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="guide-shortcuts">
            <button onClick={() => goTo("projects")}>{tr("Projects")}</button>
            <button onClick={() => goTo("contact")}>{tr("Contact")}</button>
            <button aria-pressed={!motion} onClick={() => setMotion(!motion)}>
              {motion ? <Pause size={12} /> : <Play size={12} />}{" "}
              {tr(motion ? "Pause motion" : "Enable motion")}
            </button>
          </div>
        </div>
      )}
      <button
        ref={triggerRef}
        className="guide-trigger"
        aria-expanded={open}
        aria-controls="guide-panel"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <Compass size={19} />
        <span>{tr(open ? "Hide guide" : "Take a tour")}</span>
        <i />
      </button>
    </aside>
  );
}
