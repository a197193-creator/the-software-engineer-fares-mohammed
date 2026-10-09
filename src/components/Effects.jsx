import { useEffect, useRef } from "react";
import { useAvatarGuide } from "./AvatarGuideContext";
import { usePointerSurface } from "../hooks/usePointerSurface";

export function Cursor({ enabled }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    const move = (event) => {
      el.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      el.classList.add("visible");
      const project = event.target.closest(".project-card");
      el.classList.toggle("cursor-view", !!project);
      el.classList.toggle("cursor-link", !!event.target.closest("a,button"));
      el.textContent = project ? "View" : "";
    };
    const leave = () => el.classList.remove("visible");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);
  return enabled ? (
    <div className="cursor-follower" ref={ref} aria-hidden="true" />
  ) : null;
}

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
