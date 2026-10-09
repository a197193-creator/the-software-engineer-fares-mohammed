import { useEffect } from "react";
import gsap from "gsap";
import { useStoryMotion } from "../components/StoryTypography";
import { useMotionSettings } from "../components/MotionSettings";

// Entrance owns the outer panel; CSS floating and pointer tilt own inner wrappers.
export function useProjectEntrance(ref, projectKey) {
  const { motion, ready } = useStoryMotion();
  const { config } = useMotionSettings();
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let visible = false;
    const update = () => {
      root.dataset.floating = String(
        visible && motion && ready && !document.hidden,
      );
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    const context = gsap.context(() => {
      if (!motion || !ready) return;
      gsap.fromTo(
        root,
        {
          y: config.revealDistance,
          opacity: 0,
          scale: config.level === "subtle" ? 1 : 0.985,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: config.reveal,
          ease: config.ease,
          scrollTrigger: { trigger: root, start: "top 93%", once: true },
        },
      );
    }, root);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      context.revert();
      root.dataset.floating = "false";
    };
  }, [ref, motion, ready, projectKey, config]);
}
