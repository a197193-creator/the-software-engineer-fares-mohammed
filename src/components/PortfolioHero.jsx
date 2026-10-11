import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowUpRight,
  ArrowDown,
  GitFork,
  Mail,
  Network,
  Download,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { profile } from "../data";
import { Magnetic } from "./Effects";
import SectionAvatar from "./SectionAvatar";
import { StoryHeading } from "./StoryTypography";
import HeroMessage from "./HeroMessage";
import { useMotionSettings } from "./MotionSettings";
import LandscapeScene from "./LandscapeScene";
const external = { target: "_blank", rel: "noopener noreferrer" };
export default function PortfolioHero({ motion, ready, goTo }) {
  const { language, hero, tr } = useLanguage();
  const [visible, setVisible] = useState(false);
  const root = useRef(null);
  const { config } = useMotionSettings();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!ready || !motion) return;
    const context = gsap.context(() => {
      const sequence = gsap.timeline({
        defaults: { ease: config.ease },
        delay: 0.16,
      });
      sequence
        .from(".hero-description", {
          opacity: 0,
          y: config.revealDistance,
          duration: config.reveal,
        })
        .from(
          ".hero-action-reveal",
          {
            opacity: 0,
            y: config.revealDistance * 0.65,
            stagger: config.stagger * 2,
            duration: config.reveal,
          },
          "-=.3",
        );
    }, root);
    return () => context.revert();
  }, [ready, motion, language, config]);
  const jump = (id) => (event) => {
    event.preventDefault();
    goTo(id);
  };
  return (
    <section
      ref={root}
      id="home"
      className={`hero hero-phase-one page-width ${visible && ready ? "hero-visible" : ""}`}
    >
      <LandscapeScene variant="hero" />
      <div className="hero-copy" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="eyebrow">{hero.eyebrow}</div>
        <StoryHeading
          as="h1"
          className="hero-introduction"
          id="hero-title"
          tabIndex={-1}
        >
          {hero.greeting}
          <br />
          <span className="accent-text">{hero.name}</span>
        </StoryHeading>
        <StoryHeading className="hero-secondary" delay={0.28}>
          {hero.secondary}
        </StoryHeading>
        <HeroMessage heroVisible={visible} />
        <p className="hero-description">{hero.description}</p>
        <div className="hero-actions">
          <span className="hero-action-reveal">
            <Magnetic
              href="#projects"
              onClick={jump("projects")}
              className="primary"
            >
              {hero.projects}
              <ArrowUpRight size={17} />
            </Magnetic>
          </span>
          <span className="hero-action-reveal">
            <a
              href="#about"
              className="button secondary"
              onClick={jump("about")}
            >
              {hero.about}
              <ArrowUpRight size={17} />
            </a>
          </span>
          <span className="hero-action-reveal">
            <Magnetic
              href="#contact"
              onClick={jump("contact")}
              className="secondary hero-contact"
            >
              {tr("Contact me")} <Mail size={17} />
            </Magnetic>
          </span>
        </div>
        <div className="hero-socials">
          <a
            href={profile.github}
            {...external}
            aria-label={
              language === "ar" ? "فارس على GitHub" : "Fares on GitHub"
            }
          >
            <GitFork size={18} />
          </a>
          {profile.linkedin && (
            <a href={profile.linkedin} {...external} aria-label="LinkedIn">
              <Network size={18} />
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} aria-label={tr("Email")}>
              <Mail size={18} />
            </a>
          )}
          <span>{tr("UKM · MALAYSIA")}</span>
          {profile.cv && (
            <a href={profile.cv} download className="hero-cv">
              <Download size={15} />
              {tr("Download CV")}
            </a>
          )}
        </div>
      </div>
      <div className="mobile-guide-slot" aria-hidden="true" />
      <div className="hero-art">
        <SectionAvatar section="home" motion={motion} imageHidden />
      </div>
      <div className="hero-bottom">
        <a href="#about" onClick={jump("about")}>
          <span className="scroll-hint">
            <ArrowDown size={15} />
          </span>
          {tr("SCROLL TO DISCOVER")}
        </a>
        <span>{tr("PORTFOLIO — 2026")}</span>
        <span className="hero-index" dir="ltr">
          01 / 06
        </span>
      </div>
    </section>
  );
}
