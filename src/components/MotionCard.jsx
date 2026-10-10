import { useRef } from "react";
import { usePointerSurface } from "../hooks/usePointerSurface";
import { useProjectEntrance } from "../hooks/useProjectEntrance";
import { useStoryMotion } from "./StoryTypography";

// Entrance, floating and pointer tilt each own a separate transform layer.
export default function MotionCard({
  as: Tag = "div",
  className = "",
  panelClassName = "",
  children,
  ...props
}) {
  const panel = useRef(null);
  const surface = useRef(null);
  const { motion, ready } = useStoryMotion();
  useProjectEntrance(panel);
  usePointerSurface(surface, { enabled: motion && ready, kind: "card" });
  return (
    <div ref={panel} className={`motion-panel ${panelClassName}`}>
      <div className="motion-card-float">
        <Tag {...props} ref={surface} className={`motion-card ${className}`}>
          {children}
        </Tag>
      </div>
    </div>
  );
}
