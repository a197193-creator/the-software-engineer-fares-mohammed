import { Compass, Pause, Play } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useAvatarGuide } from "./AvatarGuideContext";
import { useMotionSettings } from "./MotionSettings";

// Visit-wide controls stay in normal document flow; section bubbles live by avatars.
export default function Guide({ goTo, motion, setMotion }) {
  const { guide, tr } = useLanguage();
  const { mode, section, changeMode } = useAvatarGuide();
  const settings = useMotionSettings();
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
        <label className="motion-setting">
          <span>{tr("Motion intensity")}</span>
          <select
            aria-label={tr("Motion intensity")}
            value={settings.intensity}
            onChange={(event) => settings.setIntensity(event.target.value)}
          >
            <option value="subtle">{tr("Subtle")}</option>
            <option value="balanced">{tr("Balanced")}</option>
            <option value="cinematic">{tr("Cinematic")}</option>
          </select>
        </label>
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
          disabled={settings.reduced}
          onClick={() => setMotion(!motion)}
        >
          {motion ? <Pause size={14} /> : <Play size={14} />}
          {tr(motion ? "Pause motion" : "Enable motion")}
        </button>
      </div>
      {settings.reduced && (
        <small className="motion-note">
          {tr("Reduced motion is active on your device.")}
        </small>
      )}
    </aside>
  );
}
