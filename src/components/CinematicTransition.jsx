import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { welcomeCopy } from "../locales";

// One message timeline over the same live world used by the main portfolio.
export default function CinematicTransition({ language, motion, onFinish }) {
  const text = welcomeCopy[language];
  const root = useRef(null);
  const finish = useRef(onFinish);
  finish.current = onFinish;
  useLayoutEffect(() => {
    const element = root.current;
    const welcome = element.closest(".welcome-experience");
    let timeline;
    const context = gsap.context(() => {
      const ui = welcome.querySelectorAll(".welcome-scene, .language-choices, .welcome-status, .welcome-brand, .welcome-ambient");
      const contents = element.querySelectorAll(".intro-message > *");
      gsap.set(contents, { opacity: 0, y: motion ? 14 : 0 });
      timeline = gsap.timeline({ onComplete: () => finish.current() });
      timeline.to(ui, { opacity: 0, duration: motion ? .5 : .12, ease: "power2.out" }, 0)
        .to(contents, { opacity: 1, y: 0, stagger: motion ? .085 : 0, duration: motion ? .7 : .18, ease: "power2.out" }, motion ? .3 : .1)
        .to({}, { duration: motion ? 1.35 : 1.05 });
    }, element);
    const visibility = () => document.hidden ? timeline.pause() : timeline.resume();
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => { context.revert(); document.removeEventListener("visibilitychange", visibility); };
  }, [language, motion]);
  return (
    <div ref={root} className="cinematic-transition message-transition" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="intro-message" role="status" aria-live="polite">
        <div className="intro-seal" aria-hidden="true"><span>F</span></div>
        <p className="intro-identity">{text.introIdentity}</p>
        <h2 className="intro-greeting">{text.introHeading}</h2>
        <p className="intro-world">{text.introSubtitle}</p>
        <p className="intro-note">{text.introNote}</p>
        <span className="intro-trace" aria-hidden="true"><i /></span>
      </div>
    </div>
  );
}
