import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { welcomeCopy } from "../locales";
import LandscapeScene from "./LandscapeScene";
import LanguageOrb from "./LanguageOrb";
import { portalGeometry } from "../portalGeometry";

// Resolution-independent artwork. Only the finishing layer signals completion.
export default function CinematicTransition({ language, origin, motion, onFinish }) {
  const text = welcomeCopy[language];
  const root = useRef(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  useLayoutEffect(() => {
    const element = root.current;
    const sphere = element.querySelector(".portal-shared-orb");
    sphere.querySelectorAll(".orb-letter").forEach((node, index) => Object.assign(node.style, origin.glyphs[index], {animation:"none"}));
    Object.assign(sphere.querySelector(".orb-orbit-ring").style, {transform:origin.orbit, animation:"none"});
    const welcome = element.closest(".welcome-experience");
    let timeline;
    const context = gsap.context(() => {
      const contents = element.querySelectorAll(".portal-copy > *, .portal-guardian");
      gsap.set(contents, { opacity: 0, y: motion ? 16 : 0 });
      timeline = gsap.timeline({ onComplete: () => finishRef.current() });
      if (motion) {
        timeline.call(() => { element.dataset.stage = "activation"; })
          .to(sphere.querySelector(".language-orb"), {scale:1.035, duration:.18, repeat:1, yoyo:true, ease:"sine.inOut"})
          .to(welcome.querySelectorAll(".welcome-scene, .language-choices, .welcome-status, .welcome-brand, .welcome-ambient"), {opacity:0, duration:.65, ease:"power2.inOut"}, .22)
          .call(() => { element.dataset.stage = "centering"; }, null, .34)
          .to(sphere, {x:() => portalGeometry(origin, innerWidth, innerHeight).x, y:() => portalGeometry(origin, innerWidth, innerHeight).y, duration:.75, ease:"power2.inOut"}, .34)
          .call(() => { element.dataset.stage = "expansion"; }, null, .95)
          .to(sphere, {scale:() => portalGeometry(origin, innerWidth, innerHeight).scale, duration:1.15, ease:"power3.in"}, .95)
          .to(".portal-fill", {opacity:1, duration:.8, ease:"sine.inOut"}, 1.15)
          .to(".portal-atmosphere", {opacity:1, duration:.85}, 1.5)
          .to(sphere, {opacity:0, duration:.55}, 1.85)
          .call(() => { element.dataset.stage = "welcome"; }, null, 1.85)
          .to(contents, {opacity:1, y:0, stagger:.09, duration:.7, ease:"power2.out"}, 1.9)
          .to({}, {duration:1.25});
      } else {
        gsap.set(sphere, {opacity:0});
        gsap.set(welcome.querySelectorAll(".welcome-scene, .language-choices, .welcome-status, .welcome-brand"), {opacity:0});
        gsap.set(".portal-atmosphere", {opacity:1});
        element.dataset.stage = "welcome";
        timeline.to(contents, {opacity:1, duration:.18}).to({}, {duration:1.1});
      }
    }, element);
    const visibility = () => document.hidden ? timeline.pause() : timeline.resume();
    // Cancel with the normal fade on viewport changes instead of stale FLIP geometry.
    const resize = () => finishRef.current();
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("resize", resize);
    visibility();
    return () => { context.revert(); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("resize", resize); };
  }, [language, origin, motion]);
  return (
    <div
      ref={root}
      className={`cinematic-transition portal-transition portal-${language}`}
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="portal-shared-orb" style={{left:origin.left, top:origin.top, width:origin.width, height:origin.height}} aria-hidden="true">
        <div className="portal-fill" />
        <LanguageOrb language={language} />
      </div>
      <div className="portal-atmosphere" aria-hidden="true">
        <LandscapeScene variant="transition" motion={motion} />
      </div>
      <div className="portal-welcome">
        <div className="portal-guardian" aria-hidden="true">
          <img src="/assets/cinematic-0.webp" width="600" height="850" alt="" />
        </div>
        <div className="intro-message portal-copy" role="status" aria-live="polite">
          <div className="intro-seal" aria-hidden="true">
            <span>F</span>
          </div>
          <p className="intro-identity">{text.introIdentity}</p>
          <h2 className="intro-greeting">{text.introHeading}</h2>
          <p className="intro-world">{text.introSubtitle}</p>
          <p className="intro-note">{text.introNote}</p>
          <span className="intro-trace" aria-hidden="true">
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
