import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Sun,
  Moon,
  Menu,
  X,
  Smartphone,
  Globe,
  Database,
  Sparkles,
  MapPin,
  Compass,
  Download,
  GitFork,
  Mail,
  Copy,
  Check,
  Network,
  MessageCircle,
  GraduationCap,
  Code2,
} from "lucide-react";
import { profile, projects } from "./data";
import AvatarStage from "./components/AvatarStage";
import Projects, { ProjectDialog } from "./components/Projects";
import Guide from "./components/Guide";
import { Cursor, Magnetic, Preloader } from "./components/Effects";
import { useMotion, usePageTracking } from "./hooks/useMotion";

const external = { target: "_blank", rel: "noopener noreferrer" };
const navItems = [
  ["about", "About"],
  ["skills", "Toolkit"],
  ["projects", "Work"],
  ["experience", "Journey"],
  ["contact", "Contact"],
];
const toolkit = [
  {
    Icon: Smartphone,
    title: "Mobile development",
    desc: "Useful experiences, built for everyday life.",
    tags: ["Flutter", "Dart", "Kotlin", "Android"],
  },
  {
    Icon: Globe,
    title: "Web development",
    desc: "Clear interfaces that connect people to information.",
    tags: ["HTML", "CSS", "JavaScript", "WordPress"],
  },
  {
    Icon: Database,
    title: "Backend & data",
    desc: "The structure behind a reliable application.",
    tags: ["Supabase", "Firebase", "SQLite"],
  },
  {
    Icon: Sparkles,
    title: "AI integration",
    desc: "Making intelligent tools practical and accessible.",
    tags: ["Groq AI", "AI-assisted apps", "OCR"],
  },
];
const titles = [
  "Software Engineering student",
  "Mobile & web developer",
  "Curious problem solver",
];
function stored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function AvatarAnchor({ section, pose, className = "" }) {
  return (
    <div
      className={`avatar-anchor ${className}`}
      data-avatar-anchor={section}
      aria-hidden="true"
    >
      <img
        className="avatar-fallback"
        src={`/assets/avatar-${pose}.webp`}
        alt=""
        width="418"
        height="627"
        loading={section === "home" ? "eager" : "lazy"}
        fetchPriority={section === "home" ? "high" : "auto"}
      />
    </div>
  );
}
function Heading({ number, label, children }) {
  return (
    <>
      <div className="eyebrow">
        <span>{number} /</span> {label}
      </div>
      <h2>{children}</h2>
    </>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  const [navHidden, setNavHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState(() => stored("fares-theme", "dark"));
  const [motion, setMotion] = useState(
    () =>
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      stored("fares-motion", "on") !== "off",
  );
  const [rendered, setRendered] = useState(false);
  const [assetReady, setAssetReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tourSignal, setTourSignal] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const menuButton = useRef(null);
  const menuRef = useRef(null);
  const dismissLoader = useCallback(() => setLoading(false), []);
  const onAvatarReady = useCallback((info) => {
    setRendered(info.rendered);
    setAssetReady(true);
    setProgress(1);
  }, []);
  usePageTracking(setActive, setNavHidden);
  useMotion(motion, menuOpen || !!selected || loading, !loading);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0d0e12" : "#f3f1ed");
    try {
      localStorage.setItem("fares-theme", theme);
    } catch {
      /* Storage is optional. */
    }
  }, [theme]);
  useEffect(() => {
    document.documentElement.classList.toggle("motion-off", !motion);
    try {
      localStorage.setItem("fares-motion", motion ? "on" : "off");
    } catch {
      /* Storage is optional. */
    }
    if (!motion) return;
    const timer = setInterval(
      () => setTitleIndex((i) => (i + 1) % titles.length),
      3600,
    );
    return () => clearInterval(timer);
  }, [motion]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = (e) => {
      if (e.matches) setMotion(false);
    };
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector("a")?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab") {
        const items = [
          ...menuRef.current.querySelectorAll("a"),
          menuButton.current,
        ];
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items.at(-1).focus();
        } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
          e.preventDefault();
          items[0].focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", key);
    };
  }, [menuOpen]);

  function goTo(id) {
    setMenuOpen(false);
    setActive(id);
    setNavHidden(false);
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: motion ? "smooth" : "instant",
        block: "start",
      });
    history.replaceState(null, "", `#${id}`);
  }
  const jump = (id) => (e) => {
    e.preventDefault();
    goTo(id);
  };
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }
  return (
    <div className={rendered ? "site scene-ready" : "site"}>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <header
        className={`header ${navHidden && !menuOpen ? "nav-hidden" : ""}`}
      >
        <a
          className="brand"
          href="#home"
          onClick={jump("home")}
          aria-label="Fares Mohammed home"
        >
          <span className="brand-mark">
            f<span>.</span>
          </span>
          <span>
            FARES
            <br />
            <strong>MOHAMMED</strong>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([id, label]) => (
            <a
              href={`#${id}`}
              onClick={jump(id)}
              key={id}
              className={active === id ? "current" : ""}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            className="header-connect"
            href="#contact"
            onClick={jump("contact")}
          >
            Let’s connect <ArrowUpRight size={16} />
          </a>
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {menuOpen && (
        <nav
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {navItems.map(([id, label], i) => (
            <a href={`#${id}`} key={id} onClick={jump(id)}>
              <span>0{i + 2}</span>
              {label}
              <ArrowUpRight />
            </a>
          ))}
          <p>FARES MOHAMMED · MALAYSIA</p>
        </nav>
      )}

      <AvatarStage
        motion={motion}
        activeSection={active}
        theme={theme}
        modelUrl={null}
        onProgress={setProgress}
        onReady={onAvatarReady}
      />
      <main>
        <section id="home" className="hero page-width">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> SOFTWARE ENGINEER IN THE MAKING
            </div>
            <h1>
              <span className="hero-line">
                <span className="hero-word">Hi, I’m Fares.</span>
              </span>
              <span className="hero-line">
                <span className="hero-word">Ideas into</span>
              </span>
              <span className="hero-line">
                <span className="hero-word accent-text">
                  real things<span className="period">.</span>
                </span>
              </span>
            </h1>
            <div className="hero-role">
              <span className="role-line" />
              <span key={titleIndex}>{titles[titleIndex]}</span>
            </div>
            <p className="hero-description">
              Building practical digital solutions
              <br />
              with mobile, web & AI.
            </p>
            <div className="hero-actions">
              <Magnetic
                href="#projects"
                onClick={jump("projects")}
                className="primary"
              >
                View my work <ArrowUpRight size={19} />
              </Magnetic>
              <button
                className="text-button"
                onClick={() => {
                  goTo("home");
                  setTourSignal((v) => v + 1);
                }}
              >
                <Compass size={18} /> Take a guided tour
              </button>
            </div>
            <div className="hero-location">
              <MapPin size={14} />
              <span>Based in Malaysia</span>
              <span className="small-dot" />
              <span>Studying at UKM</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-orbit" />
            <div className="hero-glow" />
            <span className="art-top">
              A LITTLE CHARACTER.
              <br />
              <b>A LOT OF CURIOSITY.</b>
            </span>
            <span className="art-cross cross-a">+</span>
            <span className="art-cross cross-b">+</span>
            <AvatarAnchor section="home" pose={0} />
            <div className="art-label">
              <span className="status-dot" />
              <span>BUILD. LEARN. ITERATE.</span>
              <Code2 size={16} />
            </div>
            <span className="art-coordinate">MALAYSIA / UTC+08</span>
          </div>
          <div className="hero-bottom">
            <a href="#about" onClick={jump("about")}>
              <span className="scroll-hint">
                <ArrowDown size={15} />
              </span>{" "}
              SCROLL TO DISCOVER
            </a>
            <span>PORTFOLIO — 2026</span>
            <span className="hero-index">01 / 06</span>
          </div>
        </section>

        <section id="about" className="section page-width about-section">
          <div className="about-art">
            <span className="outline-word" aria-hidden="true">
              CURIOUS.
            </span>
            <div className="about-orbit" />
            <AvatarAnchor section="about" pose={4} />
            <div className="about-art-note">
              <Sparkles size={20} />
              <span>
                THE PERSON
                <br />
                <strong>BEHIND THE CODE.</strong>
              </span>
            </div>
          </div>
          <div className="about-copy" data-reveal>
            <Heading number="02" label="A LITTLE ABOUT ME">
              A builder.
              <br />A problem solver.
              <br />
              <span className="muted-text">Still curious.</span>
            </Heading>
            <p>
              I’m a Software Engineering student at Universiti Kebangsaan
              Malaysia (UKM), interested in building practical software that
              solves real problems.
            </p>
            <p>
              My work spans mobile and web development, with a particular
              interest in Flutter, AI-powered applications, databases and
              digital solutions.
            </p>
            <p>
              I enjoy taking an idea from a simple concept and turning it into
              something people can actually use.
            </p>
            <div className="about-facts">
              <div>
                <strong>{String(projects.length).padStart(2, "0")}</strong>
                <span>Selected projects</span>
              </div>
              <div>
                <strong>
                  UKM<span> ↗</span>
                </strong>
                <span>Software Engineering</span>
              </div>
            </div>
            {profile.cv ? (
              <a className="text-link" href={profile.cv} download>
                <Download size={16} /> Download my CV
              </a>
            ) : (
              <span className="cv-note">
                <Download size={15} /> Updated CV coming soon
              </span>
            )}
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <div className="page-width">
            <div className="section-heading" data-reveal>
              <div>
                <Heading number="03" label="MY TOOLKIT">
                  Good tools.
                  <br />
                  <span className="muted-text">Better possibilities.</span>
                </Heading>
              </div>
              <p>
                I choose the technology that fits the problem.
                <br />
                And keep learning along the way.
              </p>
            </div>
            <div className="skills-layout">
              <div className="skills-art">
                <div className="skills-ring" />
                <AvatarAnchor section="skills" pose={1} />
                <span className="orbit-badge badge-one">
                  <Code2 size={18} /> Flutter
                </span>
                <span className="orbit-badge badge-two">
                  <Sparkles size={18} /> AI
                </span>
                <span className="orbit-badge badge-three">
                  <Database size={18} /> Data
                </span>
              </div>
              <div className="skills-grid">
                {toolkit.map(({ Icon, title, desc, tags }, i) => (
                  <article className="skill-card" key={title} data-reveal>
                    <div className="skill-top">
                      <Icon size={24} strokeWidth={1.4} />
                      <span>0{i + 1}</span>
                    </div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <div className="skill-tags">
                      {tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div
            className="marquee"
            aria-label="Flutter, Dart, JavaScript, Supabase, Firebase, Groq AI, WordPress, SQLite"
          >
            <div className="marquee-track" aria-hidden="true">
              {[0, 1].map((copy) => (
                <div className="marquee-group" key={copy}>
                  {[
                    "Flutter",
                    "Dart",
                    "JavaScript",
                    "Supabase",
                    "Firebase",
                    "Groq AI",
                    "WordPress",
                    "SQLite",
                  ].map((t) => (
                    <span key={t}>
                      <span>✳</span>
                      {t}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Projects onOpen={setSelected} motion={motion} />

        <section
          id="experience"
          className="section page-width experience-section"
        >
          <div className="section-heading" data-reveal>
            <div>
              <Heading number="05" label="THE JOURNEY">
                Code meets
                <br />
                <span className="muted-text">context.</span>
              </Heading>
            </div>
            <p>
              Real teams. Real needs.
              <br />A broader perspective on building software.
            </p>
          </div>
          <div className="experience-layout">
            <div className="timeline">
              <div className="timeline-track">
                <div className="timeline-fill" />
              </div>
              <article className="timeline-entry" data-reveal>
                <div className="timeline-dot" />
                <div className="timeline-date">
                  SEP 2026 — JAN 2027{" "}
                  <span className="in-progress">In progress</span>
                </div>
                <h3>Software Engineering Intern</h3>
                <p className="organization">
                  UMBI / The Malaysian Cohort (TMC)
                </p>
                <p>
                  Contributing to mobile and web development in a research
                  environment at Universiti Kebangsaan Malaysia.
                </p>
                <ul>
                  <li>
                    Mobile application development for the MyCohort application.
                  </li>
                  <li>
                    Website development and improvements for research and
                    publication management.
                  </li>
                  <li>
                    Translating practical research needs into usable digital
                    solutions.
                  </li>
                </ul>
                <div className="tags">
                  <span>Mobile & web</span>
                  <span>Research systems</span>
                  <span>UKM</span>
                </div>
              </article>
              <article className="timeline-entry" data-reveal>
                <div className="timeline-dot" />
                <div className="timeline-date">UKM COURSEWORK</div>
                <h3>Project Team Leader</h3>
                <p className="organization">
                  University software & group projects
                </p>
                <p>
                  Coordinating student teams, organizing responsibilities and
                  helping ideas move from planning to delivery.
                </p>
              </article>
              <article className="timeline-entry" data-reveal>
                <div className="timeline-dot" />
                <div className="timeline-date">
                  <GraduationCap size={16} /> EDUCATION
                </div>
                <h3>Software Engineering</h3>
                <p className="organization">Universiti Kebangsaan Malaysia</p>
                <p>Learning by building, questioning and connecting ideas.</p>
              </article>
            </div>
            <div className="experience-art">
              <span className="outline-word" aria-hidden="true">
                EVOLVING.
              </span>
              <AvatarAnchor section="experience" pose={3} />
              <span className="experience-note">
                EVERY PROJECT.
                <br />
                ANOTHER STEP FORWARD.
              </span>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="page-width">
            <div className="eyebrow" data-reveal>
              <span>06 /</span> WHAT’S NEXT?
            </div>
            <div className="contact-layout">
              <div className="contact-copy" data-reveal>
                <h2>
                  Have something
                  <br />
                  in <span className="accent-text">mind?</span>
                  <ArrowUpRight className="contact-arrow" strokeWidth={1} />
                </h2>
                <p>
                  A project, an opportunity, or just a good conversation.
                  <br />
                  I’d love to hear from you.
                </p>
                {profile.email ? (
                  <div className="email-row">
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    <button
                      className="icon-button"
                      aria-label={copied ? "Email copied" : "Copy email"}
                      onClick={copyEmail}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                    <span role="status">{copied ? "Copied!" : ""}</span>
                  </div>
                ) : (
                  <Magnetic
                    className="primary"
                    href={profile.github}
                    {...external}
                  >
                    <GitFork size={18} /> Find me on GitHub{" "}
                    <ArrowUpRight size={18} />
                  </Magnetic>
                )}
                <p className="contact-note">
                  More ways to connect coming soon.
                </p>
              </div>
              <div className="contact-art">
                <div className="contact-glow" />
                <AvatarAnchor section="contact" pose={5} />
              </div>
            </div>
            <div className="contact-bottom">
              <div className="social-links">
                <a href={profile.github} {...external}>
                  GitHub <ArrowUpRight size={16} />
                </a>
                {profile.linkedin && (
                  <a href={profile.linkedin} {...external}>
                    <Network size={16} /> LinkedIn
                  </a>
                )}
                {profile.whatsapp && (
                  <a href={profile.whatsapp} {...external}>
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`}>
                    <Mail size={16} /> Email
                  </a>
                )}
              </div>
              <span>
                <MapPin size={14} /> Malaysia · UTC+8
              </span>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer page-width">
        <span>© {new Date().getFullYear()} Fares Mohammed</span>
        <span>Built with intention. Always evolving.</span>
        <button onClick={() => goTo("home")}>
          Back to top <ArrowUp size={15} />
        </button>
      </footer>
      <Guide
        active={active}
        goTo={goTo}
        motion={motion}
        setMotion={setMotion}
        tourSignal={tourSignal}
      />
      {selected && (
        <ProjectDialog project={selected} close={() => setSelected(null)} />
      )}
      <Cursor enabled={motion && !loading} />
      {loading && (
        <Preloader
          progress={progress}
          ready={assetReady}
          dismiss={dismissLoader}
        />
      )}
    </div>
  );
}
