import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { guideSections } from "../guideDialogue";

const AvatarGuideContext = createContext(null);
const visitKey = "fares-guide-visit";

function visitMode() {
  try {
    const mode = sessionStorage.getItem(visitKey);
    if (mode === "minimized" || mode === "dismissed") return mode;
  } catch {
    // The guide also works without storage.
  }
  return "expanded";
}

export function AvatarGuideProvider({
  ready,
  blocked,
  motion,
  goTo,
  children,
}) {
  const [section, setSection] = useState("home");
  const [candidate, setCandidate] = useState("home");
  const [mode, setMode] = useState(visitMode);
  const completed = useRef(new Set());
  const available = ready && !blocked;

  // Only sections reaching the reading area can speak, including during navigation.
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

  // A settled section owns one message; small scrolling changes do not restart it.
  useEffect(() => {
    if (!available || section === candidate) return;
    const timer = setTimeout(() => setSection(candidate), 350);
    return () => clearTimeout(timer);
  }, [available, candidate, section]);

  const changeMode = useCallback((value) => {
    setMode(value);
    try {
      sessionStorage.setItem(visitKey, value);
    } catch {
      // Preferences remain in React state when storage is unavailable.
    }
  }, []);
  const markCompleted = useCallback((key) => completed.current.add(key), []);
  const wasCompleted = useCallback((key) => completed.current.has(key), []);
  const value = useMemo(
    () => ({
      section,
      candidate,
      available,
      mode,
      motion,
      goTo,
      changeMode,
      markCompleted,
      wasCompleted,
    }),
    [
      section,
      candidate,
      available,
      mode,
      motion,
      goTo,
      changeMode,
      markCompleted,
      wasCompleted,
    ],
  );
  return (
    <AvatarGuideContext.Provider value={value}>
      {children}
    </AvatarGuideContext.Provider>
  );
}

export function useAvatarGuide() {
  return useContext(AvatarGuideContext);
}
