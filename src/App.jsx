import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Asterisk, Home, LayoutGrid, Mail } from 'lucide-react'
import { capabilities, projects, site } from './data'
import WebGLShader from './WebGLShader'

const ease = [0.22, 1, 0.36, 1]

function Reveal({ children, delay = 0, y = 28, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null)

  const onMove = (event) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--x', `${event.clientX - rect.left}px`)
    node.style.setProperty('--y', `${event.clientY - rect.top}px`)
  }

  return (
    <div ref={ref} onPointerMove={onMove} className={`spotlight-card ${className}`}>
      {children}
    </div>
  )
}


function CursorGlow() {
  const glowRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return undefined
    const node = glowRef.current
    if (!node) return undefined
    let raf = 0
    let x = -200
    let y = -200
    const paint = () => {
      node.style.left = `${x}px`
      node.style.top = `${y}px`
      node.classList.add('is-visible')
      raf = 0
    }
    const move = (event) => {
      x = event.clientX
      y = event.clientY
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const leave = () => node.classList.remove('is-visible')
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Главная">
        <img className="brand-logo" src="./assets/brand-logo-cursor.png" alt="YD" />
      </a>
    </header>
  )
}

function MobileLimelightNav() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const update = () => {
      const points = [
        ['contact', 'contact'],
        ['work', 'works'],
      ]
      const threshold = window.innerHeight * 0.56
      const current = points.find(([id]) => {
        const node = document.getElementById(id)
        return node && node.getBoundingClientRect().top <= threshold
      })
      setActive(current ? current[1] : 'home')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const items = [
    { id: 'home', label: 'Главная', href: '#top', Icon: Home },
    { id: 'works', label: 'Работы', href: './works.html', Icon: LayoutGrid },
    { id: 'contact', label: 'Контакты', href: '#contact', Icon: Mail },
  ]
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === active))

  return (
    <nav className="mobile-limelight-nav" style={{ '--active-shift': `${activeIndex * 100}%` }} aria-label="Основная навигация">
      <span className="limelight-indicator" aria-hidden="true" />
      {items.map(({ id, label, href, Icon }) => (
        <a key={id} href={href} className={active === id ? 'is-active' : ''} aria-label={label}>
          <Icon size={22} strokeWidth={1.8} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}

function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 110])
  const orbY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -160])

  return (
    <section id="top" ref={ref} className="hero section-shell">
      <motion.div className="hero-shader-shell" style={{ y: orbY }} aria-hidden="true">
        <WebGLShader />
      </motion.div>
      <motion.div className="hero-content" style={{ y: heroY }}>

        <div className="hero-heading" aria-label="Я создаю цифровые продукты с характером">
          {['Я СОЗДАЮ', 'ЦИФРОВЫЕ ПРОДУКТЫ', 'С ХАРАКТЕРОМ'].map((line, index) => (
            <div className={index === 1 ? 'hero-line accent-line' : 'hero-line'} key={line}>
              <motion.span
                initial={reduce ? false : { y: '115%', rotate: 1.5 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ duration: 1.05, delay: 0.12 + index * 0.08, ease }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        <motion.div
          className="hero-bottom"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease }}
        >
          <p>{site.intro}</p>
          <a className="scroll-link" href="#work">
            <span>Избранные проекты</span>
            <span className="scroll-icon"><ArrowDownRight size={18} /></span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

function ProjectVisual({ project }) {
  return (
    <div className="visual visual-real-work">
      <img className="real-work-backdrop" src={project.image} alt="" aria-hidden="true" />
      <img className="real-work-image" src={project.image} alt={project.title} loading="lazy" decoding="async" />
      <div className="real-work-vignette" aria-hidden="true" />
    </div>
  )
}

function ProjectCard({ project, index }) {
  const reduce = useReducedMotion()
  return (
    <Reveal delay={index * 0.06} className={`project-wrap ${project.size}`}>
      <motion.article
        className="project-card"
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ duration: 0.35, ease }}
      >
        <a
          className="project-visual-wrap project-visual-link"
          href={`./works.html?work=${project.workId}`}
          aria-label={`Открыть работу «${project.title}»`}
        >
          <motion.div
            className="visual-scale"
            whileHover={reduce ? undefined : { scale: 1.025 }}
            transition={{ duration: 0.65, ease }}
          >
            <ProjectVisual project={project} />
          </motion.div>
          <div className="project-index">{project.id}</div>
          <span className="project-arrow"><ArrowUpRight size={18} /></span>
        </a>
        <div className="project-meta">
          <div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
          <div className="project-side">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
        </div>
        <div className="tag-row">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </motion.article>
    </Reveal>
  )
}

function Work() {
  return (
    <section id="work" className="work section-shell section-gap">
      <Reveal className="section-head">
        <div className="eyebrow"><Asterisk size={15} /> Избранные проекты</div>
        <div className="section-head-actions">
          <div className="section-number">01 — 06</div>
          <a className="all-work-link" href="./works.html">Все 40 работ <ArrowUpRight size={15} /></a>
        </div>
      </Reveal>
      <div className="project-grid">
        {projects.map((project, index) => <ProjectCard project={project} index={index} key={project.id} />)}
      </div>
    </section>
  )
}

function AboutHeadline() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.34'],
  })

  const firstColor = useTransform(
    scrollYProgress,
    [0, 0.16, 0.52, 0.82, 1],
    ['#79766f', '#f4f0e8', '#f4f0e8', '#9a968f', '#8a867f'],
  )
  const secondColor = useTransform(
    scrollYProgress,
    [0, 0.42, 0.68, 1],
    ['#79766f', '#79766f', '#f4f0e8', '#f4f0e8'],
  )

  return (
    <motion.h2 ref={ref} className="scroll-headline">
      <motion.span className="headline-line" style={reduce ? { color: '#f4f0e8' } : { color: firstColor }}>
        Внимание к деталям.
      </motion.span>
      <br />
      <motion.span className="headline-line" style={reduce ? { color: '#f4f0e8' } : { color: secondColor }}>
        Сильные системы.
      </motion.span>
    </motion.h2>
  )
}

