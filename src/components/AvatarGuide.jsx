import { useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, Compass, Minus, X } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { guideSections } from "../guideDialogue";
import { useAvatarGuide } from "./AvatarGuideContext";
import { useGuideTyping } from "../hooks/useGuideTyping";

function SpeechMessage({ section, scene, departing, minimize, dismiss }) {
  const { language, guide, tr } = useLanguage();
  const { motion, goTo, changeMode, wasCompleted, markCompleted } =
    useAvatarGuide();
  const dialogue = guide.dialogue[section];
  const messageKey = `${language}:${section}`;
  const messageId = `guide-message-${section}`;
  const { words, count, typing, complete } = useGuideTyping({
    messageKey,
    text: dialogue.message,
    motion,
    enabled: !departing,
    wasCompleted,
    markCompleted,
  });
  const index = guideSections.indexOf(section);
  return (
    <div
      className="avatar-guide-surface"
      data-departing={departing}
      data-typing={typing}
    >
      <div className="avatar-guide-header">
        <span className="avatar-guide-section">
          <Compass size={15} aria-hidden="true" />
          <b>{scene.number}</b> {tr(scene.name)}
        </span>
        <button type="button" aria-label={guide.minimize} onClick={minimize}>
          <Minus size={17} />
        </button>
        <button type="button" aria-label={guide.dismiss} onClick={dismiss}>
          <X size={17} />
        </button>
      </div>
      <p
        className="sr-only"
        id={messageId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {dialogue.message}
      </p>
      <button
        type="button"
        className="avatar-guide-message"
        aria-label={guide.complete}
        aria-describedby={messageId}
        onClick={complete}
      >
        <span aria-hidden="true">
          {words.map((word, index) => (
            <span
              key={index}
              className="avatar-guide-word"
              data-shown={index < count}
            >
              {word}{" "}
            </span>
          ))}
        </span>
      </button>
      <div className="avatar-guide-hint" aria-hidden="true">
        {typing ? (
          <>
            <span className="avatar-guide-dots">
              <i />
              <i />
              <i />
            </span>
            <span>{guide.hint}</span>
          </>
        ) : (
          <span>{guide.ready}</span>
        )}
      </div>
      <div className="avatar-guide-navigation">
        {index > 0 && (
          <button
            type="button"
            className="avatar-guide-previous"
            aria-label={guide.previous}
            onClick={() => goTo(guideSections[index - 1])}
          >
            <ChevronLeft size={17} />
          </button>
        )}
        <button
          type="button"
          className="avatar-guide-next"
          onClick={() =>
            index === guideSections.length - 1
              ? changeMode("minimized")
              : goTo(guideSections[index + 1])
          }
        >
          {dialogue.action}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/** One live bubble in the existing section's avatar space; never a floating overlay. */
export default function AvatarGuide({ section, scene, children }) {
  const { language, guide } = useLanguage();
  const context = useAvatarGuide();
  const launcher = useRef(null);
  const bubble = useRef(null);
  const restoreFocus = useRef(false);
  const isCurrent = context?.section === section && context.available;
  useEffect(() => {
    if (isCurrent && restoreFocus.current) {
      const target =
        context.mode === "expanded"
          ? bubble.current?.querySelector(".avatar-guide-message")
          : launcher.current;
      target?.focus({ preventScroll: true });
      restoreFocus.current = false;
    }
  }, [isCurrent, context?.mode]);
  if (!isCurrent) return children;
  const collapse = (mode) => {
    restoreFocus.current = true;
    context.changeMode(mode);
  };
  if (context.mode !== "expanded") {
    return (
      <figcaption
        className={`avatar-guide-collapsed ${context.mode}`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <button
          ref={launcher}
          type="button"
          onClick={() => {
            restoreFocus.current = true;
            context.changeMode("expanded");
          }}
          aria-label={`${guide.show}. ${context.mode === "dismissed" ? guide.dismissed : guide.minimized}`}
        >
          <Compass size={17} />
          <span>{guide.show}</span>
        </button>
      </figcaption>
    );
  }
  return (
    <figcaption
      className="avatar-speech avatar-guide-frame"
      ref={bubble}
      dir={language === "ar" ? "rtl" : "ltr"}
      role="region"
      aria-label={guide.label}
      data-section={section}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          collapse("minimized");
        }
      }}
    >
      <SpeechMessage
        key={`${language}:${section}`}
        section={section}
        scene={scene}
        departing={context.candidate !== section}
        minimize={() => collapse("minimized")}
        dismiss={() => collapse("dismissed")}
      />
    </figcaption>
  );
}
