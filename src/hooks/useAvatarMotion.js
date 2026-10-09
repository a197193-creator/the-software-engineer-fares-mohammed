import { useEffect } from "react";
import { avatarScenes } from "../avatarPoseRegistry";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// One transform owner on a dedicated wrapper. No React state updates on scroll.
// The spring follows scroll/pointer targets; CSS on an inner node owns idle breathing.
export function useAvatarMotion(
  ref,
  { section, enabled, departing = false, portrait = false },
) {
  useEffect(() => {
    const element = ref.current;
    const owner = document.getElementById(section);
    if (!element || !owner || !enabled || departing) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const figure = element.closest(".section-avatar");
    let frame = 0,
      last = 0,
      visible = false,
      dirty = true;
    let progress = 0.5,
      pointerX = 0,
      pointerY = 0;
    let width = window.innerWidth;
    // A quick backward section change resumes the same layer without snapping.
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    const current = {
      x: matrix.m41,
      y: matrix.m42,
      r: (Math.atan2(matrix.m12, matrix.m11) * 180) / Math.PI,
      s: Math.hypot(matrix.m11, matrix.m12),
    };
    const velocity = { x: 0, y: 0, r: 0, s: 0 };
    const pose = avatarScenes[section].dock;

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      element.dataset.running = "false";
    };
    let paused = false;
    const canRun = () =>
      visible && !paused && !document.hidden && !reduced.matches;
    const wake = () => {
      dirty = true;
      paused =
        figure?.dataset.avatarPaused === "true" ||
        !!figure?.contains(document.activeElement);
      if (!canRun()) {
        stop();
        return;
      }
      element.dataset.running = "true";
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const tick = (time) => {
      frame = 0;
      if (!canRun()) {
        stop();
        return;
      }
      const dt = Math.min((time - (last || time - 16)) / 1000, 0.032);
      last = time;
      if (dirty) {
        const bounds = owner.getBoundingClientRect();
        progress = clamp(
          (window.innerHeight * 0.7 - bounds.top) /
            (bounds.height + window.innerHeight * 0.4),
          0,
          1,
        );
        width = window.innerWidth;
        dirty = false;
        element.style.setProperty("--avatar-progress", progress.toFixed(4));
      }
      const mobile = width < 768;
      const stacked = width < 1100;
      const range = mobile ? 0.22 : stacked ? 0.55 : 1;
      const scroll = (progress - 0.5) * 2;
      const pointer = mobile || !finePointer.matches ? 0 : range;
      const target = {
        x:
          (portrait || stacked ? 0 : pose.x * range) +
          pointerX * pointer * (portrait ? 2 : 4),
        y: scroll * range * (portrait ? 6 : 12) + pointerY * pointer * 2,
        r: portrait
          ? 0
          : (pose.tilt + scroll * 0.4 + pointerX * pointer * 0.3) * range,
        s: portrait ? 1.025 : 1 + progress * range * 0.006,
      };
      for (const key of Object.keys(target)) {
        // Near-critical damping: mass 1, stiffness 170, damping 26.
        velocity[key] +=
          (170 * (target[key] - current[key]) - 26 * velocity[key]) * dt;
        current[key] += velocity[key] * dt;
      }
      element.style.transform = `translate3d(${current.x.toFixed(3)}px,${current.y.toFixed(3)}px,0) rotate(${current.r.toFixed(3)}deg) scale(${current.s.toFixed(5)})`;
      const settled = Object.keys(target).every(
        (key) =>
          Math.abs(target[key] - current[key]) <
            (key === "s" ? 0.00005 : 0.01) &&
          Math.abs(velocity[key]) < (key === "s" ? 0.0005 : 0.03),
      );
      // Idle breathing stays in CSS; the JS spring sleeps after it settles.
      if (!settled) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else stop();
    });
    observer.observe(element);
    const layout = new ResizeObserver(wake);
    layout.observe(owner);
    const interaction = new MutationObserver(wake);
    if (figure)
      interaction.observe(figure, {
        attributes: true,
        attributeFilter: ["data-avatar-paused"],
      });
    const trackPointer = (event) => {
      if (event.pointerType !== "mouse" || width < 768 || !finePointer.matches)
        return;
      pointerX = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointerY = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
      wake();
    };
    const resetPointer = () => {
      pointerX = 0;
      pointerY = 0;
      wake();
    };
    const visibility = () => {
      if (document.hidden) stop();
      else wake();
    };
    const preference = () => {
      if (reduced.matches) {
        stop();
        element.style.transform = "none";
      } else wake();
    };
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });
    window.addEventListener("pointermove", trackPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("focusin", wake);
    reduced.addEventListener("change", preference);
    finePointer.addEventListener("change", resetPointer);
    return () => {
      stop();
      observer.disconnect();
      layout.disconnect();
      interaction.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      window.removeEventListener("pointermove", trackPointer);
      document.documentElement.removeEventListener(
        "pointerleave",
        resetPointer,
      );
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("focusin", wake);
      reduced.removeEventListener("change", preference);
      finePointer.removeEventListener("change", resetPointer);
    };
  }, [ref, section, enabled, departing, portrait]);

  useEffect(() => {
    const element = ref.current;
    if (!enabled && element) {
      element.style.removeProperty("transform");
      element.style.removeProperty("--avatar-progress");
      element.dataset.running = "false";
    }
  }, [ref, enabled]);
}
