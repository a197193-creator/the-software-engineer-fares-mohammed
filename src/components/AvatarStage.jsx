import { useEffect, useRef, useState } from "react";

function getCapability(motion) {
  if (typeof window === "undefined")
    return { enabled: false, reason: "static" };
  if (!motion) return { enabled: false, reason: "motion-paused" };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return { enabled: false, reason: "reduced-motion" };
  if (window.innerWidth <= 767) return { enabled: false, reason: "mobile" };
  if (navigator.connection?.saveData)
    return { enabled: false, reason: "save-data" };
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if ((memory && memory <= 4) || (cores && cores <= 2))
    return { enabled: false, reason: "limited-device" };
  return { enabled: true, reason: null };
}

/**
 * A decorative, progressively enhanced canvas. The ordinary hero image remains
 * the accessible/static fallback; only hide it when onReady reports rendered.
 * onProgress is 0–1. onReady receives { mode, rendered, reason? }.
 */
export default function AvatarStage({
  motion = true,
  activeSection = "home",
  theme = "dark",
  modelUrl = null,
  onProgress,
  onReady,
}) {
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const callbacks = useRef({ onProgress, onReady });
  const options = useRef({ activeSection, theme });
  callbacks.current = { onProgress, onReady };
  options.current = { activeSection, theme };
  const [capability, setCapability] = useState(() => getCapability(motion));

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    const update = () => {
      const next = getCapability(motion);
      setCapability((previous) =>
        previous.enabled === next.enabled && previous.reason === next.reason
          ? previous
          : next,
      );
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    reducedMotion.addEventListener?.("change", update);
    connection?.addEventListener?.("change", update);
    return () => {
      window.removeEventListener("resize", update);
      reducedMotion.removeEventListener?.("change", update);
      connection?.removeEventListener?.("change", update);
    };
  }, [motion]);

  useEffect(() => {
    if (!capability.enabled) {
      callbacks.current.onProgress?.(1);
      callbacks.current.onReady?.({
        mode: "static",
        rendered: false,
        reason: capability.reason,
      });
      return undefined;
    }
    const controller = new AbortController();
    let handle;
    const report = (result) => {
      if (!controller.signal.aborted) callbacks.current.onReady?.(result);
    };
    callbacks.current.onProgress?.(0);

    // This import is never reached on mobile, reduced motion or limited devices.
    import("./AvatarScene.js")
      .then(async ({ createAvatarScene }) => {
        if (controller.signal.aborted || !hostRef.current) return;
        handle = await createAvatarScene(hostRef.current, {
          ...options.current,
          modelUrl,
          signal: controller.signal,
          onProgress: (value) => {
            if (!controller.signal.aborted)
              callbacks.current.onProgress?.(value);
          },
          onReady: report,
          onError: () =>
            report({
              mode: "static",
              rendered: false,
              reason: "graphics-unavailable",
            }),
        });
        if (controller.signal.aborted) handle.dispose();
        else {
          sceneRef.current = handle;
          handle.setOptions(options.current);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          callbacks.current.onProgress?.(1);
          report({
            mode: "static",
            rendered: false,
            reason: "graphics-unavailable",
          });
        }
      });

    return () => {
      controller.abort();
      handle?.dispose();
      sceneRef.current = null;
    };
  }, [capability.enabled, capability.reason, modelUrl]);

  useEffect(() => {
    sceneRef.current?.setOptions({ activeSection, theme });
  }, [activeSection, theme]);

  return capability.enabled ? (
    <div className="avatar-stage" ref={hostRef} aria-hidden="true" />
  ) : null;
}
