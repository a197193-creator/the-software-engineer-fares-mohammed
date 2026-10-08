import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, GitFork as Github, Network as Linkedin, Mail, MessageCircle, Download, Menu, X, Code2, Smartphone, Globe, Database, Sparkles, ChevronRight, ChevronLeft, Compass, MapPin, Play, Pause, ExternalLink, Check, HeartPulse, Receipt, CalendarDays, BookOpen, Plus } from 'lucide-react';
import { profile, projects, guideSteps } from './data';
import './styles.css';

const externalProps = { target: '_blank', rel: 'noopener noreferrer' };

function Avatar({ pose = 0, className = '', animated = true }) {
  return <div className={`avatar ${className} ${animated ? 'avatar-animated' : ''}`} aria-hidden="true">
    {Array.from({ length: 6 }, (_, i) => <img key={i} src={`/assets/avatar-${i}.webp`} className={`avatar-pose ${i === pose ? 'active' : ''}`} alt="" draggable="false" />)}
  </div>;
}

function ProjectVisual({ project }) {
  const Icon = { mobile: Smartphone, health: HeartPulse, budget: Receipt, research: BookOpen, booking: CalendarDays }[project.type];
  return <div className={`project-visual ${project.type}`} style={{ '--project-accent': project.accent }} aria-hidden="true">
    <div className="visual-grid" />
    <div className="project-symbol"><Icon strokeWidth={1.15} /></div>
    <span className="visual-word">{project.id === 'tmc-web' ? 'TMC' : project.id === 'uwc' ? 'UWC' : project.name}</span>
    <span className="visual-caption">{project.tagline}</span>
    <span className="visual-index">{project.number} / SELECTED WORK</span>
    <Code2 className="visual-code" size={20} />
  </div>;
}

function ProjectDialog({ project, close }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    dialogRef.current.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = old; };
  }, []);
  return <dialog ref={dialogRef} className="project-dialog" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-labelledby="project-title">
    <button className="dialog-close icon-button" onClick={close} aria-label="Close project"><X /></button>
    <ProjectVisual project={project} />
    <div className="dialog-content">
      <div className="eyebrow">{project.category} <span> / {project.status}</span></div>
      <h2 id="project-title">{project.name}</h2>
      <p className="dialog-intro">{project.description}</p>
      <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <div className="case-columns"><div><h3>The problem</h3><p>{project.problem}</p></div><div><h3>The approach</h3><p>{project.solution}</p></div></div>
      <h3>Features & focus</h3><ul className="features">{project.features.map(f => <li key={f}><Check size={15} />{f}</li>)}</ul>
      <div className="learning"><Sparkles size={21} /><div><h3>What I learned</h3><p>{project.learning}</p></div></div>
      {project.screenshot && <img className="case-screenshot" src={project.screenshot} alt={`${project.name} application screenshot`} />}
      <div className="case-footer"><span>{project.context}</span>{project.github && <a href={project.github} {...externalProps}>GitHub <Github size={17} /></a>}{project.demo && <a href={project.demo} {...externalProps}>Live demo <ExternalLink size={17} /></a>}</div>
    </div>
  </dialog>;
}

