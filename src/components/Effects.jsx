import { useEffect, useRef } from "react";

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
  function move(e) {
    if (
      document.documentElement.classList.contains("motion-off") ||
      e.pointerType !== "mouse"
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--mx",
      `${(e.clientX - r.left - r.width / 2) * 0.1}px`,
    );
    e.currentTarget.style.setProperty(
      "--my",
      `${(e.clientY - r.top - r.height / 2) * 0.15}px`,
    );
  }
  return (
    <a
      {...props}
      className={`button magnetic ${className}`}
      onPointerMove={move}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--mx", "0px");
        e.currentTarget.style.setProperty("--my", "0px");
      }}
    >
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
