import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export function useMotion(enabled, blocked, ready) {
  useEffect(() => {
    if (
      !enabled ||
      blocked ||
      !window.matchMedia(
        "(min-width: 768px) and (hover: hover) and (pointer: fine)",
      ).matches
    )
      return;
    const lenis = new Lenis({
      duration: 1.1,
      anchors: true,
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled, blocked]);

  useEffect(() => {
    if (!enabled || !ready) return;
    const context = gsap.context(() => {
      gsap.from(".hero-word", {
        yPercent: 105,
        opacity: 0,
        duration: 1,
        stagger: 0.11,
        ease: "power3.out",
      });
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
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
    });
    return () => context.revert();
  }, [enabled, ready]);
}

export function usePageTracking(setActive, setHidden) {
  useEffect(() => {
    let last = window.scrollY,
      queued = false;
    const update = () => {
      const y = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        height > 0 ? y / height : 0,
      );
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 180);
        last = y;
      }
      const sections = [...document.querySelectorAll("main > section[id]")];
      const active = [...sections]
        .reverse()
        .find(
          (el) => el.getBoundingClientRect().top < window.innerHeight * 0.45,
        );
      setActive(active?.id || "home");
      queued = false;
    };
    const scroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    update();
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
    };
  }, [setActive, setHidden]);
}
