import { useLanguage } from "../LanguageContext";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Code2,
  ExternalLink,
  GitFork,
  HeartPulse,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { profile, projects } from "../data";
import SectionAvatar from "./SectionAvatar";

const externalProps = { target: "_blank", rel: "noopener noreferrer" };
const filters = ["All work", "Mobile", "Web", "AI"];
const filterTypes = {
  Mobile: ["mobile", "health"],
  Web: ["research", "booking"],
  AI: ["health"],
};
const projectIcons = {
  mobile: Smartphone,
  health: HeartPulse,
  research: BookOpen,
  booking: CalendarDays,
};

function ProjectVisual({ project }) {
  const { tr } = useLanguage();
  const Icon = projectIcons[project.type] || Code2;
  const word =
    project.id === "tmc-web"
      ? "TMC"
      : project.id === "uwc"
        ? "UWC"
        : project.name;

  return (
    <div
      className={`project-visual ${project.type}`}
      style={{ "--project-accent": project.accent }}
      aria-hidden="true"
    >
      <div className="visual-grid" />
      <div className="visual-orbit" />
      <div className="visual-orbit visual-orbit-two" />
      <div className="visual-nodes">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={`visual-node visual-node-${index + 1}`}
          />
        ))}
      </div>
      <span className="visual-index">{project.number} / SELECTED WORK</span>
      <Code2 className="visual-code" size={18} strokeWidth={1.3} />
      <div className="project-symbol">
        <Icon strokeWidth={1.15} />
      </div>
      <span className="visual-word">{word}</span>
      <span className="visual-caption">{tr(project.tagline)}</span>
    </div>
  );
}

function resetPointer(element) {
  if (!element) return;
  element.style.setProperty("--rotate-x", "0deg");
  element.style.setProperty("--rotate-y", "0deg");
  element.style.setProperty("--pointer-active", "0");
}

function ProjectCard({ project, onOpen, motion }) {
  const { tr } = useLanguage();
  const cardRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!motion) resetPointer(cardRef.current);
  }, [motion]);

  function trackPointer(event) {
    if (
      !motion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left) / bounds.width),
    );
    const y = Math.max(
      0,
      Math.min(1, (event.clientY - bounds.top) / bounds.height),
    );
    card.style.setProperty("--pointer-x", `${x * 100}%`);
    card.style.setProperty("--pointer-y", `${y * 100}%`);
    card.style.setProperty("--rotate-x", `${(0.5 - y) * 5}deg`);
    card.style.setProperty("--rotate-y", `${(x - 0.5) * 5}deg`);
    card.style.setProperty("--pointer-active", "1");
  }

  return (
    <article
      ref={cardRef}
      className="project-card"
      data-project={project.id}
      style={{ "--project-accent": project.accent }}
      onPointerMove={trackPointer}
      onPointerLeave={(event) => resetPointer(event.currentTarget)}
      onPointerCancel={(event) => resetPointer(event.currentTarget)}
      onBlur={(event) => resetPointer(event.currentTarget)}
    >
      <ProjectVisual project={project} />
      <div className="project-info">
        <div className="project-meta">
          <span>{tr(project.category)}</span>
          <span>{project.number}</span>
        </div>
        <div className="project-title">
          <h3 id={titleId}>{tr(project.name)}</h3>
          <button
            className="project-open"
            type="button"
            onClick={() => onOpen(project)}
            aria-label={`${tr("Explore")} ${project.name}`}
            aria-haspopup="dialog"
          >
            <ArrowUpRight size={21} aria-hidden="true" />
          </button>
        </div>
        <p>{tr(project.description)}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tr(tag)}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Projects({ onOpen, motion = true }) {
  const { tr } = useLanguage();
  const [filter, setFilter] = useState("All work");
  const visibleProjects = projects.filter(
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
          <h2 id="projects-heading">
            {tr("Ideas made")} <span className="serif">{tr("real.")}</span>
          </h2>
          <p>
            {tr("A few projects that reflect how I think,")}
            <br />
            {tr("build, and solve problems.")}
          </p>
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
      <div id="project-grid" className="project-grid">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={onOpen}
            motion={motion}
          />
        ))}
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
      <ProjectVisual project={project} />
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
            alt={`${tr(project.name)} application screenshot`}
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
