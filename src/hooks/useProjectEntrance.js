import { useLayoutEffect } from "react";
import gsap from "gsap";
import { useStoryMotion } from "../components/StoryTypography";
import { useMotionSettings } from "../components/MotionSettings";
import { subscribeMotionEnvironment } from "../motionEnvironment";

// Entrance owns the outer panel; CSS floating and pointer tilt own inner wrappers.
export function useProjectEntrance(ref, projectKey) {
  const { motion, ready } = useStoryMotion();
  const { config, desktop, reduced } = useMotionSettings();
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let visible = false;
    let sequence;
    let revealing = false;
    const moving = motion && ready && !reduced;
    const update = () => {
      root.dataset.floating = String(
        visible && moving && !document.hidden,
      );
    };
    const setRevealing = (value) => {
      if (revealing === value) return;
      revealing = value;
      root.dataset.projectRevealing = String(value);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(root);
    const unsubscribe = subscribeMotionEnvironment((event) => {
      if (event === "visibilitychange") update();
    });
    const context = gsap.context(() => {
      if (!moving) return;
      const project = Boolean(projectKey);
      const depth = project && config.level !== "subtle";
      const scrollLinked = depth && desktop;
      const cinematic = config.level === "cinematic";
      const grid = root.parentElement;
      const panels = project
        ? [...grid.children].filter((node) =>
            node.classList.contains("project-panel"),
          )
        : [];
      const featured = root.dataset.featured === "true";
      const pairIndex =
        panels.indexOf(root) - (panels[0]?.dataset.featured === "true" ? 1 : 0);
      // The row order supplies a small stagger; actual geometry supplies direction,
      // so Arabic and filtered grids do not need hardcoded left/right assignments.
      const pairDelay =
        scrollLinked && !featured && pairIndex % 2 === 1 ? 0.08 : 0;
      const fromX = () => {
        if (!scrollLinked || featured) return 0;
        const offset =
          root.offsetLeft + root.offsetWidth / 2 - grid.clientWidth / 2;
        return Math.abs(offset) < 5
          ? 0
          : Math.sign(offset) * (cinematic ? 28 : 18);
      };
      const distance = depth
        ? desktop
          ? cinematic
            ? 76
            : 54
          : 24
        : config.revealDistance;
      const scale = depth
        ? desktop
          ? 0.958
          : 0.987
        : config.level === "subtle"
          ? 1
          : 0.985;
      sequence = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: scrollLinked ? "top 96%" : "top 93%",
          ...(scrollLinked
            ? { end: "top 69%", scrub: cinematic ? 0.55 : 0.4 }
            : { toggleActions: "restart none restart none" }),
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const progress = sequence?.progress() || 0;
          setRevealing(project && progress > 0 && progress < 1);
        },
        onComplete: () => setRevealing(false),
        onReverseComplete: () => setRevealing(false),
      });
      sequence.fromTo(
        root,
        { x: fromX, y: distance, opacity: 0, scale },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: depth ? 0.85 : config.reveal,
          ease: config.ease,
        },
        pairDelay,
      );
      sequence.scrollTrigger.refresh();
    }, root);
    // Keyboard access never waits for a scrubbed panel to finish appearing.
    const revealForFocus = () => {
      if (!sequence || sequence.progress() >= 1) return;
      sequence.scrollTrigger?.disable(false);
      sequence.progress(1).pause();
      setRevealing(false);
    };
    root.addEventListener("focusin", revealForFocus);
    if (root.contains(document.activeElement)) revealForFocus();
    update();
    return () => {
      observer.disconnect();
      unsubscribe();
      root.removeEventListener("focusin", revealForFocus);
      context.revert();
      root.dataset.floating = "false";
      delete root.dataset.projectRevealing;
    };
  }, [ref, motion, ready, projectKey, config, desktop, reduced]);
}
