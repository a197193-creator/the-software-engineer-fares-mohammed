import { useEffect, useId, useRef, useState } from "react";
import { useStoryMotion } from "./StoryTypography";

// ## LANDSCAPE — code-drawn scenery; repeatable reveals without another render loop.
export default function LandscapeScene({ variant = "section", motion: override }) {
  const { motion } = useStoryMotion();
  const animated = override ?? motion;
  const root = useRef(null);
  const id = useId().replace(/:/g, "");
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={root} className={`landscape-scene landscape-${variant}`} data-visible={visible || !animated} data-motion={animated} aria-hidden="true">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${id}-sky`} x2="0" y2="1">
            <stop stopColor="#100c19" /><stop offset="1" stopColor="#3a1326" />
          </linearGradient>
          <linearGradient id={`${id}-mist`} x2="0" y2="1">
            <stop stopColor="#bc636c" stopOpacity=".18" /><stop offset="1" stopColor="#080910" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-moon`}>
            <stop stopColor="#e8a087" /><stop offset=".8" stopColor="#b54459" /><stop offset="1" stopColor="#68253e" />
          </radialGradient>
        </defs>
        <rect width="1200" height="300" fill={`url(#${id}-sky)`} />
        <g className="landscape-far">
          <circle cx="865" cy="75" r="45" fill={`url(#${id}-moon)`} opacity=".72" />
          <path d="M0 155 90 110 150 145 220 73 305 155 390 90 475 147 540 110 660 170 755 112 840 150 935 95 1030 137 1110 98 1200 148V300H0Z" fill="#281326" />
          <path d="M0 205 120 157 220 180 335 124 430 182 535 158 640 205 760 161 865 186 1025 145 1110 178 1200 153V300H0Z" fill="#1a101e" />
        </g>
        <g className="landscape-near">
          <path d="M0 230Q180 194 355 231T690 220T1200 223V300H0Z" fill="#0d0d17" />
          <path d="M440 300 572 206H628L805 300" fill="#17111d" stroke="#f5c66a" strokeOpacity=".12" />
          <path d="M548 229H674M517 251H714M483 276H758" stroke="#40dfff" strokeOpacity=".16" />
          <path d="M556 211V142Q600 76 644 142V211M548 211V138Q600 59 652 138V211" fill="none" stroke="#c78770" strokeOpacity=".48" />
          <path d="M146 256 165 154 187 135M168 198 128 162M169 183 208 151M1050 255 1032 165 1000 143M1033 187 1076 151M1034 173 1047 131" fill="none" stroke="#4c2b36" strokeWidth="7" />
          <g fill="#80364b" opacity=".8">
            <ellipse cx="134" cy="157" rx="38" ry="13" /><ellipse cx="186" cy="137" rx="46" ry="16" /><ellipse cx="207" cy="153" rx="31" ry="12" />
            <ellipse cx="1000" cy="143" rx="39" ry="13" /><ellipse cx="1044" cy="131" rx="42" ry="16" /><ellipse cx="1076" cy="151" rx="34" ry="12" />
          </g>
          <g fill="#e29891" opacity=".65">
            <circle cx="163" cy="143" r="2" /><circle cx="212" cy="146" r="2" /><circle cx="1014" cy="133" r="2" /><circle cx="1068" cy="142" r="2" />
          </g>
          <path d="M0 250Q350 222 650 251T1200 234V300H0Z" fill={`url(#${id}-mist)`} />
        </g>
        <g className="landscape-petals" fill="#d17982" opacity=".48">
          <ellipse cx="254" cy="170" rx="3" ry="1.5" /><ellipse cx="942" cy="194" rx="3" ry="1.5" /><ellipse cx="371" cy="204" rx="2.5" ry="1.3" /><ellipse cx="810" cy="136" rx="2" ry="1" />
        </g>
      </svg>
      <span className="landscape-horizon" />
    </div>
  );
}
