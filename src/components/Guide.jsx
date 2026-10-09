import { Compass, Pause, Play } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useAvatarGuide } from "./AvatarGuideContext";

// Visit-wide controls stay in normal document flow; section bubbles live by avatars.
export default function Guide({ goTo, motion, setMotion }) {
  const { guide, tr } = useLanguage();
  const { mode, section, changeMode } = useAvatarGuide();
  return (
    <aside
      className="avatar-guide-tools page-width"
      aria-label={tr("Portfolio guide")}
    >
      <span>
        <Compass size={17} aria-hidden="true" />
        {guide.label}
        <small>
          {mode === "expanded"
            ? guide.following
            : mode === "dismissed"
              ? guide.dismissed
              : guide.minimized}
        </small>
      </span>
      <div>
        <button
          type="button"
          onClick={() => {
            if (mode === "expanded") changeMode("minimized");
            else {
              changeMode("expanded");
              goTo(section);
            }
          }}
        >
          {mode === "expanded" ? guide.minimize : guide.show}
        </button>
        <button type="button" onClick={() => goTo("projects")}>
          {tr("Projects")}
        </button>
        <button type="button" onClick={() => goTo("contact")}>
          {tr("Contact")}
        </button>
        <button
          type="button"
          aria-pressed={!motion}
          onClick={() => setMotion(!motion)}
        >
          {motion ? <Pause size={14} /> : <Play size={14} />}
          {tr(motion ? "Pause motion" : "Enable motion")}
        </button>
      </div>
    </aside>
  );
}