function App() {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All work');
  const [guideOpen, setGuideOpen] = useState(false);
  const [tour, setTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const activeStep = guideSteps.find(s => s.id === active) || guideSteps[0];
  const step = tour ? guideSteps[tourIndex] : activeStep;

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    guideSteps.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('motion-off', !motion);
    return () => document.documentElement.classList.remove('motion-off');
  }, [motion]);

  useEffect(() => {
    const closeGuide = e => { if (e.key === 'Escape') { setGuideOpen(false); setTour(false); setMenuOpen(false); } };
    window.addEventListener('keydown', closeGuide);
    return () => window.removeEventListener('keydown', closeGuide);
  }, []);

  function goTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: motion ? 'smooth' : 'instant', block: 'start' });
    setActive(id); setMenuOpen(false);
    history.replaceState(null, '', `#${id}`);
  }
  function startTour() { setTour(true); setTourIndex(0); setGuideOpen(true); goTo('home'); }
  function nextTour() {
    if (!tour) { setTour(true); const index = Math.min(guideSteps.findIndex(s => s.id === active) + 1, 5); setTourIndex(index); goTo(guideSteps[index].id); }
    else if (tourIndex < 5) { const next = tourIndex + 1; setTourIndex(next); goTo(guideSteps[next].id); }
    else { setTour(false); setGuideOpen(false); }
  }
  const visibleProjects = projects.filter(p => filter === 'All work' || (filter === 'Mobile' && ['mobile', 'health'].includes(p.type)) || (filter === 'Web' && ['research', 'booking'].includes(p.type)) || (filter === 'AI' && ['health', 'budget'].includes(p.type)));

  return <>
    <a className="skip-link" href="#projects">Skip to projects</a>
    <header className="header">
      <a className="brand" href="#home" onClick={e => { e.preventDefault(); goTo('home'); }} aria-label="Fares Mohammed home"><span className="brand-mark">f<span>.</span></span><span>FARES <strong>MOHAMMED</strong></span></a>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
        {['projects', 'skills', 'experience', 'about'].map(id => <a key={id} className={active === id ? 'current' : ''} href={`#${id}`} onClick={e => { e.preventDefault(); goTo(id); }}>{id === 'projects' ? 'Work' : id[0].toUpperCase() + id.slice(1)}</a>)}
        <a className="nav-contact" href="#contact" onClick={e => { e.preventDefault(); goTo('contact'); }}>Let’s talk <span className="contact-dot" /></a>
      </nav>
      <button className="menu-button icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main>
      <section id="home" className="hero page-width">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="tiny-line" /> SOFTWARE ENGINEER IN THE MAKING</div>
          <h1>Hi, I’m Fares.<br />I turn ideas into<br /><span className="gold-text">things that work.</span></h1>
          <p className="hero-description">Software Engineering student & developer at UKM.<br className="desktop-break" /> Building practical digital solutions with mobile, web & AI.</p>
          <div className="hero-actions"><a className="button primary" href="#projects" onClick={e => { e.preventDefault(); goTo('projects'); }}>Explore my work</a><a className="button secondary" href="#contact" onClick={e => { e.preventDefault(); goTo('contact'); }}>Let’s connect</a></div>
          <div className="hero-note"><MapPin size={14} /><span>Based in Malaysia</span><span className="note-divider" /><span>Curious by nature. Engineer by choice.</span></div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-cross cross-one" /><div className="orbit-cross cross-two" />
          <span className="art-coordinate">MALAYSIA / UTC+08</span>
          <span className="art-label"><Code2 size={15} /> BUILD. LEARN. ITERATE.</span>
          <Avatar className="hero-avatar" pose={0} animated={motion} />
          <div className="avatar-caption"><span className="caption-line" /><span>A LITTLE CHARACTER.<br /><strong>A LOT OF CURIOSITY.</strong></span></div>
          <button className="hero-tour" onClick={startTour}><Compass size={18} /><span>Let me show you around</span><ChevronRight size={16} /></button>
        </div>
        <div className="hero-bottom"><a href="#projects" onClick={e => { e.preventDefault(); goTo('projects'); }}><span className="scroll-indicator"><ArrowDown size={15} /></span> SCROLL TO EXPLORE</a><span>PORTFOLIO / 2026</span></div>
      </section>

      <div className="tool-strip"><div className="page-width"><span>FROM CONCEPT TO CODE</span><span><Smartphone size={17} /> Mobile</span><span><Globe size={17} /> Web</span><span><Database size={17} /> Data</span><span><Sparkles size={17} /> AI integration</span><span className="strip-last">THOUGHTFULLY BUILT.</span></div></div>

      <section id="projects" className="section page-width">
        <div className="section-heading"><div><div className="eyebrow"><span>01</span> SELECTED WORK</div><h2>Ideas made <span className="serif">real.</span></h2></div><p>A few projects that reflect how I think,<br />build, and solve problems.</p></div>
        <div className="project-toolbar"><div className="filters" aria-label="Filter projects">{['All work', 'Mobile', 'Web', 'AI'].map(f => <button key={f} aria-pressed={filter === f} className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div><span className="result-count">{String(visibleProjects.length).padStart(2, '0')} PROJECTS</span></div>
        <div className="project-grid">{visibleProjects.map(project => <button key={project.id} className="project-card" onClick={() => setSelected(project)} aria-label={`Explore ${project.name}`}><ProjectVisual project={project} /><div className="project-info"><div className="project-meta">{project.category}<span>{project.number}</span></div><div className="project-title"><h3>{project.name}</h3><span className="project-open"><Plus size={22} /></span></div><p>{project.description}</p><div className="tags">{project.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div></div></button>)}</div>
        <div className="section-footnote"><span>Every project is another step forward.</span><a href={profile.github} {...externalProps}><Github size={17} /> More on GitHub</a></div>
      </section>

      <section id="skills" className="skills-section"><div className="section page-width"><div className="section-heading"><div><div className="eyebrow"><span>02</span> MY TOOLKIT</div><h2>The right tools.<br /><span className="serif">The right purpose.</span></h2></div><p>I choose the technology that fits the problem.<br />And keep learning along the way.</p></div>
        <div className="skills-grid">{[
          { Icon: Smartphone, title: 'Mobile development', desc: 'Useful experiences, built for everyday life.', tags: ['Flutter', 'Dart', 'Kotlin', 'Android'] },
          { Icon: Globe, title: 'Web development', desc: 'Clear interfaces that connect people to information.', tags: ['HTML', 'CSS', 'JavaScript', 'WordPress'] },
          { Icon: Database, title: 'Backend & data', desc: 'The structure behind a reliable application.', tags: ['Supabase', 'Firebase', 'SQLite'] },
          { Icon: Sparkles, title: 'AI integration', desc: 'Making intelligent tools practical and accessible.', tags: ['Groq AI', 'AI-assisted apps', 'OCR'] },
        ].map(({ Icon, title, desc, tags }, i) => <div className="skill-card" key={title}><div className="skill-top"><Icon size={26} strokeWidth={1.4} /><span>0{i + 1}</span></div><h3>{title}</h3><p>{desc}</p><div className="skill-tags">{tags.map(t => <span key={t}>{t}</span>)}</div></div>)}</div>
      </div></section>

      <section id="experience" className="section page-width experience-section"><div className="section-heading"><div><div className="eyebrow"><span>03</span> EXPERIENCE</div><h2>Code meets <span className="serif">context.</span></h2></div><p>Real teams. Real needs.<br />A broader perspective on building software.</p></div>
        <div className="experience-entry"><div className="experience-date"><span>SEP 2026 — JAN 2027</span><span className="in-progress">In progress</span></div><div className="experience-detail"><div className="experience-title"><h3>Software Engineering Intern</h3><span className="ukm-mark">UKM</span></div><p className="organization">UMBI / The Malaysian Cohort (TMC)</p><p className="experience-summary">Contributing to mobile and web development in a research environment at Universiti Kebangsaan Malaysia.</p><ul><li>Mobile application development for the MyCohort application.</li><li>Website development and improvements for research and publication management.</li><li>Translating practical research needs into usable digital solutions.</li></ul><div className="tags"><span>Mobile & web</span><span>Research systems</span><span>UKM</span></div></div></div>
        <div className="experience-entry leadership"><div className="experience-date"><span>UKM COURSEWORK</span></div><div className="experience-detail"><h3>Project Team Leader</h3><p className="organization">University software & group projects</p><p className="experience-summary">Coordinating student teams, organizing responsibilities and helping ideas move from planning to delivery.</p></div></div>
      </section>

      <section id="about" className="about-section page-width"><div className="about-art"><div className="about-ring" /><Avatar pose={4} className="about-avatar" animated={motion} /><span className="about-stamp">ALWAYS<br /><strong>LEARNING.</strong><Sparkles size={23} /></span></div><div className="about-copy"><div className="eyebrow"><span>04</span> THE PERSON BEHIND THE CODE</div><h2>A builder.<br />A problem solver.<br /><span className="serif">Still curious.</span></h2><p>I’m a Software Engineering student at Universiti Kebangsaan Malaysia (UKM), interested in building practical software that solves real problems.</p><p>My work spans mobile and web development, with a particular interest in Flutter, AI-powered applications, databases and digital solutions.</p><p>I enjoy taking an idea from a simple concept and turning it into something people can actually use.</p><div className="about-facts"><div><span>STUDYING AT</span><strong>Universiti Kebangsaan Malaysia</strong></div><div><span>FOCUS</span><strong>Software Engineering</strong></div></div>
        {profile.cv ? <a className="text-link" href={profile.cv} download="Fares-Mohammed-CV.pdf"><Download size={18} /> Download my CV</a> : <span className="text-link cv-pending"><Download size={18} /> Updated CV coming soon</span>}
      </div></section>

      <section id="contact" className="contact-section"><div className="page-width"><div className="eyebrow"><span>05</span> LET’S CONNECT</div><div className="contact-heading"><h2>Have something<br />in <span className="serif">mind?</span></h2><div><p>A project, an opportunity, or just a good conversation.<br />I’d love to hear from you.</p>{profile.email ? <a className="button primary" href={`mailto:${profile.email}`}><Mail size={18} /> Say hello</a> : <a className="button primary" href={profile.github} {...externalProps}><Github size={18} /> Find me on GitHub</a>}</div></div>{profile.email ? <a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a> : <p className="contact-pending">More ways to connect coming soon.</p>}<div className="contact-bottom"><div className="social-links">{profile.linkedin && <a href={profile.linkedin} {...externalProps}><Linkedin size={17} /> LinkedIn</a>}<a href={profile.github} {...externalProps}><Github size={17} /> GitHub</a>{profile.whatsapp && <a href={profile.whatsapp} {...externalProps}><MessageCircle size={17} /> WhatsApp</a>}{profile.cv && <a href={profile.cv} download><Download size={17} /> CV</a>}</div><span><MapPin size={14} /> Malaysia · UTC+8</span></div></div></section>
    </main>

    <footer className="footer page-width"><span>© {new Date().getFullYear()} Fares Mohammed</span><span>Built with intention. Always evolving.</span><button onClick={() => goTo('home')}>Back to top</button></footer>

    <aside className={`guide ${guideOpen ? 'expanded' : ''}`} aria-label="Portfolio guide">
      {guideOpen && <div className="guide-panel"><div className="guide-header"><span><Compass size={16} /> YOUR PERSONAL GUIDE</span><button className="icon-button" aria-label="Close guide" onClick={() => { setGuideOpen(false); setTour(false); }}><X size={17} /></button></div><div className="guide-avatar-row"><Avatar className="guide-avatar" pose={step.pose} animated={motion} /><div><span className="guide-name">Fares’ digital companion</span><span className="guide-location">{tour ? `STOP ${tourIndex + 1} OF 6` : active.toUpperCase()}</span></div></div><div className="guide-text" aria-live="polite"><h3>{step.title}</h3><p>{step.text}</p></div>{tour && <div className="tour-dots">{guideSteps.map((s, i) => <span className={i === tourIndex ? 'active' : ''} key={s.id} />)}</div>}<div className="guide-controls">{tour && tourIndex > 0 && <button className="guide-back icon-button" aria-label="Previous tour stop" onClick={() => { setTourIndex(tourIndex - 1); goTo(guideSteps[tourIndex - 1].id); }}><ChevronLeft size={17} /></button>}<button className="guide-next" onClick={nextTour}>{step.action}<ChevronRight size={16} /></button></div><div className="guide-shortcuts"><button onClick={() => goTo('projects')}>Projects</button><button onClick={() => goTo('contact')}>Contact</button><button onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? <Pause size={12} /> : <Play size={12} />}{motion ? 'Pause motion' : 'Enable motion'}</button></div></div>}
      <button className="guide-trigger" onClick={() => setGuideOpen(!guideOpen)} aria-label={guideOpen ? 'Hide portfolio guide' : 'Open portfolio guide'} aria-expanded={guideOpen}><Avatar className="guide-mini-avatar" pose={step.pose} animated={motion} /><span>{guideOpen ? 'Hide guide' : 'Need a guide?'}</span><span className="guide-trigger-dot" /></button>
    </aside>
    {selected && <ProjectDialog project={selected} close={() => setSelected(null)} />}
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
