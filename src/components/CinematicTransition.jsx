import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { welcomeCopy } from "../locales";
import { portalGeometry } from "../portalGeometry";

// ## SHARED ORB ENTRANCE — one timeline, then the existing message-only welcome.
export default function CinematicTransition({ language, motion, origin, active = true, onFinish }) {
  const text = welcomeCopy[language];
  const root = useRef(null);
  const visual = useRef(null);
  const finish = useRef(onFinish);
  finish.current = onFinish;
  useLayoutEffect(() => {
    if (!active) return;
    const element = root.current;
    const welcome = element.closest(".welcome-experience");
    const flight = element.querySelector(".portal-flight");
    const atmosphere = element.querySelector(".portal-atmosphere");
    const viewport = { width: document.documentElement.clientWidth, height: window.innerHeight };
    const geometry = portalGeometry(origin?.bounds, viewport);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animated = motion && !reducedMotion.matches && !!origin?.node;
    const snapshot = origin?.node?.cloneNode(true);
    if (snapshot) visual.current.append(snapshot);
    let timeline;
    let disposed = false;
    const complete = () => { if (!disposed) finish.current(); };
    const context = gsap.context(() => {
      const ui = welcome.querySelectorAll(".welcome-scene, .language-choices, .welcome-status, .welcome-brand, .welcome-ambient");
      const contents = element.querySelectorAll(".intro-message > *");
      gsap.set(contents, { opacity: 0, y: animated ? 14 : 0 });
      gsap.set(atmosphere, { opacity: 0 });
      gsap.set(flight, { left: geometry.left, top: geometry.top, width: geometry.width, height: geometry.height, opacity: animated ? 1 : 0 });
      timeline = gsap.timeline({ onComplete: complete, defaults: { ease: "power2.inOut" } });

      if (animated) {
        const inner = element.querySelector(".portal-visual");
        const glow = element.querySelector(".portal-halo");
        const letters = element.querySelectorAll(".orb-letter");
        // Outer wrapper owns travel/zoom; inner wrapper owns only the activation pulse.
        timeline.to(inner, { scale: 1.035, duration: .18, ease: "power2.out" }, 0)
          .to(glow, { opacity: .55, duration: .3 }, 0)
          .to(inner, { scale: 1, duration: .32 }, .18)
          .to(ui, { opacity: 0, duration: .5, ease: "power2.out" }, .16)
          .to(flight, { x: geometry.x, y: geometry.y, duration: .9, ease: "power3.inOut" }, .18)
          .to(flight, { scale: geometry.scale, duration: 1.25, ease: "power3.in" }, .35)
          .to(letters, { opacity: 0, duration: .45 }, .7)
          .to(atmosphere, { opacity: .65, duration: .7, ease: "sine.inOut" }, .72)
          .to(flight, { opacity: 0, duration: .6, ease: "sine.inOut" }, 1.15)
          .to(contents, { opacity: 1, y: 0, stagger: .075, duration: .65, ease: "power2.out" }, 1.2)
          .to(atmosphere, { opacity: .22, duration: .9, ease: "sine.inOut" }, 1.6)
          .to({}, { duration: 1.1 });
      } else {
        // No camera movement for reduced motion or an unavailable source visual.
        timeline.to(ui, { opacity: 0, duration: .16, ease: "none" }, 0)
          .to(contents, { opacity: 1, y: 0, duration: .2, ease: "none" }, .1)
          .to({}, { duration: 1.05 });
      }
    }, element);

    const visibility = () => document.hidden ? timeline.pause() : timeline.resume();
    const resize = () => {
      // A changed camera invalidates captured FLIP bounds. Finish safely instead
      // of jumping to a stale origin or starting a second timeline.
      if (Math.abs(document.documentElement.clientWidth - viewport.width) > 16
        || Math.abs(window.innerHeight - viewport.height) > 16) complete();
    };
    const preference = () => { if (reducedMotion.matches) complete(); };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("resize", resize, { passive: true });
    reducedMotion.addEventListener("change", preference);
    visibility();
    return () => {
      disposed = true;
      context.revert();
      snapshot?.remove();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", preference);
    };
  }, [language, motion, origin, active]);
  return (
    <div ref={root} className="cinematic-transition message-transition portal-transition" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="portal-atmosphere" aria-hidden="true" />
      <div className="portal-flight" aria-hidden="true">
        <div className="portal-halo" />
        <div ref={visual} className="portal-visual" />
      </div>
      <div className="intro-message" role="status" aria-live="polite" aria-atomic="true">
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
