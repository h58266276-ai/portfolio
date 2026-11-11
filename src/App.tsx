import { lazy, Suspense, useEffect, useState, type FormEvent } from 'react'
import { dict, TG, type Lang } from './i18n'

const River = lazy(() => import('./River'))
const API = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'noapi'

function initialLang(): Lang {
  const saved = localStorage.getItem('lang')
  if (saved === 'uk' || saved === 'en') return saved
  const nav = navigator.language
  return nav.startsWith('uk') || nav.startsWith('ru') ? 'uk' : 'en'
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [status, setStatus] = useState<Status>('idle')
  const t = dict[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
  }, [lang])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!API) return setStatus('noapi')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    setStatus('sending')
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <header className="top">
        <a className="mark" href="#top" aria-label="Ivan Bochma">
          ІБ
        </a>
        <nav aria-label="Main">
          <a href="#work">{t.nav.work}</a>
          <a href="#services">{t.nav.services}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="lang" role="group" aria-label="Language">
          <button type="button" aria-pressed={lang === 'uk'} onClick={() => setLang('uk')}>
            UA
          </button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
            EN
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <Suspense fallback={<div className="river river--fallback" />}>
            <River />
          </Suspense>
          <div className="hero__body">
            <p className="status">
              <span className="dot" aria-hidden="true" />
              {t.hero.status}
            </p>
            <h1 className="hero__title">{t.hero.title}</h1>
            <p className="hero__lead">{t.hero.lead}</p>
            <div className="hero__actions">
              <a className="btn" href="#contact">
                {t.hero.cta}
              </a>
              <a className="link" href={TG} target="_blank" rel="noreferrer">
                Telegram @iyiny
              </a>
            </div>
          </div>
        </section>

        <section id="work" className="work">
          <div className="section-head">
            <h2>{t.workTitle}</h2>
            <p>{t.workLead}</p>
          </div>
          <ul className="grid">
            {t.projects.map((p, i) => {
              const inner = (
                <>
                  {p.img ? (
                    <div className="shot">
                      <img src={p.img} alt={`${p.name}: ${p.kind}`} loading="lazy" width={1200} height={750} />
                    </div>
                  ) : (
                    <div className="shot shot--type" aria-hidden="true">
                      <span>{p.name}</span>
                    </div>
                  )}
                  <div className="meta">
                    <h3>{p.name}</h3>
                    <p className="kind">{p.kind}</p>
                    <p className="text">{p.text}</p>
                    <p className="stack">{p.stack}</p>
                    {p.href && <span className="open">{p.cta ?? t.open}</span>}
                  </div>
                </>
              )
              return (
                <li key={p.name} className={`tile tile--${i}`}>
                  {p.href ? (
                    <a className="tile__inner" href={p.href} target="_blank" rel="noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <div className="tile__inner">{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <section id="services" className="services">
          <h2>{t.servicesTitle}</h2>
          <dl>
            {t.services.map((s) => (
              <div className="row" key={s.name}>
                <dt>{s.name}</dt>
                <dd className="desc">{s.text}</dd>
                <dd className="price">{s.price}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="steps">
          <h2>{t.stepsTitle}</h2>
          <ol>
            {t.steps.map((s) => (
              <li key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="contact">
          <div className="contact__intro">
            <h2>{t.contactTitle}</h2>
            <p>{t.contactLead}</p>
            <a className="tg" href={TG} target="_blank" rel="noreferrer">
              @iyiny
            </a>
          </div>
          <form onSubmit={submit}>
            <label>
              <span>{t.form.name}</span>
              <input name="name" required maxLength={80} autoComplete="name" />
            </label>
            <label>
              <span>{t.form.contact}</span>
              <input name="contact" required maxLength={120} placeholder={t.form.contactHint} />
            </label>
            <label>
              <span>{t.form.message}</span>
              <textarea name="message" required minLength={10} maxLength={2000} rows={5} />
            </label>
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="btn" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? t.form.sending : t.form.send}
            </button>
            <p className={`form-status form-status--${status}`} role="status" aria-live="polite">
              {status === 'sent' && t.form.sent}
              {status === 'error' && t.form.error}
              {status === 'noapi' && t.form.noApi}
            </p>
          </form>
        </section>
      </main>

      <footer className="foot">
        <p>{t.footer}</p>
      </footer>
    </>
  )
}
