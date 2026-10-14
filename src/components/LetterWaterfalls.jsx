import { memo } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../LanguageContext";
import { useMotionSettings } from "./MotionSettings";

// ## LETTER WATERFALLS — deterministic glyphs, seamless CSS tracks, no frame loop.
const alphabets = { en: "FARESBUILDCREATESOFTWARE", ar: "فارسبرمجةتصميمابتكار" };
const tracks = Array.from({ length: 5 }, (_, index) => ({
  duration: 16 + index * 2.7,
  delay: -index * 5.3 - 7,
  left: 10 + index * 20,
  opacity: [.48, .25, .62, .32, .42][index],
}));

const Streams = memo(function Streams({ language, side }) {
  const alphabet = Array.from(alphabets[language]);
  return tracks.map((track, column) => {
    const glyphs = Array.from({ length: 18 }, (_, row) => alphabet[(row * 7 + column * 3 + side * 5) % alphabet.length]);
    return <div className="letter-stream" key={column} style={{
      "--stream-duration": `${track.duration + side * 1.8}s`,
      "--stream-delay": `${track.delay - side * 3}s`,
      "--stream-left": `${track.left}%`, "--stream-opacity": track.opacity,
    }}>
      {[0, 1].map(copy => <div className="letter-stream-copy" key={copy}>
        {glyphs.map((letter, row) => <span key={row} data-head={row === 16 || undefined} style={{opacity: .2 + (row % 9) / 10}}>{letter}</span>)}
      </div>)}
    </div>;
  });
});

export default function LetterWaterfalls({ enabled, suspended }) {
  const { language } = useLanguage();
  const { reduced, config, pageActive } = useMotionSettings();
  const moving = enabled && !reduced && config.level !== "subtle";
  return createPortal(<div className="letter-waterfalls" aria-hidden="true" lang={language}
    data-moving={moving} data-active={pageActive && !suspended} data-intensity={config.level}>
    {["left", "right"].map((side, index) => <div className={`letter-waterfall waterfall-${side}`} key={side}>
      <div className="waterfall-light" />
      <Streams language={language} side={index} />
    </div>)}
  </div>, document.body);
}
