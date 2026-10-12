import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useMotionSettings } from "../components/MotionSettings";
import { registerScrollController } from "../scrollController";

gsap.registerPlugin(ScrollTrigger);

export function useMotion(enabled, blocked, ready, layoutKey) {
  const { config, pageActive } = useMotionSettings();
  useEffect(() => {
    let active = true;
    let layoutFrame = 0;
    const refreshLayout = () => {
      if (layoutFrame) return;
      layoutFrame = requestAnimationFrame(() => {
        layoutFrame = 0;
        if (!active) return;
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event("portfolio-layout"));
      });
    };
    // Filters, native disclosures and language reflow change later chapter
    // positions. Observe document flow, never animated transform bounds.
    const observer = new ResizeObserver(refreshLayout);
    const main = document.querySelector("main");
    if (main) observer.observe(main);
    document.fonts.ready.then(() => {
      if (active) refreshLayout();
    });
    return () => {
      active = false;
      observer.disconnect();
      cancelAnimationFrame(layoutFrame);
    };
  }, [layoutKey]);
  useEffect(() => {
    if (!enabled || config.level === "subtle" || !pageActive || blocked) return;
    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );
    let lenis;
    let release;
    const tick = (time) => lenis?.raf(time * 1000);
    const stop = () => {
      gsap.ticker.remove(tick);
      release?.();
      release = undefined;
      lenis?.destroy();
      lenis = undefined;
    };
    const sync = () => {
      stop();
      if (!media.matches) return;
      lenis = new Lenis({ duration: 1.1, anchors: false, smoothWheel: true });
      release = registerScrollController(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
    };
    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      stop();
    };
  }, [enabled, blocked, config.level, pageActive]);

  useEffect(() => {
    if (!enabled || !ready) return;
    const context = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        // Typography owns its words/statement; do not also move its ancestor.
        if (el.querySelector("[data-story-heading], [data-story-copy]")) return;
        gsap.from(el, {
          y: config.revealDistance,
          opacity: 0,
          duration: config.reveal,
          ease: config.ease,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
      gsap.fromTo(
        ".timeline-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 75%",
            end: "bottom 65%",
            scrub: 0.5,
          },
        },
      );
      // Chapter accents follow approach progress; headings keep their own word layer.
      gsap.utils.toArray(".section-heading").forEach((heading) => {
        gsap.fromTo(heading, { "--chapter-progress": 0 }, {
          "--chapter-progress": 1,
          ease: "none",
          scrollTrigger: {
            trigger: heading, start: "top 92%", end: "top 48%", scrub: .6,
          },
        });
      });
    });
    return () => context.revert();
  }, [enabled, ready, config]);
}

export function usePageTracking(setActive, setHidden) {
  useEffect(() => {
    let last = window.scrollY,
      frame = 0;
    const progressBar = document.querySelector(".scroll-progress");
    const sections = [...document.querySelectorAll("main > section[id]")];
    const update = () => {
      const y = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      // Localize the write: inherited root variables restyle the entire site.
      if (progressBar)
        progressBar.style.transform = `scaleX(${height > 0 ? y / height : 0})`;
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 180);
        last = y;
      }
      const atEnd = y > 0 && height - y <= 2;
      const active = atEnd
        ? sections.at(-1)
        : [...sections]
            .reverse()
            .find(
              (el) =>
                el.getBoundingClientRect().top < window.innerHeight * 0.46,
            );
      setActive(active?.id || "home");
      frame = 0;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
    };
  }, [setActive, setHidden]);
}
