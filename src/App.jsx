import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
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
import SectionAvatar, {
  avatarScenes,
  ChapterRail,
} from "./components/SectionAvatar";
import Projects, { ProjectDialog } from "./components/Projects";
import Guide from "./components/Guide";
import { AvatarGuideProvider } from "./components/AvatarGuideContext";
import AvatarController from "./components/AvatarController";
import { Magnetic } from "./components/Effects";
import WelcomeExperience from "./components/WelcomeExperience";
import PortfolioHero from "./components/PortfolioHero";
import SandCursor from "./components/SandCursor";
import CinematicCursor from "./components/CinematicCursor";
import {
  StoryHeading,
  StoryStatement,
  StoryMain,
} from "./components/StoryTypography";
import { useLanguage } from "./LanguageContext";
import { useMotion, usePageTracking } from "./hooks/useMotion";
import { useMotionSettings } from "./components/MotionSettings";
import { motionVariables } from "./motionConfig";
import MotionCard from "./components/MotionCard";
import LandscapeScene from "./components/LandscapeScene";

const external = { target: "_blank", rel: "noopener noreferrer" };
const navItems = [
  ["home", "Home"],
  ["projects", "Projects"],
  ["about", "About"],
  ["skills", "Skills"],
  ["experience", "Experience"],
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
    tags: ["React", "TypeScript", "HTML", "CSS", "JavaScript", "PHP"],
  },
  {
    Icon: Database,
    title: "Backend & data",
    desc: "The structure behind a reliable application.",
    tags: ["Supabase", "PostgreSQL", "Auth", "Storage"],
  },
  {
    Icon: Sparkles,
    title: "AI integration",
    desc: "Making intelligent tools practical and accessible.",
    tags: ["Groq AI", "AI-assisted apps", "Edge Functions"],
  },
];
function stored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function Heading({ number, label, children }) {
  const { tr } = useLanguage();
  return (
    <>
      <div className="eyebrow">
        <span>{number} /</span> {tr(label)}
      </div>
      <StoryHeading>{children}</StoryHeading>
    </>
  );
}

