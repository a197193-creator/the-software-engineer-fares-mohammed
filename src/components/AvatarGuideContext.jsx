import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useActiveSection } from "../hooks/useActiveSection";

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
  const [mode, setMode] = useState(visitMode);
  const completed = useRef(new Set());
  const available = ready && !blocked;
  const { section, candidate } = useActiveSection(available);

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
