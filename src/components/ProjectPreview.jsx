import {
  BookOpen,
  CalendarDays,
  Code2,
  HeartPulse,
  Smartphone,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import ProjectMedia from "./ProjectMedia";

const icons = {
  mobile: Smartphone,
  health: HeartPulse,
  research: BookOpen,
  booking: CalendarDays,
};

// These are editorial project maps, not invented application screenshots.
export default function ProjectPreview({ project }) {
  const { tr } = useLanguage();
  const Icon = icons[project.type] || Code2;
  return (
    <div className={`project-visual project-preview ${project.type}`}>
      {project.screenshot ? (
        <ProjectMedia src={project.screenshot} alt={`${tr(project.name)} — ${tr("Application preview")}`} />
      ) : (
        <>
          <div className="preview-grid" aria-hidden="true" />
          <div className="preview-window">
            <div className="preview-window-bar">
              <span className="preview-lights" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>{tr("Project overview")}</span>
              <Code2 size={16} aria-hidden="true" />
            </div>
            <div className="preview-identity">
              <span className="project-symbol">
                <Icon size={23} aria-hidden="true" />
              </span>
              <span className="preview-project-name" dir="auto">
                {project.name}
              </span>
            </div>
            <p className="preview-tagline">{tr(project.tagline)}</p>
            <div className="preview-focus">
              <span className="preview-focus-label">{tr("Project focus")}</span>
              <ul>
                {project.features.slice(0, 3).map((feature, index) => (
                  <li key={feature}>
                    <span aria-hidden="true">0{index + 1}</span>
                    {tr(feature)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <span className="preview-caption">
            {tr("Conceptual project map")}
          </span>
        </>
      )}
    </div>
  );
}
