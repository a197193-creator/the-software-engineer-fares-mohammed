import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MotionCard from "./MotionCard";
import { useStoryMotion } from "./StoryTypography";
import { useMotionSettings } from "./MotionSettings";

gsap.registerPlugin(ScrollTrigger);

// Supplied decorative illustrations, separate from real project screenshots.
// The compact guide slot remains independent of the artwork and headings.
export default function SectionIntro({ section }) {
  const artwork = `/assets/sections/${section}-intro.png`;
  const root = useRef(null);
  const scene = useRef(null);
  const { motion, ready } = useStoryMotion();
  const { config, desktop, reduced, pageActive } = useMotionSettings();

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || !scene.current) return;
    const enhanced = motion && ready && desktop && !reduced
      && pageActive && config.level !== "subtle";
    element.dataset.depthMotion = String(enhanced);
    if (!enhanced) return;

    const distance = config.level === "cinematic" ? 42 : 28;
    const context = gsap.context(() => {
      // MotionCard owns entrance, float and pointer tilt. Only this fourth,
      // inner layer owns scroll depth, so no controllers share a transform.
      const timeline = gsap.timeline({ paused: true })
        .fromTo(scene.current,
          { y: distance, scale: .955, rotationX: 5, opacity: .78 },
          { y: 0, scale: 1, rotationX: 0, opacity: 1, duration: .6, ease: "sine.out" }, 0)
        .to(scene.current,
          { y: -distance * .55, scale: .985, rotationX: -2, opacity: .88, duration: .4, ease: "sine.in" }, .6);
      ScrollTrigger.create({
        trigger: element,
        animation: timeline,
        start: "top 94%",
        end: "bottom 12%",
        scrub: .55,
        invalidateOnRefresh: true,
        onToggle: ({ isActive }) => { element.dataset.storyActive = String(isActive); },
      });
    }, element);
    return () => {
      context.revert();
      element.dataset.depthMotion = "false";
      element.dataset.storyActive = "false";
    };
  }, [motion, ready, desktop, reduced, pageActive, config.level, section]);

  return (
    <div ref={root} className="section-intro" data-section={section} aria-hidden="true">
      <MotionCard
        className="section-artwork"
        panelClassName="section-artwork-panel"
        style={{ "--artwork-image": `url("${artwork}")` }}
      >
        <div ref={scene} className="section-scene">
          <img
            src={artwork}
            width="1920"
            height="480"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      </MotionCard>
      <div className="section-guide-slot" />
    </div>
  );
}
