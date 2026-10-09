import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { desktopPointerQuery } from "../hooks/usePointerSurface";
import { useMotionSettings } from "./MotionSettings";

const particleCount = 6;
const lifetime = 340;
const editable =
  "input,textarea,select,[contenteditable]:not([contenteditable='false'])";

export default function CinematicCursor({ enabled }) {
  const { config } = useMotionSettings();
  const overlay = useRef(null);
  const atmosphere = useRef(null);
  const heroField = useRef(null);
  const [heroHost, setHeroHost] = useState(null);
  useEffect(() => {
    setHeroHost(document.querySelector(".hero-photo"));
  }, []);

  useEffect(() => {
    if (!enabled || !overlay.current || !atmosphere.current) return;
    const root = overlay.current;
    const glow = atmosphere.current;
    const ring = root.querySelector(".energy-ring-position");
    const grains = [...root.querySelectorAll(".energy-grain")];
    const fine = window.matchMedia(desktopPointerQuery);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const particles = Array.from({ length: particleCount }, () => ({
      born: 0,
    }));
    let frame = 0,
      last = 0,
      index = 0,
      visible = false,
      dirty = true;
    let bounds = null;
    let x = 0,
      y = 0,
      targetX = 0,
      targetY = 0;
    let seedX = 0,
      seedY = 0,
      seedTime = 0;
    const canRun = () => fine.matches && !reduced.matches && !document.hidden;
    const hide = () => {
      visible = false;
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      seedTime = 0;
      root.removeAttribute("data-visible");
      root.removeAttribute("data-hover");
      root.removeAttribute("data-pressed");
      glow.removeAttribute("data-visible");
      heroField.current?.removeAttribute("data-visible");
      particles.forEach((particle, i) => {
        particle.born = 0;
        grains[i].style.opacity = "0";
      });
    };
    const tick = (time) => {
      frame = 0;
      if (!visible || !canRun()) {
        hide();
        return;
      }
      const dt = Math.min(time - (last || time - 16.67), 50);
      last = time;
      const blend = 1 - Math.exp(-dt / 48);
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      if (dirty && heroHost) {
        bounds = heroHost.getBoundingClientRect();
        dirty = false;
      }
      ring.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
      glow.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
      if (heroField.current && bounds) {
        const inHero = y >= bounds.top && y <= bounds.bottom;
        heroField.current.toggleAttribute("data-visible", inHero);
        heroField.current.style.transform = `translate3d(${(x - bounds.left).toFixed(2)}px,${(y - bounds.top).toFixed(2)}px,0)`;
      }
      let alive = false;
      particles.forEach((particle, i) => {
        if (!particle.born) return;
        const age = (time - particle.born) / lifetime;
        if (age >= 1) {
          particle.born = 0;
          grains[i].style.opacity = "0";
          return;
        }
        alive = true;
        grains[i].style.opacity = ((1 - age) * 0.24).toFixed(3);
        grains[i].style.transform =
          `translate3d(${particle.x + particle.dx * age}px,${particle.y + 5 * age}px,0) scale(${1 - age * 0.45})`;
      });
      if (alive || Math.abs(targetX - x) + Math.abs(targetY - y) > 0.15) {
        frame = requestAnimationFrame(tick);
      } else last = 0; // Sleep while stationary; no permanent render loop.
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const move = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (
        !canRun() ||
        event.pointerType !== "mouse" ||
        !target ||
        event.clientX >= document.documentElement.clientWidth ||
        target.closest(`dialog,${editable}`)
      ) {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        x = targetX;
        y = targetY;
        seedX = x;
        seedY = y;
        dirty = true;
        visible = true;
        root.setAttribute("data-visible", "");
        glow.setAttribute("data-visible", "");
      }
      const interactive = target.closest("a,button,[role='button']");
      root.dataset.hover = interactive
        ? interactive.matches(".primary")
          ? "gold"
          : "cyan"
        : "none";
      const now = performance.now();
      if (
        config.particles > 0 &&
        now - seedTime > 42 &&
        Math.hypot(targetX - seedX, targetY - seedY) > 10
      ) {
        Object.assign(particles[index], {
          born: now,
          x: targetX,
          y: targetY,
          dx: index % 2 ? 4 : -4,
        });
        index = (index + 1) % config.particles;
        seedX = targetX;
        seedY = targetY;
        seedTime = now;
      }
      wake();
    };
    const geometry = () => {
      dirty = true;
      if (visible) wake();
    };
    const down = () => {
      if (visible) root.setAttribute("data-pressed", "");
    };
    const up = () => root.removeAttribute("data-pressed");
    const events = [
      [window, "pointermove", move],
      [window, "pointerdown", down],
      [window, "pointerup", up],
      [window, "pointercancel", hide],
      [document.documentElement, "pointerleave", hide],
      [window, "blur", hide],
      [window, "keydown", hide],
      [document, "visibilitychange", hide],
      [window, "scroll", geometry],
      [window, "resize", geometry],
    ];
    events.forEach(([target, event, handler]) =>
      target.addEventListener(event, handler, { passive: true }),
    );
    fine.addEventListener("change", hide);
    reduced.addEventListener("change", hide);
    // Bilingual copy/fonts may resize the Hero without a window resize.
    const heroResize = new ResizeObserver(geometry);
    if (heroHost) heroResize.observe(heroHost);
    return () => {
      events.forEach(([target, event, handler]) =>
        target.removeEventListener(event, handler),
      );
      fine.removeEventListener("change", hide);
      reduced.removeEventListener("change", hide);
      heroResize.disconnect();
      hide();
    };
  }, [enabled, heroHost, config]);

  return (
    <>
      <div ref={atmosphere} className="pointer-atmosphere" aria-hidden="true" />
      <div ref={overlay} className="energy-cursor" aria-hidden="true">
        <div className="energy-ring-position">
          <div className="energy-ring" />
        </div>
        {Array.from({ length: particleCount }, (_, i) => (
          <i key={i} className="energy-grain" />
        ))}
      </div>
      {heroHost &&
        createPortal(
          <div
            ref={heroField}
            className="pointer-hero-field"
            aria-hidden="true"
          />,
          heroHost,
        )}
    </>
  );
}
