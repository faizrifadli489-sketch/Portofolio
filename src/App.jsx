import { useEffect, useRef, useState } from 'react'
import { nav, profile, skills, projects, journey, socials } from './data'
import { scrollState } from './scroll'
import Scene from './scene/Scene'
import { useReducedMotion, usePointerParallax, usePageScroll, useReveal, useActiveSection } from './hooks'

const navIds = nav.map((n) => n.id)

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, shown] = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'shown' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function Nav({ active }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className="nav">
        <a className="brand" href="#top" aria-label="Kembali ke atas">
          <span className="brand-mark" aria-hidden="true">{profile.initials}</span>
          <span>{profile.name.split(' ')[0].toLowerCase()}</span>
        </a>

        <nav className="nav-links" aria-label="Navigasi utama">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${active === item.id ? 'active' : ''}`}
              aria-current={active === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="nav-cta" href={`mailto:${profile.email}`}>
          <span>Ngobrol</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 10 10 2M10 2H4.5M10 2v5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </a>

        <button
          type="button"
          className={`nav-toggle ${open ? 'open' : ''}`}
          aria-expanded={open}
          aria-controls="nav-drawer"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      {open && (
        <>
          <div className="nav-scrim" onClick={close} aria-hidden="true" />
          <nav className="nav-drawer" id="nav-drawer" aria-label="Navigasi seluler">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? 'active' : ''}
                onClick={close}
              >
                {item.label}
              </a>
            ))}
            <a className="nav-drawer-cta" href={`mailto:${profile.email}`} onClick={close}>
              Ngobrol — {profile.email}
            </a>
          </nav>
        </>
      )}
    </>
  )
}

function Hero() {
  return (
    <section className="hero wrap" id="top">
      <div className="hero-inner">
        <span className="eyebrow">Portofolio · {profile.location}</span>
        <h1>
          <span className="thin">Melewati</span>
          <br />
          <span className="glow">cakrawala</span> ide.
        </h1>
        <p className="hero-lede">{profile.tagline}</p>

        <div className="hero-actions">
          <a className="btn btn-primary" href="#work">
            Lihat karya
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2v10M2.5 7.5 7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
      </div>

      <div className="hero-foot">
        <div className="stats">
          {profile.stats.map((s) => (
            <div key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="scroll-hint">
          <span />
          Gulir untuk jatuh
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section wrap" id="about">
      <div className="section-head">
        <div>
          <span className="eyebrow">01 — Tentang</span>
          <h2 className="section-title">Gravitasi kecil yang konsisten.</h2>
        </div>
        <p className="section-note">
          Saya bekerja di persimpangan desain dan rekayasa — tempat detail kecil menentukan apakah
          sebuah produk terasa hidup.
        </p>
      </div>

      <Reveal>
        <div className="about-grid">
          <div className="about-copy">
            <p>{profile.intro}</p>
            <p>
              Di luar layar saya mengoleksi foto langit malam dan partitur film. Keduanya punya
              pelajaran yang sama: kesabaran pada komposisi, dan keberanian untuk membiarkan ruang
              kosong.
            </p>
          </div>

          <dl className="facts">
            <div className="fact">
              <dt>Peran</dt>
              <dd>{profile.role}</dd>
            </div>
            <div className="fact">
              <dt>Berbasis di</dt>
              <dd>{profile.location}</dd>
            </div>
            <div className="fact">
              <dt>Status</dt>
              <dd>Terbuka untuk proyek Q3 2026</dd>
            </div>
            <div className="fact">
              <dt>Fokus</dt>
              <dd>WebGL · Design System · Performa</dd>
            </div>
          </dl>
        </div>
      </Reveal>
    </section>
  )
}

function Skills() {
  const [inView, setInView] = useState(false)
  const [ref, shown] = useReveal()

  useEffect(() => {
    if (shown) setInView(true)
  }, [shown])

  return (
    <section className="section wrap" id="skills">
      <div className="section-head">
        <div>
          <span className="eyebrow">02 — Keahlian</span>
          <h2 className="section-title">Instrumen yang saya pakai.</h2>
        </div>
        <p className="section-note">
          Persentase bukan angka mutlak — ini cara saya mengukur kenyamanan, bukan penguasaan.
        </p>
      </div>

      <div ref={ref} className="skills-grid">
        {skills.map((skill, i) => (
          <div className="skill" key={skill.name}>
            <div className="skill-top">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-pct">{String(skill.level).padStart(2, '0')}</span>
            </div>
            <div className="skill-note">{skill.note}</div>
            <div className="bar">
              <span
                className="bar-fill"
                style={{
                  width: inView ? `${skill.level}%` : 0,
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Work() {
  return (
    <section className="section wrap" id="work">
      <div className="section-head">
        <div>
          <span className="eyebrow">03 — Karya</span>
          <h2 className="section-title">Empat orbit terpilih.</h2>
        </div>
        <p className="section-note">Dari eksperimen WebGL sampai sistem desain yang dipakai tiap hari.</p>
      </div>

      <div className="work-grid">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <a
              className="card"
              style={{ '--hue': p.hue }}
              href={p.href || '#'}
              target={p.href ? '_blank' : undefined}
              rel={p.href ? 'noreferrer' : undefined}
              aria-label={`${p.title} — ${p.category}`}
            >
              <div className="card-top">
                <span className="card-idx">{p.id}</span>
                <span>{p.year}</span>
              </div>
              <h3>{p.title}</h3>
              <div className="mono" style={{ marginTop: '0.15rem' }}>
                {p.category}
              </div>
              <p>{p.desc}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <span className="card-arrow" aria-hidden="true">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10 10 2M10 2H4.5M10 2v5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Journey() {
  return (
    <section className="section wrap" id="journey">
      <div className="section-head">
        <div>
          <span className="eyebrow">04 — Perjalanan</span>
          <h2 className="section-title">Jejak yang membentuk orbit.</h2>
        </div>
        <p className="section-note">Tidak selalu lurus, tapi selalu maju.</p>
      </div>

      <Reveal>
        <div className="timeline">
          {journey.map((j) => (
            <div className="tl-item" key={`${j.year}-${j.title}`}>
              <div className="tl-year">{j.year}</div>
              <div className="tl-title">{j.title}</div>
              <div className="tl-org">{j.org}</div>
              <p className="tl-desc">{j.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact wrap" id="contact">
      <span className="eyebrow" style={{ justifyContent: 'center' }}>
        05 — Kontak
      </span>
      <h2>
        Ada ide yang butuh
        <br />
        <span className="glow">gravitasi?</span>
      </h2>
      <p>
        Saya membuka beberapa slot proyek per kuartal. Ceritakan masalahnya dulu — solusinya bisa
        kita cari bersama.
      </p>
      <a className="mail" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>

      <div className="socials">
        {socials.map((s) => (
          <a className="social" key={s.label} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
            <span style={{ opacity: 0.5 }}>{s.handle}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default function App({ withoutScene = false }) {
  const reduced = useReducedMotion()
  const active = useActiveSection(navIds)
  const [loaded, setLoaded] = useState(false)
  const barRef = useRef(null)

  usePageScroll()
  usePointerParallax(!reduced)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 900)
    return () => clearTimeout(t)
  }, [])

  // Progress bar digerakkan langsung lewat style supaya scroll tetap 60fps
  // (tanpa memicu re-render seluruh halaman di tiap frame).
  useEffect(() => {
    let raf = 0
    let running = true
    const tick = () => {
      if (!running) return
      if (barRef.current) {
        const p = scrollState.progress
        barRef.current.style.transform = `scaleX(${p})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      running = false
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Lompat ke konten</a>

      <div className={`loader ${loaded ? 'gone' : ''}`} aria-hidden={loaded}>
        <div className="loader-ring" />
        <div className="loader-text">Menyelaraskan orbit</div>
      </div>

      <div ref={barRef} className="progress-bar" style={{ transform: 'scaleX(0)' }} />

      {withoutScene ? <div className="scene-fallback" /> : <Scene reduced={reduced} />}

      <Nav active={active} />

      <main className="app" id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Journey />
        <Contact />

        <footer className="footer">
          <span>
            {profile.name} <span className="footer-dot">·</span> {new Date().getFullYear()}
          </span>
          <span>Dirancang &amp; dibangun di {profile.location}</span>
        </footer>
      </main>
    </>
  )
}
