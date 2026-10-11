import { useEffect, useRef } from "react";
import { useAvatarGuide } from "./AvatarGuideContext";
import { usePointerSurface } from "../hooks/usePointerSurface";

export function Magnetic({ children, className = "", ...props }) {
  const ref = useRef(null);
  const guide = useAvatarGuide();
  usePointerSurface(ref, {
    enabled: guide?.available && guide.motion,
    kind: "magnet",
  });
  return (
    <a {...props} ref={ref} className={`button magnetic ${className}`}>
      {children}
    </a>
  );
}

export function Preloader({ progress, ready, dismiss }) {
  useEffect(() => {
    if (ready) {
      const t = setTimeout(dismiss, 350);
      return () => clearTimeout(t);
    }
    // Asset failures must never leave the portfolio behind a loading screen.
    const t = setTimeout(dismiss, 6500);
    return () => clearTimeout(t);
  }, [ready, dismiss]);
  return (
    <div className="preloader" role="status" aria-label="Loading portfolio">
      <span className="loader-monogram">F</span>
      <span className="eyebrow">FARES MOHAMMED</span>
      <div className="loader-track">
        <div style={{ transform: `scaleX(${progress})` }} />
      </div>
      <span className="loader-meta">
        SETTING THE SCENE <span>{Math.round(progress * 100)}%</span>
      </span>
      <button onClick={dismiss}>
        Enter portfolio <span>↗</span>
      </button>
    </div>
  );
}
