import { useId } from "react";

// ## LANGUAGE PORTALS — stable glyphs and CSS timelines, no extra render loop.
const letters = {
  en: ["F", "A", "R", "E", "S", "M"],
  ar: ["ف", "ا", "ر", "س", "م"],
};
const restingPositions = [
  [-34, -24, .76, .38], [1, -36, .8, .45], [35, -20, .88, .55],
  [34, 22, 1, .9], [0, 37, 1.08, 1], [-35, 19, .96, .8],
];
const arabicRestingPositions = [
  [0, -36, .8, .4], [39, -9, .88, .55], [23, 33, 1, .9],
  [-23, 33, 1, .95], [-39, -9, .88, .6],
];

export default function LanguageOrb({ language }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className="language-orb" aria-hidden="true">
      <svg viewBox="0 0 200 200" focusable="false">
        <defs>
          <radialGradient id={`${id}-glass`} cx="38%" cy="30%" r="70%">
            <stop stopColor="currentColor" stopOpacity=".13" />
            <stop offset=".55" stopColor="currentColor" stopOpacity=".035" />
            <stop offset=".87" stopColor="currentColor" stopOpacity=".015" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".12" />
          </radialGradient>
          <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="currentColor" stopOpacity=".7" />
            <stop offset=".45" stopColor="currentColor" stopOpacity=".14" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".5" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="73" fill={`url(#${id}-glass)`} stroke={`url(#${id}-edge)`} strokeWidth=".9" />
        <g className="orb-latitudes" fill="none" stroke="currentColor" strokeWidth=".7">
          <ellipse cx="100" cy="100" rx="72" ry="28" opacity=".25" />
          <ellipse cx="100" cy="100" rx="32" ry="72" opacity=".2" />
          <ellipse cx="100" cy="100" rx="56" ry="72" opacity=".1" />
        </g>
        <g className="orb-orbit-ring" fill="none" stroke="currentColor" strokeWidth="1">
          <ellipse cx="100" cy="100" rx="82" ry="31" transform="rotate(-28 100 100)" opacity=".36" />
          <path d="M44 47A77 77 0 0 1 135 33" opacity=".7" />
        </g>
        {letters[language].map((letter, index) => {
          const [x, y, scale, opacity] = (language === "ar" ? arabicRestingPositions : restingPositions)[index];
          return (
            <g key={letter} className="orb-letter" style={{
              "--letter-x": `${x}px`, "--letter-y": `${y}px`,
              "--letter-scale": scale, "--letter-opacity": opacity,
              "--letter-delay": `${index * (language === "ar" ? -3.6 : -2.8) - (language === "ar" ? 1.4 : 0)}s`,
            }}>
              <text x="100" y="100" dy=".35em" textAnchor="middle" lang={language}>{letter}</text>
            </g>
          );
        })}
      </svg>
    </span>
  );
}
