import { welcomeCopy } from "../locales";
import LandscapeScene from "./LandscapeScene";

// Resolution-independent artwork. Only the finishing layer signals completion.
export default function CinematicTransition({ language, onFinish }) {
  const text = welcomeCopy[language];
  return (
    <div
      className="cinematic-transition"
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <LandscapeScene variant="transition" motion={true} />
      <div
        className="intro-sequence"
        onAnimationEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.animationName === "intro-sequence"
          )
            onFinish();
        }}
      >
        <div className="intro-geometry" aria-hidden="true">
          <span className="intro-orbit orbit-one" />
          <span className="intro-orbit orbit-two" />
          <span className="intro-orbit orbit-three" />
          <span className="intro-axis axis-one" />
          <span className="intro-axis axis-two" />
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <i className={`intro-star star-${index}`} key={index} />
          ))}
        </div>
        <div className="intro-message" role="status" aria-live="polite">
          <div className="intro-seal" aria-hidden="true">
            <span>F</span>
          </div>
          <p className="intro-identity">{text.introIdentity}</p>
          <h2 className="intro-greeting">{text.introHeading}</h2>
          <p className="intro-world">{text.introSubtitle}</p>
          <p className="intro-note">{text.introNote}</p>
          <span className="intro-trace" aria-hidden="true">
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