export default function App() {
  const { language, setLanguage, tr } = useLanguage();
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [portfolioReady, setPortfolioReady] = useState(false);
  const [active, setActive] = useState("home");
  const [navHidden, setNavHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState(() => stored("fares-theme", "dark"));
  const [motion, setMotion] = useState(
    () => stored("fares-motion", "on") !== "off",
  );
  const [copied, setCopied] = useState(false);
  const settings = useMotionSettings();
  const mainMotion = motion && !settings.reduced;
  const mainReady = portfolioReady && !welcomeVisible;
  const menuButton = useRef(null);
  const menuRef = useRef(null);
  const navigationFrame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(navigationFrame.current), []);
  usePageTracking(setActive, setNavHidden);
  useMotion(
    mainMotion,
    menuOpen || !!selected || welcomeVisible,
    mainReady,
    language,
  );
  useEffect(() => {
    if (welcomeVisible || !portfolioReady) return;
    const focusTimer = setTimeout(() => {
      document.getElementById("hero-title")?.focus({ preventScroll: true });
    }, 50);
    return () => clearTimeout(focusTimer);
  }, [welcomeVisible, portfolioReady]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#05090b" : "#f3f1ed");
    try {
      localStorage.setItem("fares-theme", theme);
    } catch {
      /* Storage is optional. */
    }
  }, [theme]);
  useEffect(() => {
    document.documentElement.classList.toggle("motion-off", !mainMotion);
    try {
      localStorage.setItem("fares-motion", motion ? "on" : "off");
    } catch {
      /* Storage is optional. */
    }
  }, [motion, mainMotion]);
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
    cancelAnimationFrame(navigationFrame.current);
    const navigate = () => {
      document.getElementById(id)?.scrollIntoView({
        behavior: mainMotion ? "smooth" : "instant",
        block: "start",
      });
    };
    // Let the mobile menu release its scroll lock before measuring the target.
    if (menuOpen) navigationFrame.current = requestAnimationFrame(navigate);
    else navigate();
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
    <AvatarGuideProvider
      ready={portfolioReady && !welcomeVisible}
      blocked={menuOpen || !!selected}
      motion={mainMotion}
      goTo={goTo}
    >
      <div
        className="portfolio-content"
        data-ready={portfolioReady}
        inert={welcomeVisible ? true : undefined}
        aria-hidden={welcomeVisible ? true : undefined}
      >
        <div
          className="site cinematic"
          data-motion-level={settings.config.level}
          data-page-active={settings.pageActive}
          data-motion-blocked={menuOpen || !!selected || !mainReady}
          style={motionVariables(settings.config)}
        >
          <a className="skip-link" href="#about">
            {tr("Skip to content")}
          </a>
          <div className="scroll-progress" aria-hidden="true" />
          <header
            className={`header ${active === "home" ? "on-hero" : ""} ${navHidden && !menuOpen ? "nav-hidden" : ""}`}
          >
            <a
              className="brand"
              href="#home"
              onClick={jump("home")}
              aria-label={tr("Fares Mohammed home")}
            >
              <span className="brand-mark">F</span>
              <span>
                {tr("FARES")}
                <br />
                <strong>{tr("MOHAMMED")}</strong>
              </span>
            </a>
            <nav className="desktop-nav" aria-label={tr("Main navigation")}>
              {navItems.map(([id, label]) => (
                <a
                  href={`#${id}`}
                  onClick={jump(id)}
                  key={id}
                  className={active === id ? "current" : ""}
                  aria-current={active === id ? "location" : undefined}
                >
                  {tr(label)}
                </a>
              ))}
            </nav>
            <div className="header-actions">
              <span className="header-identity" dir="ltr">
                {tr("FARES MOHAMMED")}
                <i /> {avatarScenes[active].number} / 06
              </span>
              <button
                className="language-toggle"
                type="button"
                lang={language === "en" ? "ar" : "en"}
                aria-label={tr("Change language")}
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              >
                {language === "en" ? "العربية" : "English"}
              </button>
              <button
                className="icon-button theme-toggle"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={tr(
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme",
                )}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a
                className="header-connect"
                aria-label={tr("Contact me")}
                href="#contact"
                onClick={jump("contact")}
              >
                <span className="header-contact-label">{tr("Contact me")}</span>
                <Mail className="header-contact-icon" size={17} />
                <ArrowUpRight size={16} />
              </a>
              <button
                ref={menuButton}
                className="icon-button menu-toggle"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                aria-label={tr(
                  menuOpen ? "Close navigation" : "Open navigation",
                )}
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
              aria-label={tr("Mobile navigation")}
            >
              {navItems.map(([id, label]) => (
                <a href={`#${id}`} key={id} onClick={jump(id)}>
                  <span>{avatarScenes[id].number}</span>
                  {tr(label)}
                  <ArrowUpRight />
                </a>
              ))}
              <p>{tr("FARES MOHAMMED · MALAYSIA")}</p>
            </nav>
          )}

          <StoryMain
            motion={mainMotion}
            ready={portfolioReady && !welcomeVisible}
          >
            <PortfolioHero motion={mainMotion} ready={mainReady} goTo={goTo} />

            <ChapterRail goTo={goTo} active={active} />

            <section id="about" className="section page-width about-section">
              <LandscapeScene />
              <div className="about-art">
                <span className="outline-word" aria-hidden="true">
                  {tr("CURIOUS.")}
                </span>
                <div className="about-orbit" />
                <SectionAvatar section="about" motion={mainMotion} />
                <div className="about-art-note">
                  <Sparkles size={20} />
                  <span>
                    {tr("THE PERSON")}
                    <br />
                    <strong>{tr("BEHIND THE CODE.")}</strong>
                  </span>
                </div>
              </div>
              <div className="about-copy" data-reveal>
                <Heading number="02" label="A LITTLE ABOUT ME">
                  {tr("A builder.")}
                  <br />
                  {tr("A problem solver.")}
                  <br />
                  <span className="muted-text">{tr("Still curious.")}</span>
                </Heading>
                <StoryStatement>
                  {tr(
                    "I’m a Software Engineering student at Universiti Kebangsaan Malaysia (UKM), interested in building practical software that solves real problems.",
                  )}
                </StoryStatement>
                <p>
                  {tr(
                    "My work spans mobile and web development, with a particular interest in Flutter, AI-powered applications, databases and digital solutions.",
                  )}
                </p>
                <p>
                  {tr(
                    "I enjoy taking an idea from a simple concept and turning it into something people can actually use.",
                  )}
                </p>
                <div className="about-facts">
                  <MotionCard className="about-fact">
                    <strong>{String(projects.length).padStart(2, "0")}</strong>
                    <span>{tr("Selected projects")}</span>
                  </MotionCard>
                  <MotionCard className="about-fact">
                    <strong>
                      {tr("UKM")}
                      <span> ↗</span>
                    </strong>
                    <span>{tr("Software Engineering")}</span>
                  </MotionCard>
                </div>
                {profile.cv ? (
                  <a className="text-link" href={profile.cv} download>
                    <Download size={16} />
                    {tr("Download my CV")}
                  </a>
                ) : (
                  <span className="cv-note">
                    <Download size={15} />
                    {tr("Updated CV coming soon")}
                  </span>
                )}
              </div>
            </section>

            <section id="skills" className="section skills-section">
              <div className="page-width">
                <LandscapeScene />
                <div className="section-heading" data-reveal>
                  <div>
                    <Heading number="03" label="MY TOOLKIT">
                      {tr("Good tools.")}
                      <br />
                      <span className="muted-text">
                        {tr("Better possibilities.")}
                      </span>
                    </Heading>
                  </div>
                  <StoryStatement>
                    {tr("I choose the technology that fits the problem.")}
                    <br />
                    {tr("And keep learning along the way.")}
                  </StoryStatement>
                </div>
                <div className="skills-layout">
                  <div className="skills-art">
                    <div className="skills-ring" />
                    <SectionAvatar section="skills" motion={mainMotion} />
                    <span className="orbit-badge badge-one">
                      <Code2 size={18} />
                      {tr("Flutter")}
                    </span>
                    <span className="orbit-badge badge-two">
                      <Sparkles size={18} />
                      {tr("AI")}
                    </span>
                    <span className="orbit-badge badge-three">
                      <Database size={18} />
                      {tr("Data")}
                    </span>
                  </div>
                  <div className="skills-grid">
                    {toolkit.map(({ Icon, title, desc, tags }, i) => (
                      <MotionCard as="article" className="skill-card" key={title}>
                        <div className="skill-top">
                          <Icon size={24} strokeWidth={1.4} />
                          <span>0{i + 1}</span>
                        </div>
                        <h3>{tr(title)}</h3>
                        <p>{tr(desc)}</p>
                        <div className="skill-tags">
                          {tags.map((t) => (
                            <span key={t}>{tr(t)}</span>
                          ))}
                        </div>
                      </MotionCard>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="marquee"
                aria-label={tr(
                  "Flutter, Dart, React, TypeScript, Supabase, Groq AI, PostgreSQL, Kotlin",
                )}
              >
                <div className="marquee-track" aria-hidden="true">
                  {[0, 1].map((copy) => (
                    <div className="marquee-group" key={copy}>
                      {[
                        "Flutter",
                        "Dart",
                        "JavaScript",
                        "Supabase",
                        "React",
                        "Groq AI",
                        "TypeScript",
                        "PostgreSQL",
                      ].map((t) => (
                        <span key={t}>
                          <span>✳</span>
                          {tr(t)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <Projects onOpen={setSelected} motion={mainMotion} />

            <section
              id="experience"
              className="section page-width experience-section"
            >
              <LandscapeScene />
              <div className="section-heading" data-reveal>
                <div>
                  <Heading number="05" label="THE JOURNEY">
                    {tr("Code meets")}
                    <br />
                    <span className="muted-text">{tr("context.")}</span>
                  </Heading>
                </div>
                <StoryStatement>
                  {tr("Real teams. Real needs.")}
                  <br />
                  {tr("A broader perspective on building software.")}
                </StoryStatement>
              </div>
              <div className="experience-layout">
                <div className="timeline">
                  <div className="timeline-track">
                    <div className="timeline-fill" />
                  </div>
                  <MotionCard as="article" className="timeline-entry">
                    <div className="timeline-dot" />
                    <div className="timeline-date">
                      <bdi dir="ltr">3 SEP 2026 — 19 JAN 2027</bdi>{" "}
                      <span className="in-progress">{tr("In progress")}</span>
                    </div>
                    <h3>{tr("Software Engineering Intern")}</h3>
                    <p className="organization">
                      {tr("UMBI / The Malaysian Cohort (TMC)")}
                    </p>
                    <p className="contact-note">
                      {tr("Internship location: Cheras, Selangor, Malaysia")}
                    </p>
                    <p>
                      {tr(
                        "Contributing to mobile and web development in a research environment at Universiti Kebangsaan Malaysia.",
                      )}
                    </p>
                    <ul>
                      <li>
                        {tr(
                          "Mobile application development for the MyCohort application.",
                        )}
                      </li>
                      <li>
                        {tr(
                          "Website development and improvements for research and publication management.",
                        )}
                      </li>
                      <li>
                        {tr(
                          "Translating practical research needs into usable digital solutions.",
                        )}
                      </li>
                    </ul>
                    <div className="tags">
                      <span>{tr("Mobile & web")}</span>
                      <span>{tr("Research systems")}</span>
                      <span>{tr("UKM")}</span>
                    </div>
                  </MotionCard>
                  <MotionCard as="article" className="timeline-entry">
                    <div className="timeline-dot" />
                    <div className="timeline-date">{tr("UKM COURSEWORK")}</div>
                    <h3>{tr("Project Team Leader")}</h3>
                    <p className="organization">
                      {tr("University software & group projects")}
                    </p>
                    <p>
                      {tr(
                        "Leading university teams of 4–6 students, coordinating responsibilities and supporting planning and delivery.",
                      )}
                    </p>
                  </MotionCard>
                  <MotionCard as="article" className="timeline-entry">
                    <div className="timeline-dot" />
                    <div className="timeline-date">
                      <GraduationCap size={16} />
                      {tr("EDUCATION")}
                    </div>
                    <h3>
                      {tr(
                        "Bachelor of Software Engineering with Honours (Information System Development)",
                      )}
                    </h3>
                    <p className="organization">
                      {tr("Universiti Kebangsaan Malaysia")}
                    </p>
                    <p>
                      {tr(
                        "Expected graduation: August 2027. Learning by building, questioning and connecting ideas.",
                      )}
                    </p>
                  </MotionCard>
                </div>
                <div className="experience-art">
                  <span className="outline-word" aria-hidden="true">
                    {tr("EVOLVING.")}
                  </span>
                  <SectionAvatar section="experience" motion={mainMotion} />
                  <span className="experience-note">
                    {tr("EVERY PROJECT.")}
                    <br />
                    {tr("ANOTHER STEP FORWARD.")}
                  </span>
                </div>
              </div>
            </section>

            <section id="contact" className="section contact-section">
              <div className="page-width">
                <LandscapeScene />
                <div className="eyebrow" data-reveal>
                  <span>06 /</span>
                  {tr("WHAT’S NEXT?")}
                </div>
                <div className="contact-layout">
                  <div className="contact-copy" data-reveal>
                    <StoryHeading>
                      {tr("Have something")}
                      <br />
                      {tr("in")}{" "}
                      <span className="accent-text">{tr("mind?")}</span>
                      <ArrowUpRight className="contact-arrow" strokeWidth={1} />
                    </StoryHeading>
                    <StoryStatement>
                      {tr(
                        "A project, an opportunity, or just a good conversation.",
                      )}
                      <br />
                      {tr("I’d love to hear from you.")}
                    </StoryStatement>
                    {profile.email ? (
                      <MotionCard className="email-row">
                        <a href={`mailto:${profile.email}`}>{profile.email}</a>
                        <button
                          className="icon-button"
                          aria-label={tr(
                            copied ? "Email copied" : "Copy email",
                          )}
                          onClick={copyEmail}
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        <span role="status">{copied ? tr("Copied!") : ""}</span>
                      </MotionCard>
                    ) : (
                      <Magnetic
                        className="primary"
                        href={profile.github}
                        {...external}
                      >
                        <GitFork size={18} /> {tr("Find me on GitHub")}{" "}
                        <ArrowUpRight size={18} />
                      </Magnetic>
                    )}
                    <p className="contact-note">
                      {tr(
                        "Email, LinkedIn or WhatsApp — choose what works for you.",
                      )}
                    </p>
                  </div>
                  <div className="contact-art">
                    <div className="contact-glow" />
                    <SectionAvatar section="contact" motion={mainMotion} />
                  </div>
                </div>
                <div className="contact-bottom">
                  <div className="social-links">
                    <a href={profile.github} {...external}>
                      {tr("GitHub")}
                      <ArrowUpRight size={16} />
                    </a>
                    {profile.linkedin && (
                      <a href={profile.linkedin} {...external}>
                        <Network size={16} />
                        {tr("LinkedIn")}
                      </a>
                    )}
                    {profile.whatsapp && (
                      <a href={profile.whatsapp} {...external}>
                        <MessageCircle size={16} />
                        {tr("WhatsApp")}
                      </a>
                    )}
                    {profile.email && (
                      <a href={`mailto:${profile.email}`}>
                        <Mail size={16} />
                        {tr("Email")}
                      </a>
                    )}
                  </div>
                  <span>
                    <MapPin size={14} />
                    {tr("Based in Kajang, Selangor, Malaysia · UTC+8")}
                  </span>
                </div>
              </div>
            </section>
          </StoryMain>
          <AvatarController />
          <CinematicCursor
            enabled={
              mainMotion &&
              portfolioReady &&
              !welcomeVisible &&
              !menuOpen &&
              !selected
            }
          />
          <footer className="footer page-width">
            <span>
              © {new Date().getFullYear()} {tr("Fares Mohammed")}
            </span>
            <span>{tr("Built with intention. Always evolving.")}</span>
            <button
              className="replay-welcome"
              onClick={() => {
                setMenuOpen(false);
                setWelcomeVisible(true);
                setPortfolioReady(false);
              }}
            >
              {tr("Replay welcome")}
            </button>
            <button onClick={() => goTo("home")}>
              {tr("Back to top")}
              <ArrowUp size={15} />
            </button>
          </footer>
          <Guide goTo={goTo} motion={mainMotion} setMotion={setMotion} />
          {selected && (
            <ProjectDialog project={selected} close={() => setSelected(null)} />
          )}
        </div>
      </div>
      <SandCursor enabled={mainMotion && welcomeVisible} />
      {welcomeVisible && (
        <WelcomeExperience
          motion={mainMotion}
          onReveal={() => {
            setPortfolioReady(true);
            goTo("home");
          }}
          onComplete={() => {
            setWelcomeVisible(false);
          }}
        />
      )}
    </AvatarGuideProvider>
  );
}
