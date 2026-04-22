import {
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react'
import './App.css'
import {
  assetPath,
  clubContent,
  contactConfig,
  leadFormModel,
  sectionThemes,
  storyChapters,
  type StoryChapter,
} from '@/content/club-content'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

const sectionIds = clubContent.navigation.map((item) => item.href.replace('#', ''))

function App() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const heroRef = useRef<HTMLElement | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? 'services')
  const [formValues, setFormValues] = useState(leadFormModel)
  const [formTone, setFormTone] = useState<'idle' | 'error' | 'info' | 'success'>('idle')
  const [formMessage, setFormMessage] = useState('')

  const messengerHref = contactConfig.telegram || contactConfig.whatsapp || '#contacts'

  const activateChapter = (index: number) => {
    startTransition(() => {
      setActiveChapterIndex(index)
    })
  }

  const handleHeroPointerMove = useEffectEvent((event: PointerEvent) => {
    if (prefersReducedMotion) {
      return
    }

    const hero = heroRef.current

    if (!hero) {
      return
    }

    const rect = hero.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    hero.style.setProperty('--cursor-x', `${(x - 0.5) * 30}px`)
    hero.style.setProperty('--cursor-y', `${(y - 0.5) * 30}px`)
  })

  const resetHeroPointer = useEffectEvent(() => {
    const hero = heroRef.current

    if (!hero) {
      return
    }

    hero.style.setProperty('--cursor-x', '0px')
    hero.style.setProperty('--cursor-y', '0px')
  })

  const revealObservedSections = useEffectEvent((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-revealed', 'true')
      }
    }
  })

  const updateActiveSection = useEffectEvent((entries: IntersectionObserverEntry[]) => {
    const visibleSections = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

    const nextSection = visibleSections[0]?.target.id

    if (nextSection) {
      setActiveSection(nextSection)
    }
  })

  useEffect(() => {
    const hero = heroRef.current

    if (!hero || prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      handleHeroPointerMove(event)
    }

    const onPointerLeave = () => {
      resetHeroPointer()
    }

    hero.addEventListener('pointermove', onPointerMove)
    hero.addEventListener('pointerleave', onPointerLeave)

    return () => {
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (prefersReducedMotion) {
      for (const element of elements) {
        element.setAttribute('data-revealed', 'true')
      }

      return
    }

    const observer = new IntersectionObserver(revealObservedSections, {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    })

    for (const element of elements) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  useEffect(() => {
    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter(Boolean) as HTMLElement[]

    if (!sections.length) {
      return
    }

    const observer = new IntersectionObserver(updateActiveSection, {
      threshold: 0.45,
      rootMargin: '-12% 0px -45% 0px',
    })

    for (const section of sections) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const handleChapterKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return
    }

    event.preventDefault()

    if (event.key === 'Home') {
      activateChapter(0)
      return
    }

    if (event.key === 'End') {
      activateChapter(storyChapters.length - 1)
      return
    }

    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
    const nextIndex = (index + direction + storyChapters.length) % storyChapters.length
    activateChapter(nextIndex)
  }

  const handleShowcasePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    touchStartRef.current = { x: event.clientX, y: event.clientY }
  }

  const handleShowcasePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const touchStart = touchStartRef.current

    if (!touchStart) {
      return
    }

    const deltaX = event.clientX - touchStart.x
    const deltaY = event.clientY - touchStart.y

    touchStartRef.current = null

    if (Math.abs(deltaX) < 56 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return
    }

    const nextIndex =
      deltaX < 0
        ? (activeChapterIndex + 1) % storyChapters.length
        : (activeChapterIndex - 1 + storyChapters.length) % storyChapters.length

    activateChapter(nextIndex)
  }

  const handleShowcasePointerCancel = () => {
    touchStartRef.current = null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextName = formValues.name.trim()
    const nextContact = formValues.contact.trim()

    if (!nextName || !nextContact) {
      setFormTone('error')
      setFormMessage('Заполните имя и способ связи, чтобы клуб мог вернуться к вам после старта.')
      return
    }

    if (!contactConfig.formActionUrl) {
      setFormTone('info')
      setFormMessage(
        'Форма уже встроена в лендинг. Для боевого режима останется подключить Telegram, WhatsApp или обработчик заявок.',
      )
      return
    }

    setFormTone('success')
    setFormMessage('Интерес к запуску сохранён. Вернёмся с адресом, расписанием и стартом набора.')
    setFormValues(leadFormModel)
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#hero" aria-label="К началу страницы">
          <span className="brand-lockup__mark">
            <img src={clubContent.brand.mark} alt="" width="44" height="44" />
          </span>
          <span className="brand-lockup__text">
            <strong>{clubContent.brand.fullName}</strong>
            <small>{clubContent.brand.city}</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Разделы страницы">
          {clubContent.navigation.map((item) => {
            const targetId = item.href.replace('#', '')

            return (
              <a
                key={item.href}
                href={item.href}
                className={targetId === activeSection ? 'is-active' : ''}
                aria-current={targetId === activeSection ? 'location' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <a className="header-cta" href="#contacts">
          Оставить интерес
        </a>
      </header>

      <main>
        <section ref={heroRef} className="hero" id="hero">
          <div className="hero__veil" aria-hidden="true" />
          <div className="hero__inner section-shell">
            <div className="hero__copy" data-reveal>
              <span className="hero__status">
                <span className="hero__status-dot" />
                {clubContent.heroScene.status}
              </span>
              <p className="hero__city">{clubContent.heroScene.city}</p>
              <h1>{clubContent.heroScene.headline}</h1>
              <p className="hero__description">{clubContent.heroScene.subcopy}</p>

              <div className="hero__actions">
                <a className="button button--primary" href={clubContent.heroScene.primaryAction.href}>
                  {clubContent.heroScene.primaryAction.label}
                </a>
                <a className="button button--secondary" href={messengerHref}>
                  {messengerHref === '#contacts'
                    ? clubContent.heroScene.secondaryAction.label
                    : 'Написать в клуб'}
                </a>
              </div>

              <ul className="hero__chips" aria-label="Ключевые форматы клуба">
                {clubContent.heroScene.chips.map((chip) => (
                  <li key={chip}>{chip}</li>
                ))}
              </ul>
            </div>

            <div className="hero__world" data-reveal aria-hidden="true">
              <div className="hero__halo hero__halo--blue" />
              <div className="hero__halo hero__halo--red" />
              <div className="hero__court-plane" />
              <div className="hero__court-grid" />
              <div className="hero__net" />
              <div className="hero__arc hero__arc--blue" />
              <div className="hero__arc hero__arc--red" />
              <div className="hero__paddle hero__paddle--red">
                <span />
              </div>
              <div className="hero__paddle hero__paddle--blue">
                <span />
              </div>
              <div className="hero__ball hero__ball--main" />
              <div className="hero__ball hero__ball--small" />
              <div className="hero__seal">
                <span>{clubContent.brand.city}</span>
                <strong>table tennis club</strong>
                <p>{clubContent.brand.name}</p>
              </div>
            </div>
          </div>

          <div className="hero__ribbon-wrap section-shell" data-reveal>
            <div className="hero__ribbon">
              {clubContent.heroScene.ribbonFacts.map((fact) => (
                <article key={fact.label}>
                  <strong>{fact.value}</strong>
                  <span>{fact.label}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter-section" id="services">
          <div className="chapter-section__wave" aria-hidden="true" />
          <div className="section-shell chapter-section__inner">
            <SectionIntro
              kicker={clubContent.chapterIntro.kicker}
              title={clubContent.chapterIntro.title}
              description={clubContent.chapterIntro.description}
            />

            <div
              className="chapter-showcase"
              data-reveal
              onPointerDown={handleShowcasePointerDown}
              onPointerUp={handleShowcasePointerUp}
              onPointerCancel={handleShowcasePointerCancel}
            >
              <div className="chapter-rail" aria-label="Главы клуба">
                {storyChapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    type="button"
                    className={index === activeChapterIndex ? 'is-active' : ''}
                    aria-pressed={index === activeChapterIndex}
                    onClick={() => activateChapter(index)}
                    onKeyDown={(event) => handleChapterKeyDown(event, index)}
                  >
                    <span>{chapter.metric}</span>
                    <strong>{chapter.title}</strong>
                    <small>{chapter.kicker}</small>
                  </button>
                ))}
              </div>

              <div className="chapter-stage-stack">
                {storyChapters.map((chapter, index) => (
                  <StoryStage
                    key={chapter.id}
                    chapter={chapter}
                    isActive={index === activeChapterIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-section" id="level">
          <div className="section-shell editorial-section__inner">
            <div className="editorial-copy" data-reveal>
              <SectionIntro
                kicker={clubContent.proof.kicker}
                title={clubContent.proof.title}
                description={clubContent.proof.intro}
                tone="dark"
              />

              <div className="editorial-quote">
                <span>{clubContent.proof.sceneLabel}</span>
                <strong>{clubContent.proof.sceneQuote}</strong>
              </div>
            </div>

            <div className="editorial-stage" data-reveal>
              <div className="editorial-stage__grid" aria-hidden="true" />
              <div className="editorial-stage__band editorial-stage__band--blue" aria-hidden="true" />
              <div className="editorial-stage__band editorial-stage__band--red" aria-hidden="true" />
              <figure className="editorial-stage__figure">
                <img
                  src={assetPath('/media/table-photo.jpg')}
                  alt="Теннисный стол как центральный объект клубного пространства"
                />
              </figure>

              <div className="editorial-stage__facts">
                {clubContent.proof.items.map((item, index) => (
                  <article key={item.title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="journey-section" id="community">
          <div className="journey-section__wave" aria-hidden="true" />
          <div className="section-shell journey-section__inner">
            <div className="journey-lead" data-reveal>
              <SectionIntro
                kicker={clubContent.journey.kicker}
                title={clubContent.journey.title}
                description={clubContent.journey.description}
              />
              <blockquote>{clubContent.journey.quote}</blockquote>
            </div>

            <div className="journey-strip" data-reveal>
              {clubContent.journey.steps.map((step, index) => (
                <article key={step.title} className={`journey-step journey-step--${index + 1}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="location-section" id="location">
          <div className="section-shell location-section__inner">
            <div className="location-copy" data-reveal>
              <SectionIntro
                kicker={clubContent.location.kicker}
                title={clubContent.location.title}
                description={clubContent.location.description}
                tone="dark"
              />

              <ul className="location-features">
                {clubContent.location.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <div className="location-links">
                <span className="location-badge">{clubContent.location.badge}</span>
                <span className="location-address">{contactConfig.address}</span>
                <a href={contactConfig.mapsUrl} target="_blank" rel="noreferrer">
                  Открыть Яндекс Карты
                </a>
              </div>
            </div>

            <div className="location-map" data-reveal>
              <div className="location-map__frame">
                <img
                  src={contactConfig.mapEmbedUrl}
                  alt="Карта Казани с ориентиром для будущего клуба Сфера"
                />
              </div>
              <div className="location-map__callout">
                <span>Launch zone</span>
                <strong>{clubContent.brand.fullName}</strong>
                <p>Точный адрес и схема входа появятся ближе к запуску, без перестройки страницы.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="final-section" id="faq">
          <div className="final-section__wave" aria-hidden="true" />
          <div className="section-shell final-section__inner">
            <div className="final-copy" data-reveal>
              <SectionIntro
                kicker={clubContent.faqIntro.kicker}
                title={clubContent.faqIntro.title}
                description={clubContent.faqIntro.description}
                tone="dark"
              />
            </div>

            <div className="final-layout">
              <div className="faq-list" data-reveal>
                {clubContent.faq.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>

              <div className="final-cta" id="contacts" data-reveal>
                <div className="final-cta__copy">
                  <span className="final-cta__eyebrow">Pre-launch contact</span>
                  <h3>{clubContent.finalCta.title}</h3>
                  <p>{clubContent.finalCta.description}</p>
                </div>

                <div className="contact-rail">
                  <ContactItem label="Telegram" href={contactConfig.telegram} />
                  <ContactItem label="WhatsApp" href={contactConfig.whatsapp} />
                  <ContactItem label="Телефон" href={contactConfig.phone ? `tel:${contactConfig.phone}` : ''} />
                </div>

                <form id="lead-form" className="lead-form" onSubmit={handleSubmit}>
                  <label htmlFor="lead-name">Имя</label>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    placeholder="Как к вам обращаться"
                    value={formValues.name}
                    onChange={(event) =>
                      setFormValues((current) => ({ ...current, name: event.target.value }))
                    }
                  />

                  <label htmlFor="lead-contact">Телефон или мессенджер</label>
                  <input
                    id="lead-contact"
                    name="contact"
                    type="text"
                    placeholder="+7 или @username"
                    value={formValues.contact}
                    onChange={(event) =>
                      setFormValues((current) => ({ ...current, contact: event.target.value }))
                    }
                  />

                  <button className="button button--primary button--full" type="submit">
                    Отправить интерес к открытию
                  </button>

                  <p
                    className={`lead-form__message lead-form__message--${formTone}`}
                    aria-live="polite"
                  >
                    {formMessage || 'Форма рассчитана на быстрый pre-launch контакт без лишних полей.'}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

interface SectionIntroProps {
  kicker: string
  title: string
  description: string
  tone?: 'light' | 'dark'
}

function SectionIntro({ kicker, title, description, tone = 'light' }: SectionIntroProps) {
  return (
    <div className={`section-intro section-intro--${tone}`}>
      <p className="section-intro__kicker">{kicker}</p>
      <h2>{title}</h2>
      <p className="section-intro__description">{description}</p>
    </div>
  )
}

interface StoryStageProps {
  chapter: StoryChapter
  isActive: boolean
}

function StoryStage({ chapter, isActive }: StoryStageProps) {
  const theme = sectionThemes[chapter.theme]

  return (
    <article
      className={`story-stage story-stage--${chapter.sceneType} ${isActive ? 'is-active' : ''}`}
      aria-hidden={!isActive}
      style={
        {
          '--stage-background': theme.background,
          '--stage-foreground': theme.foreground,
          '--stage-accent': theme.accent,
          '--stage-accent-soft': theme.accentSoft,
          '--stage-panel': theme.panel,
          '--stage-outline': theme.outline,
          '--stage-glow': theme.glow,
        } as CSSProperties
      }
    >
      <div className="story-stage__copy">
        <span className="story-stage__metric">
          {chapter.metric}
          <small>{chapter.metricLabel}</small>
        </span>
        <p className="story-stage__kicker">{chapter.kicker}</p>
        <h3>{chapter.title}</h3>
        <p className="story-stage__body">{chapter.body}</p>
        <p className="story-stage__support">{chapter.support}</p>

        <ul className="story-stage__motifs">
          {chapter.motifs.map((motif) => (
            <li key={motif}>{motif}</li>
          ))}
        </ul>

        <a className="story-stage__cta" href="#lead-form">
          {chapter.ctaLabel}
        </a>
      </div>

      <div className="story-stage__visual">
        <div className="story-stage__noise" aria-hidden="true" />
        <div className="story-stage__ring story-stage__ring--primary" aria-hidden="true" />
        <div className="story-stage__ring story-stage__ring--secondary" aria-hidden="true" />
        <div className="story-stage__court" aria-hidden="true" />
        <div className="story-stage__trail" aria-hidden="true" />
        <div className="story-stage__stamp" aria-hidden="true">
          <span>{chapter.kicker}</span>
          <strong>{chapter.metricLabel}</strong>
        </div>
        <figure className="story-stage__figure">
          <img src={chapter.visualImage} alt={chapter.visualAlt} />
        </figure>
      </div>
    </article>
  )
}

interface ContactItemProps {
  label: string
  href: string
}

function ContactItem({ label, href }: ContactItemProps) {
  if (!href) {
    return (
      <div className="contact-item contact-item--disabled" aria-disabled="true">
        <strong>{label}</strong>
        <span>Подключим к финальному релизу</span>
      </div>
    )
  }

  const isHttp = href.startsWith('http')

  return (
    <a
      className="contact-item"
      href={href}
      target={isHttp ? '_blank' : undefined}
      rel={isHttp ? 'noreferrer' : undefined}
    >
      <strong>{label}</strong>
      <span>Открыть контакт</span>
    </a>
  )
}

export default App
