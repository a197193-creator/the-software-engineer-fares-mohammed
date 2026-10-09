import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { motionTokens, motionPresets } from "../motionConfig";

const MotionSettings = createContext(null);
const reducedQuery = "(prefers-reduced-motion: reduce)";
const desktopQuery =
  "(min-width: 1100px) and (hover: hover) and (pointer: fine)";

function savedIntensity() {
  try {
    const saved = localStorage.getItem("fares-motion-intensity");
    if (Object.hasOwn(motionPresets, saved)) return saved;
  } catch {
    /* Settings also work without storage. */
  }
  return "balanced";
}

export function MotionSettingsProvider({ children }) {
  const [intensity, setIntensity] = useState(savedIntensity);
  const [reduced, setReduced] = useState(
    () => matchMedia(reducedQuery).matches,
  );
  const [desktop, setDesktop] = useState(
    () => matchMedia(desktopQuery).matches,
  );
  const [pageActive, setPageActive] = useState(() => !document.hidden);
  useEffect(() => {
    const reducedMedia = matchMedia(reducedQuery);
    const desktopMedia = matchMedia(desktopQuery);
    const preference = () => setReduced(reducedMedia.matches);
    const device = () => setDesktop(desktopMedia.matches);
    const visibility = () => setPageActive(!document.hidden);
    reducedMedia.addEventListener("change", preference);
    desktopMedia.addEventListener("change", device);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      reducedMedia.removeEventListener("change", preference);
      desktopMedia.removeEventListener("change", device);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("fares-motion-intensity", intensity);
    } catch {
      /* Optional. */
    }
  }, [intensity]);
  const level = reduced
    ? "subtle"
    : intensity === "cinematic" && !desktop
      ? "balanced"
      : intensity;
  const config = useMemo(
    () => ({ ...motionTokens, ...motionPresets[level], level }),
    [level],
  );
  const value = useMemo(
    () => ({ intensity, setIntensity, reduced, desktop, pageActive, config }),
    [intensity, reduced, desktop, pageActive, config],
  );
  return (
    <MotionSettings.Provider value={value}>{children}</MotionSettings.Provider>
  );
}

export function useMotionSettings() {
  return useContext(MotionSettings);
}
