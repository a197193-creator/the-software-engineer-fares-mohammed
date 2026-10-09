import { useLanguage } from "../LanguageContext";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  GitFork,
  Sparkles,
  X,
} from "lucide-react";
import { profile, projects } from "../data";
import SectionAvatar from "./SectionAvatar";
import { StoryHeading, StoryStatement } from "./StoryTypography";
import { usePointerSurface } from "../hooks/usePointerSurface";
import { useAvatarGuide } from "./AvatarGuideContext";
import ProjectPreview from "./ProjectPreview";
import { useProjectEntrance } from "../hooks/useProjectEntrance";

const externalProps = { target: "_blank", rel: "noopener noreferrer" };
const filters = ["All work", "Mobile", "Web", "AI"];
const filterTypes = {
  Mobile: ["mobile", "health"],
  Web: ["research", "booking"],
  AI: ["health"],
};
function ProjectCard({ project, onOpen, motion, featured }) {
  const { tr } = useLanguage();
  const cardRef = useRef(null);
  const panelRef = useRef(null);
  useProjectEntrance(panelRef, project.id);
  const titleId = useId();
  const guide = useAvatarGuide();
  usePointerSurface(cardRef, {
    enabled: motion && guide?.available,
    kind: "card",
  });

  return (
    <div
      ref={panelRef}
      className="project-panel"
      data-featured={featured}
      style={{ "--panel-order": Number(project.number) }}
    >
      <div className="project-float">
        <article
          ref={cardRef}
          className="project-card"
          data-project={project.id}
          style={{ "--project-accent": project.accent }}
        >
          <ProjectPreview project={project} />
          <div className="project-info">
            <div className="project-meta">
              <span>{tr(project.category)}</span>
              <span>{featured ? tr("Featured project") : project.number}</span>
            </div>
            <div className="project-title">
              <h3 id={titleId}>{tr(project.name)}</h3>
            </div>
            <p>{tr(project.description)}</p>
            <div className="tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tr(tag)}</span>
              ))}
            </div>
            <details className="project-contribution">
              <summary>{tr("My contribution")}</summary>
              <p>{tr(project.solution)}</p>
            </details>
            <div className="project-card-actions">
              <button
                className="project-open project-detail-button"
                type="button"
                onClick={() => onOpen(project)}
                aria-label={`${tr("Explore")} ${project.name}`}
                aria-haspopup="dialog"
              >
                {tr("View project details")}
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
              {project.github && (
                <a
                  href={project.github}
                  {...externalProps}
                  aria-label={`${tr("GitHub")} — ${project.name}`}
                >
                  <GitFork size={17} aria-hidden="true" />
                  {tr("GitHub")}
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  {...externalProps}
                  aria-label={`${tr("Live demo")} — ${project.name}`}
                >
                  <ExternalLink size={17} aria-hidden="true" />
                  {tr("Live demo")}
                </a>
              )}
            </div>
            <span className="project-context">{tr(project.context)}</span>
          </div>
        </article>
      </div>
    </div>
  );
}

export default function Projects({ onOpen, motion = true }) {
  const { tr } = useLanguage();
  const [filter, setFilter] = useState("All work");
  const visibleProjects = [...projects]
    .sort((a, b) => Number(b.id === "diacare") - Number(a.id === "diacare"))
    .filter(
      (project) =>
        filter === "All work" || filterTypes[filter].includes(project.type),
    );
  return (
    <section
      id="projects"
      className="section page-width projects-section"
      aria-labelledby="projects-heading"
    >
      <div className="section-heading projects-heading">
        <div data-reveal>
          <div className="eyebrow">
            <span>04</span>
            {tr("SELECTED WORK")}
          </div>
          <StoryHeading id="projects-heading">
            {tr("Ideas made")} <span className="serif">{tr("real.")}</span>
          </StoryHeading>
          <StoryStatement>
            {tr("A few projects that reflect how I think,")}
            <br />
            {tr("build, and solve problems.")}
          </StoryStatement>
        </div>
        <SectionAvatar section="projects" motion={motion} compact />
      </div>
      <div className="project-toolbar">
        <div
          className="filters"
          role="group"
          aria-label={tr("Filter projects")}
        >
          {filters.map((label) => (
            <button
              key={label}
              type="button"
              aria-pressed={filter === label}
              aria-controls="project-grid"
              className={filter === label ? "selected" : ""}
              onClick={() => setFilter(label)}
            >
              {tr(label)}
            </button>
          ))}
        </div>
        <span
          className="result-count"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {String(visibleProjects.length).padStart(2, "0")} {tr("PROJECTS")}
        </span>
      </div>
      <div className="project-workspace">
        <div className="workspace-architecture" aria-hidden="true" />
        <div className="workspace-heading">
          <span>
            <span className="workspace-status" aria-hidden="true" />
            {tr("Digital workspace")}
          </span>
          <span>{tr("Select a project to explore")}</span>
        </div>
        <div id="project-grid" className="project-grid">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={onOpen}
              motion={motion}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
      <div className="section-footnote">
        <span>{tr("Every project is another step forward.")}</span>
        <a href={profile.github} {...externalProps}>
          <GitFork size={17} aria-hidden="true" /> {tr("More on GitHub")}{" "}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function ProjectDialog({ project, close }) {
  const { tr, language } = useLanguage();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);

  function closeOnBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={closeOnBackdrop}
    >
      <button
        ref={closeButtonRef}
        className="dialog-close icon-button"
        type="button"
        onClick={close}
        aria-label={tr("Close project")}
      >
        <X aria-hidden="true" />
      </button>
      <ProjectPreview project={project} />
      <div className="dialog-content">
        <div className="eyebrow">
          {tr(project.category)}
          <span> / {tr(project.status)}</span>
        </div>
        <h2 id={titleId}>{tr(project.name)}</h2>
        <p id={descriptionId} className="dialog-intro">
          {tr(project.description)}
        </p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tr(tag)}</span>
          ))}
        </div>
        <div className="case-columns">
          <div>
            <h3>{tr("The problem")}</h3>
            <p>{tr(project.problem)}</p>
          </div>
          <div>
            <h3>{tr("The approach")}</h3>
            <p>{tr(project.solution)}</p>
          </div>
        </div>
        <h3>{tr("Features & focus")}</h3>
        <ul className="features">
          {project.features.map((feature) => (
            <li key={feature}>
              <Check size={16} aria-hidden="true" />
              <span>{tr(feature)}</span>
            </li>
          ))}
        </ul>
        <div className="learning">
          <Sparkles size={21} aria-hidden="true" />
          <div>
            <h3>{tr("What I learned")}</h3>
            <p>{tr(project.learning)}</p>
          </div>
        </div>
        {project.screenshot && (
          <img
            className="case-screenshot"
            src={project.screenshot}
            alt={`${tr(project.name)} — ${tr("Application preview")}`}
            loading="lazy"
          />
        )}
        <div className="case-footer">
          <span>{tr(project.context)}</span>
          {project.github && (
            <a href={project.github} {...externalProps}>
              {tr("GitHub")}
              <GitFork size={17} aria-hidden="true" />
            </a>
          )}
          {project.demo && (
            <a href={project.demo} {...externalProps}>
              {tr("Live demo")}
              <ExternalLink size={17} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}
