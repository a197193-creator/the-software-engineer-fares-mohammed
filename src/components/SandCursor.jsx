import { useEffect, useRef } from "react";

const grainCount = 12;
export default function SandCursor({ enabled }) {
  const root = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const query = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );
    const element = root.current;
    const particles = [...element.querySelectorAll(".cursor-grain")];
    const ring = element.querySelector(".sand-ring-position");
    const grains = Array.from({ length: grainCount }, () => null);
    let frame = 0,
      active = false,
      x = 0,
      y = 0,
      targetX = 0,
      targetY = 0;
    let previousX = 0,
      previousY = 0,
      lastGrain = 0,
      nextGrain = 0;
    const hide = () => {
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      element.classList.remove(
        "cursor-visible",
        "cursor-hover",
        "cursor-pressed",
      );
      particles.forEach((particle, index) => {
        particle.style.opacity = "0";
        grains[index] = null;
      });
    };
    function animate(now) {
      frame = 0;
      if (!active) return;
      x += (targetX - x) * 0.3;
      y += (targetY - y) * 0.3;
      ring.style.transform = `translate3d(${x}px,${y}px,0)`;
      let remaining = false;
      grains.forEach((grain, index) => {
        if (!grain) return;
        const age = (now - grain.born) / 700;
        if (age >= 1) {
          particles[index].style.opacity = "0";
          grains[index] = null;
          return;
        }
        remaining = true;
        particles[index].style.transform =
          `translate3d(${grain.x + grain.dx * age}px,${grain.y + grain.dy * age + 14 * age * age}px,0) scale(${1 - age * 0.65})`;
        particles[index].style.opacity = String((1 - age) * 0.7);
      });
      if (remaining || Math.abs(targetX - x) + Math.abs(targetY - y) > 0.2)
        frame = requestAnimationFrame(animate);
    }
    const move = (event) => {
      if (
        !query.matches ||
        event.pointerType !== "mouse" ||
        event.target.closest("dialog")
      ) {
        hide();
        return;
      }
      if (!active) {
        x = previousX = event.clientX;
        y = previousY = event.clientY;
        active = true;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      const interactive = event.target.closest(
        "a, button, input, textarea, select",
      );
      element.classList.add("cursor-visible");
      element.classList.toggle("cursor-hover", !!interactive);
      element.style.setProperty(
        "--cursor-color",
        event.target.closest(".choice-en, .sphere-en") ? "#60e5ff" : "#efbc6d",
      );
      const now = performance.now();
      const distance = Math.hypot(targetX - previousX, targetY - previousY);
      if (distance > 8 && now - lastGrain > 28) {
        const spread = nextGrain * 2.39996;
        grains[nextGrain] = {
          x: targetX,
          y: targetY,
          born: now,
          dx: Math.cos(spread) * 17,
          dy: Math.sin(spread) * 13,
        };
        nextGrain = (nextGrain + 1) % grainCount;
        previousX = targetX;
        previousY = targetY;
        lastGrain = now;
      }
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const press = () => element.classList.add("cursor-pressed");
    const release = () => element.classList.remove("cursor-pressed");
    const visibility = () => {
      if (document.hidden) hide();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("pointerleave", hide);
    document.addEventListener("visibilitychange", visibility);
    query.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("blur", hide);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("visibilitychange", visibility);
      query.removeEventListener("change", hide);
    };
  }, [enabled]);
  return enabled ? (
    <div ref={root} className="sand-cursor" aria-hidden="true">
      <span className="sand-ring-position">
        <span className="sand-ring" />
      </span>
      {Array.from({ length: grainCount }, (_, index) => (
        <i className="cursor-grain" key={index} />
      ))}
    </div>
  ) : null;
}
