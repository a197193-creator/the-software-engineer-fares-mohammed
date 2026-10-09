import { useEffect, useState } from "react";
import { guideSections } from "../guideDialogue";
import { subscribeMotionEnvironment } from "../motionEnvironment";

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
    let update;
    const connect = () => {
      observer?.disconnect();
      const height = window.innerHeight;
      update = () => {
        // Short final sections may never reach the activation band on mobile.
        const atEnd =
          window.scrollY > 0 &&
          document.documentElement.scrollHeight - window.scrollY - height <= 2;
        const current = atEnd
          ? sections.at(-1)
          : [...sections].reverse().find((element) => {
              const bounds = element.getBoundingClientRect();
              return (
                bounds.top <= height * 0.46 && bounds.bottom >= height * 0.4
              );
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
    const unsubscribe = subscribeMotionEnvironment((event) => {
      if (
        event === "scroll" &&
        document.documentElement.scrollHeight -
          window.scrollY -
          window.innerHeight <=
          2
      )
        update();
    });
    window.addEventListener("resize", connect);
    return () => {
      observer.disconnect();
      unsubscribe();
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
