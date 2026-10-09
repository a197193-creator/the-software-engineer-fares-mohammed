import { useEffect } from "react";

export const desktopPointerQuery = "(hover: hover) and (pointer: fine)";
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Pointer values are transient DOM styles, never React state or GSAP transforms.
export function usePointerSurface(ref, { enabled, kind }) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const pointer = window.matchMedia(desktopPointerQuery);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let bounds = null;
    let x = 0.5;
    let y = 0.5;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      bounds = null;
      element.removeAttribute("data-pointer-active");
      for (const [property, value] of Object.entries({
        "--mx": "0px",
        "--my": "0px",
        "--rotate-x": "0deg",
        "--rotate-y": "0deg",
        "--pointer-active": "0",
      }))
        element.style.setProperty(property, value);
    };
    reset();
    if (!enabled) return;
    const allowed = (event) =>
      event.pointerType === "mouse" &&
      pointer.matches &&
      !reduced.matches &&
      !document.hidden &&
      !document.documentElement.classList.contains("motion-off");
    const paint = () => {
      frame = 0;
      element.dataset.pointerActive = "true";
      if (kind === "magnet") {
        element.style.setProperty("--mx", `${((x - 0.5) * 8).toFixed(2)}px`);
        element.style.setProperty("--my", `${((y - 0.5) * 6).toFixed(2)}px`);
      } else {
        element.style.setProperty("--pointer-x", `${(x * 100).toFixed(2)}%`);
        element.style.setProperty("--pointer-y", `${(y * 100).toFixed(2)}%`);
        element.style.setProperty(
          "--rotate-x",
          `${((0.5 - y) * 3).toFixed(2)}deg`,
        );
        element.style.setProperty(
          "--rotate-y",
          `${((x - 0.5) * 3).toFixed(2)}deg`,
        );
        element.style.setProperty("--pointer-active", "1");
      }
    };
    const move = (event) => {
      if (!allowed(event)) {
        reset();
        return;
      }
      // Read geometry once per entry, then batch writes once per display frame.
      bounds ||= element.getBoundingClientRect();
      x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const press = () => {
      if (kind === "magnet") reset();
    };
    const geometry = () => {
      if (frame || element.hasAttribute("data-pointer-active")) reset();
      else bounds = null;
    };
    const events = [
      [element, "pointerenter", move],
      [element, "pointermove", move],
      [element, "pointerleave", reset],
      [element, "pointercancel", reset],
      [element, "pointerdown", press],
      [element, "focusin", reset],
      [window, "scroll", geometry],
      [window, "resize", geometry],
      [window, "blur", reset],
      [document, "visibilitychange", reset],
    ];
    events.forEach(([target, event, handler]) =>
      target.addEventListener(event, handler, { passive: true }),
    );
    pointer.addEventListener("change", reset);
    reduced.addEventListener("change", reset);
    return () => {
      events.forEach(([target, event, handler]) =>
        target.removeEventListener(event, handler),
      );
      pointer.removeEventListener("change", reset);
      reduced.removeEventListener("change", reset);
      reset();
    };
  }, [ref, enabled, kind]);
}
