import { useEffect, useState } from "react";
import { guideSections } from "../guideDialogue";

// Dialogue and poses share this one detector and settling interval.
export function useActiveSection(available) {
  const [section, setSection] = useState("home");
  const [candidate, setCandidate] = useState("home");
  useEffect(() => {
    if (!available) return;
    const sections = guideSections
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    let observer;
    const connect = () => {
      observer?.disconnect();
      const height = window.innerHeight;
      const update = () => {
        const current = [...sections].reverse().find((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.top <= height * 0.46 && bounds.bottom >= height * 0.4;
        });
        if (current) setCandidate(current.id);
      };
      observer = new IntersectionObserver(update, {
        rootMargin: `-${height * 0.4}px 0px -${height * 0.54}px 0px`,
        threshold: 0,
      });
      sections.forEach((element) => observer.observe(element));
      update();
    };
    connect();
    window.addEventListener("resize", connect);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", connect);
    };
  }, [available]);

  useEffect(() => {
    if (!available || section === candidate) return;
    const timer = setTimeout(() => setSection(candidate), 350);
    return () => clearTimeout(timer);
  }, [available, candidate, section]);
  return { section, candidate };
}