function About() {
  return (
    <section id="about" className="about section-shell section-gap">
      <Reveal className="about-intro">
        <div className="eyebrow"><Asterisk size={15} /> Что я делаю</div>
        <AboutHeadline />
        <p>Я соединяю бренд, продукт и код, чтобы создавать понятные, выразительные и запоминающиеся цифровые решения без ущерба удобству.</p>
      </Reveal>

      <div className="capabilities-grid">
        {capabilities.map(([number, title, description], index) => (
          <Reveal delay={index * 0.05} key={number}>
            <SpotlightCard className="capability-card">
              <span className="cap-number">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <ArrowUpRight className="cap-arrow" size={18} />
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="principles">
        <div className="principles-copy">
          <span className="eyebrow"><Asterisk size={15} /> Принципы</span>
          <p>Смысл важнее декора.<br />Анимация должна помогать.<br />Сначала ясность, потом эффектность.</p>
        </div>
        <div className="principles-orbit" aria-hidden="true">
          <div className="orbit-track"><span className="orbit-dot" /></div>
          <div className="orbit-core">UX</div>
        </div>
      </Reveal>
    </section>
  )
}

function Marquee() {
  const items = ['ДИЗАЙН', 'ПРОТОТИПИРОВАНИЕ', 'ADOBE PHOTOSHOP', 'ADOBE ILLUSTRATOR', 'FIGMA']
  const groupItems = Array.from({ length: 4 }, () => items).flat()
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div className="marquee-group" key={group}>
            {groupItems.map((item, index) => <span key={`${group}-${item}-${index}`}>{item}<i>✦</i></span>)}
          </div>
        ))}
      </div>
    </div>
  )
}

function Contact() {
  return (
    <section id="contact" className="contact section-shell">
      <Reveal>
        <div className="contact-panel">
          <div className="contact-kicker"><span className="status-dot" /> Открыт для интересных коллабораций</div>
          <h2>Есть идея,<br />которую стоит реализовать?</h2>
          <p>Расскажите, на каком этапе вы сейчас, куда должен прийти продукт и каким должен быть успешный результат.</p>
          <p className="contact-mail-prompt">Напишите мне на почту — обсудим задачу, сроки и формат работы.</p>
          <div className="contact-foot">
            <a href={`mailto:${site.email}`}><Mail size={15} /> {site.email}</a>
            <span>{site.location}</span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer section-shell">
      <span>© 2026 {site.name}</span>
      <span>Продуманный дизайн.</span>
      <a href="#top">Наверх ↑</a>
    </footer>
  )
}

export default function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <div className="noise" aria-hidden="true" />
      <CursorGlow />
      <Header />
      <MobileLimelightNav />
      <main>
        <Hero />
        <Work />
        <Marquee />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
