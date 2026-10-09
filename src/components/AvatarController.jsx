import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { avatarScenes, loadAvatarPose } from "../avatarPoseRegistry";
import { guideSections } from "../guideDialogue";
import { useAvatarGuide } from "./AvatarGuideContext";
import { useAvatarMotion } from "../hooks/useAvatarMotion";

function DockedPose({ pose, departing, motion }) {
  const ref = useRef(null);
  const layer = useRef(null);
  const scene = avatarScenes[pose.section];
  useAvatarMotion(ref, { section: pose.section, enabled: motion, departing });
  useEffect(() => {
    // Reversing an in-flight dissolve starts from its current opacity.
    const tween = gsap.to(layer.current, {
      opacity: departing ? 0 : 1,
      duration: departing ? 0.38 : 0.55,
      ease: "power2.out",
      overwrite: true,
    });
    return () => tween.kill();
  }, [departing]);
  return createPortal(
    <div
      ref={layer}
      className="avatar-motion-dock"
      style={{ opacity: 0 }}
      data-departing={departing}
      data-section={pose.section}
      data-pose={scene.pose}
      data-intent={scene.intent}
      aria-hidden="true"
    >
      <div className="avatar-motion-spring" ref={ref}>
        <div className="avatar-motion-entry">
          <div className="avatar-motion-breath">
            <img
              src={pose.src}
              alt=""
              width="600"
              height="850"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>,
    pose.node,
  );
}

// Persistent controller; short overlapping dissolves remain inside authored art slots.
// Never carry a full-body image across text or project controls.
export default function AvatarController() {
  const { section, available, motion } = useAvatarGuide();
  const [poses, setPoses] = useState({ current: null, previous: null });
  const enabled = available && motion;

  useEffect(() => {
    if (!enabled) {
      setPoses({ current: null, previous: null });
      return;
    }
    let live = true;
    const node = document.querySelector(`[data-avatar-slot="${section}"]`);
    // Hero's existing large portrait is animated by PortfolioHero, without duplication.
    if (!node) {
      setPoses((old) => ({ current: null, previous: old.current }));
      return;
    }
    loadAvatarPose(section).then((src) => {
      if (!live || !node.isConnected) return;
      if (!src) {
        setPoses((old) => ({ current: null, previous: old.current }));
        return;
      }
      setPoses((old) =>
        old.current?.section === section
          ? old
          : { current: { section, src, node }, previous: old.current },
      );
    });
    return () => {
      live = false;
    };
  }, [section, enabled]);

  useEffect(() => {
    if (!poses.previous) return;
    const timer = setTimeout(
      () => setPoses((old) => ({ ...old, previous: null })),
      650,
    );
    return () => clearTimeout(timer);
  }, [poses.previous]);

  useEffect(() => {
    if (!available) return;
    // Warm only the current and neighboring poses after Welcome has finished.
    const index = guideSections.indexOf(section);
    const preload = () =>
      guideSections.slice(Math.max(0, index - 1), index + 2).forEach((id) => {
        void loadAvatarPose(id);
      });
    const timer = setTimeout(preload, 180);
    return () => clearTimeout(timer);
  }, [available, section]);

  if (!enabled) return null;
  return (
    <>
      {poses.previous && (
        <DockedPose
          key={poses.previous.section}
          pose={poses.previous}
          departing
          motion={motion}
        />
      )}
      {poses.current && (
        <DockedPose
          key={poses.current.section}
          pose={poses.current}
          departing={false}
          motion={motion}
        />
      )}
    </>
  );
}
