import { flushSync } from 'react-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, ArrowUp, ArrowDown, Mail, Plus, X } from 'lucide-react';
import { profile, projects } from './data';
import { getLanguage, saveLanguage, translate } from './i18n';
import Magnetic from './components/Magnetic';
import CircuitBoard from './components/CircuitBoard';
const nav = [['About', '#about'], ['Work', '#work'], ['Skills', '#skills'], ['Contact', '#contact']];
const ease = [.22, 1, .36, 1];
const skillItem = {
  hidden: { opacity: 0, x: -12 },
  shown: index => ({
    opacity: 1, x: 0,
    transition: { duration: .48, delay: Math.min(index, 7) * .045, ease },
  }),
};
const revealStarts = {
  rise: { opacity: 0, y: 26 },
  row: { opacity: 0, x: -20 },
};

function Reveal({ children, className = '', delay = 0, effect = 'rise' }) {
  const reduced = useReducedMotion();
  return <motion.div
    className={`reveal ${className}`}
    initial={reduced ? false : revealStarts[effect]}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, amount: .15 }}
    transition={{ duration: reduced ? 0 : .72, delay: reduced ? 0 : delay, ease }}
  >{children}</motion.div>;
}
function Navigation({ language, setLanguage, t }) {
  const reduced = useReducedMotion();
  const [open,setOpen] = useState(false), panel = useRef(null), toggle = useRef(null);
  useLayoutEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('a')?.focus({ preventScroll: true });
    const onKey = e => {
      if(e.key==='Escape') {setOpen(false);toggle.current?.focus();}
      if(e.key==='Tab') {
        const items = [toggle.current,...panel.current.querySelectorAll('a')];
        const first = items[0], last=items.at(-1);
        if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',onKey);
    return () => {document.body.style.overflow=previous;document.removeEventListener('keydown',onKey);};
  },[open]);
  return <><header className="header"><a className="brand" href="#home" aria-label={t("Home")}><span className="hero-brand">Kittinan Boonkoom</span></a><div className="header-controls">
    <div className="language-switch" role="group" aria-label={t('Language')} hidden={open}>
      {['th', 'en'].map(option => <button key={option} type="button" lang={option}
        aria-label={option === 'th' ? 'ภาษาไทย' : 'English'} aria-pressed={language === option}
        onClick={() => setLanguage(option)}>{option.toUpperCase()}</button>)}
    </div>
    <button ref={toggle} className={`menu-toggle ${open?'is-open':''}`} aria-label={t(open ? 'Close menu' : 'Open menu')} aria-expanded={open} aria-controls="side-menu" onClick={()=>setOpen(!open)}><span className="menu-lines" aria-hidden="true"><i/><i/><i/></span></button></div></header><AnimatePresence>{open&&<><motion.div className="menu-shade" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>{setOpen(false);toggle.current?.focus();}}/><motion.aside ref={panel} id="side-menu" className="side-menu" role="dialog" aria-modal="true" aria-label={t("Navigation")} initial={reduced ? false : {x:'100%'}} animate={{x:0}} exit={reduced ? undefined : {x:'100%'}} transition={{duration:reduced ? 0 : .52,ease}}><p className="menu-label">{t("Explore the portfolio")}</p><nav>{nav.map(([name,href],i)=><motion.a initial={reduced ? false : {y:25,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:reduced ? 0 : .4,delay:reduced ? 0 : .10+i*.055,ease}} href={href} key={href} onClick={() => flushSync(() => setOpen(false))}>{t(name)}<ArrowUpRight/></motion.a>)}</nav><div className="menu-footer">{t("Computer Engineering student.")}<br/>{t("Seeking a software development co-op.")}</div></motion.aside></>}</AnimatePresence></>;
}
function Hero({ t }) {
  return <section id="home" className="hero hero-portrait">
    <div className="hero-layout">
      <div className="hero-copy">
        <h1>{profile.name}</h1>
        <p className="hero-role-title">{t(profile.role.replace('\n', ' '))}</p>
        <p className="hero-introduction">{t(profile.introduction)}</p>
        <div className="hero-actions">
          <a href={profile.resume} download="Kittinan_Boonkoom_Resume.pdf">{t("Download résumé")} <ArrowDown size={17}/></a>
          <a href="#work">{t("View projects")} <ArrowUpRight size={17}/></a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-photo" aria-hidden="true">
          <img className="is-cutout" src={profile.portrait} alt="" fetchPriority="high"/>
        </div>
      </div>
    </div>
  </section>;
}
function About({ t }){const reduced=useReducedMotion();const [expanded,setExpanded]=useState(false);return <section id="about" tabIndex={-1} className="section about"><div className="section-heading"><h2>{t("About me")}</h2><span>{t("Computer Engineering · Co-op applicant")}</span></div><div className="about-grid"><Reveal><p className="about-statement">{t("Learning through projects.")}<br/><span>{t("Ready for a co-op role.")}</span></p></Reveal><Reveal delay={.1} className="about-copy"><p>{t(profile.about)}</p><div className="co-op-interests"><h3>{t("Roles of interest")}</h3><ul>{profile.interests.map(role=><li key={role}>{t(role)}</li>)}</ul></div><AnimatePresence>{expanded&&<motion.p initial={reduced ? false : {height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={reduced ? undefined : {height:0,opacity:0}} transition={{duration:reduced ? 0 : .36,ease}} id="about-details">{t(profile.details)}</motion.p>}</AnimatePresence><Magnetic><button className="round-button" aria-expanded={expanded} aria-controls="about-details" onClick={()=>setExpanded(!expanded)}>{t(expanded ? 'Less about me' : 'More about me')}{expanded?<X size={18}/>:<ArrowUpRight size={18}/>}</button></Magnetic></Reveal></div></section>;}
function Work({ t }){
 const [active,setActive]=useState(null),[selected,setSelected]=useState(null);const reduced=useReducedMotion();
 const mx=useMotionValue(0),my=useMotionValue(0),x=useSpring(mx,{stiffness:250,damping:27}),y=useSpring(my,{stiffness:250,damping:27});
 const move=e=>{if(e.pointerType==='mouse'){mx.set(Math.min(e.clientX+24,window.innerWidth-380));my.set(Math.max(16,Math.min(e.clientY-140,window.innerHeight-280)));}};
 return <section id="work" tabIndex={-1} className="section work"><div className="section-heading"><h2>{t("Selected work")}<span className="work-count">({String(projects.length).padStart(2,'0')})</span></h2><span>{t("Web & mobile projects · My contributions")}</span></div>{projects.some(project=>project.placeholder)&&<p className="placeholder-note">{t("Sample layout · Replace these placeholders with your own projects.")}</p>}<div className="work-list" onPointerMove={move} onPointerLeave={()=>setActive(null)}>{projects.map((project,i)=><Reveal key={project.id} delay={i*.055} effect="row"><article className={`work-item ${selected===project.id?'expanded':''}`} onPointerEnter={e=>{if(e.pointerType==='mouse'){move(e);setActive(project);}}} onPointerLeave={()=>setActive(null)}><button className="project-toggle" onClick={()=>{setSelected(selected===project.id?null:project.id);setActive(null);}} aria-expanded={selected===project.id} aria-controls={`${project.id}-details`}><span className="project-title">{project.title}</span><span className="project-category">{t(project.category)}</span><span className="project-year">
  {project.status ? <span className="project-status" data-complete={project.status.startsWith('Completed')}>
    {t(project.status)}
  </span> : null}
  {project.year && <span className="project-year-label">{project.year}</span>}
</span><span className="project-arrow"><Plus aria-hidden="true"/></span></button>{(project.purpose || project.contribution) &&
  <p className="project-contribution">{t(project.purpose ?? project.contribution)}</p>}
<img className="project-thumbnail" src={project.image} alt={t("Project screenshot") + " — " + project.title} width="960" height="640" loading="lazy"/><AnimatePresence>{selected===project.id&&<motion.div id={`${project.id}-details`} className="project-details" initial={reduced ? false : {height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={reduced ? undefined : {height:0,opacity:0}} transition={{duration:reduced ? 0 : .36,ease}}><img src={project.image} width="960" height="640" alt={t("Project screenshot") + " — " + project.title}/><div><p>{t(project.description)}</p>{(project.responsibilities || project.technologies) && <div className="project-detail-overview space-y-4">
  {project.responsibilities && <div>
    <strong>{t("My role")}</strong>
    <ul className="mt-1 list-disc space-y-1 pl-5">
      {project.responsibilities.map(role => <li key={role}>{t(role)}</li>)}
    </ul>
  </div>}
  {project.technologies && <p><strong>{t("Technologies")}</strong><br/>{project.technologies}</p>}
</div>}{project.url?<a className="text-link" href={project.url} target="_blank" rel="noreferrer">{t("Visit project")} <ArrowUpRight size={18}/></a>:<p className="unavailable">{t(project.source ? 'No live demo available.' : 'Project link not added yet.')}</p>}{project.source&&<a className="text-link" href={project.source} target="_blank" rel="noreferrer">{t("Source code")} <ArrowUpRight size={18}/></a>}{project.evidence&&<div className="project-evidence"><h3>{t("Implementation evidence")}</h3>{project.evidence.map(item=><a key={item.url} href={item.url} target="_blank" rel="noreferrer">{t(item.label)}<ArrowUpRight size={14}/></a>)}<p>{t("Implementation outcomes; user-impact metrics have not been measured.")}</p></div>}</div></motion.div>}</AnimatePresence></article></Reveal>)}</div><motion.div className="floating-preview" aria-hidden="true" style={{x:reduced?mx:x,y:reduced?my:y}} animate={{opacity:active?1:0,scale:reduced||active?1:.9}} transition={{duration:reduced?0:.2}}>{active&&<><motion.img key={active.id} src={active.image} alt="" initial={reduced ? false : {clipPath:'inset(0 0 100% 0)'}} animate={{clipPath:'inset(0 0 0% 0)'}} transition={{duration:reduced ? 0 : .35,ease}}/><span>{t("Explore project")} <ArrowUpRight size={15}/></span></>}</motion.div></section>;
}
function Skills({ t }) {
  const reduced = useReducedMotion();
  return <section id="skills" tabIndex={-1} className="section skills">
    <div className="section-heading">
      <h2>{t("Skills & technologies")}</h2>
      <span>{t("Tools I use in projects and engineering coursework.")}</span>
    </div>
    <div className="skills-matrix">
      {profile.skills.map((group, index) => <Reveal className="skill-group" delay={index * .055} key={group.category}>
        <h3>{t(group.category)}</h3>
        <motion.ul className="skill-tags" initial={reduced ? false : 'hidden'} whileInView="shown" viewport={{ once: true, amount: .15 }}>
          {group.items.flatMap(item => item.split(' · ')).map((item, itemIndex) => <motion.li key={item} custom={itemIndex} variants={reduced ? undefined : skillItem}>
            {t(item)}
          </motion.li>)}
        </motion.ul>
      </Reveal>)}
    </div>
  </section>;
}
function Contact({ t }) {
  const channels = [['GitHub', profile.github], ['LINE', profile.line], ['LinkedIn', profile.linkedin]]
    .filter(([, url]) => url);
  const email = profile.email ? `mailto:${profile.email}` : null;

  return <footer id="contact" tabIndex={-1} className="closing">
    <div className="closing-inner">
      <div className="closing-layout">
        <Reveal className="closing-intro">
          <h2>{t("Let’s discuss")}<br/>{t("a co-op role.")}</h2>
          <p>{t("I’m seeking a co-op internship in frontend, full stack, or mobile development.")}</p>
          <div className="closing-actions">
            {email && <a className="closing-primary" href={email}><Mail size={18} aria-hidden="true"/> {t("Email me")}</a>}
            {profile.resume && <a className="closing-secondary" href={profile.resume} download="Kittinan_Boonkoom_Resume.pdf">
              {t("Download résumé")} <ArrowDown size={17} aria-hidden="true"/>
            </a>}
          </div>
        </Reveal>
        {(email || channels.length > 0) && <Reveal className="closing-panel" delay={.1}>
          <h3>{t("Contact details")}</h3>
          {email && <a className="closing-email" href={email}>{profile.email}</a>}
          {channels.length > 0 && <ul className="closing-links">
            {channels.map(([label, url]) => <li key={label}>
              <a href={url} target="_blank" rel="noreferrer">{t(label)}<ArrowUpRight size={18} aria-hidden="true"/></a>
            </li>)}
          </ul>}
        </Reveal>}
      </div>
      <div className="closing-footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <nav aria-label={t("Footer navigation")}>{nav.slice(0, 3).map(([label, href]) => <a key={href} href={href}>{t(label)}</a>)}</nav>
        <a className="closing-back" href="#home">{t("Back to top")} <ArrowUp size={16} aria-hidden="true"/></a>
      </div>
    </div>
  </footer>;
}
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true"/>;
}
function Cursor(){const [visible,setVisible]=useState(false);const x=useMotionValue(-50),y=useMotionValue(-50);const reduced=useReducedMotion();useEffect(()=>{const move=e=>{if(e.pointerType!=='mouse')return;x.set(e.clientX-5);y.set(e.clientY-5);setVisible(!e.target.closest('a,button'));};const leave=()=>setVisible(false);window.addEventListener('pointermove',move);document.addEventListener('pointerleave',leave);return()=>{window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);};},[x,y]);return !reduced&&<motion.div className="cursor-dot" aria-hidden="true" style={{x,y,opacity:visible?1:0}}/>;}
export default function App() {
  const [language, setLanguage] = useState(getLanguage);
  const t = text => translate(language, text);

  useEffect(() => {
    saveLanguage(language);
    document.documentElement.lang = language;
    document.title = translate(language, 'Kittinan Boonkoom — Portfolio');
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate(language,
      'Computer Engineering student seeking a software development co-op placement. Explore web and mobile projects, skills, and resume.'));
  }, [language]);

  return <>
    <a className="skip-link" href="#main">{t('Skip to content')}</a>
    <Navigation language={language} setLanguage={setLanguage} t={t}/>
    <ScrollProgress/>
    <div className="portfolio-page">
      <CircuitBoard/>
      <main id="main"><Hero t={t}/><About t={t}/><Work t={t}/><Skills t={t}/></main>
      <Contact t={t}/>
    </div>
    <Cursor/>
  </>;
}
