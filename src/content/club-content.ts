export type SectionThemeName =
  | 'night'
  | 'milk'
  | 'signal-red'
  | 'electric-blue'

export interface SectionTheme {
  background: string
  foreground: string
  accent: string
  accentSoft: string
  panel: string
  outline: string
  glow: string
}

export interface ContactConfig {
  telegram: string
  whatsapp: string
  phone: string
  address: string
  mapEmbedUrl: string
  mapsUrl: string
  formActionUrl: string
}

export interface LeadFormModel {
  name: string
  contact: string
  interest: string
}

export interface HeroSceneAction {
  label: string
  href: string
}

export interface HeroRibbonFact {
  value: string
  label: string
}

export interface HeroScene {
  status: string
  city: string
  headline: string
  subcopy: string
  chips: string[]
  primaryAction: HeroSceneAction
  secondaryAction: HeroSceneAction
  ribbonFacts: HeroRibbonFact[]
}

export interface NavigationItem {
  type: 'section' | 'page'
  label: string
  href: string
}

export interface StoryChapter {
  id: string
  title: string
  kicker: string
  body: string
  support: string
  theme: SectionThemeName
  sceneType: 'orbit' | 'ladder' | 'precision' | 'arena'
  motifs: string[]
  ctaLabel: string
  metric: string
  metricLabel: string
  visualImage: string
  visualAlt: string
}

export const sitePath = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

export const assetPath = sitePath

export const sectionThemes: Record<SectionThemeName, SectionTheme> = {
  night: {
    background: '#091224',
    foreground: '#f6efe4',
    accent: '#45b9ff',
    accentSoft: 'rgba(69, 185, 255, 0.18)',
    panel: '#0f1c33',
    outline: 'rgba(255, 255, 255, 0.14)',
    glow: 'rgba(69, 185, 255, 0.38)',
  },
  milk: {
    background: '#f2ece3',
    foreground: '#0a1830',
    accent: '#0d67b5',
    accentSoft: 'rgba(13, 103, 181, 0.14)',
    panel: '#fffaf3',
    outline: 'rgba(10, 24, 48, 0.1)',
    glow: 'rgba(13, 103, 181, 0.26)',
  },
  'signal-red': {
    background: '#b9212f',
    foreground: '#fff4ea',
    accent: '#ffe07a',
    accentSoft: 'rgba(255, 224, 122, 0.16)',
    panel: '#d63241',
    outline: 'rgba(255, 255, 255, 0.16)',
    glow: 'rgba(255, 224, 122, 0.3)',
  },
  'electric-blue': {
    background: '#1f67d8',
    foreground: '#eff7ff',
    accent: '#ff4d52',
    accentSoft: 'rgba(255, 77, 82, 0.14)',
    panel: '#2d7bef',
    outline: 'rgba(255, 255, 255, 0.16)',
    glow: 'rgba(88, 185, 255, 0.28)',
  },
}

export const contactConfig: ContactConfig = {
  telegram: '',
  whatsapp: '',
  phone: '',
  address: 'Казань, точный адрес клуба будет опубликован ближе к открытию.',
  mapEmbedUrl: assetPath('/media/kazan-map.png'),
  mapsUrl: 'https://yandex.ru/maps/43/kazan/',
  formActionUrl: '',
}

export const leadFormModel: LeadFormModel = {
  name: '',
  contact: '',
  interest: '',
}

export const storyChapters: StoryChapter[] = [
  {
    id: 'rent',
    title: 'Аренда столов и инвентаря',
    kicker: 'Свободная игра',
    body: 'Формат для тех, кто хочет прийти без барьера, взять темп под себя и просто играть в хорошем пространстве.',
    support:
      'Профессиональные столы, готовый инвентарь и клубная среда, в которой комфортно задержаться после первого же визита.',
    theme: 'milk',
    sceneType: 'orbit',
    motifs: ['Сразу готово к игре', 'Для пар, друзей и рабочих спаррингов', 'Без перегруза и суеты'],
    ctaLabel: 'Собрать формат аренды',
    metric: '01',
    metricLabel: 'вход в клуб',
    visualImage: assetPath('/media/table-photo.jpg'),
    visualAlt: 'Стол для настольного тенниса',
  },
  {
    id: 'groups',
    title: 'Секции для детей и взрослых',
    kicker: 'Рост по системе',
    body: 'Не хаотичные занятия, а понятная траектория: от первого касания до уверенного игрового ритма.',
    support:
      'Группы по уровню подготовки, мягкий вход для новичков, детский формат и маршруты, в которых развитие ощущается, а не обещается.',
    theme: 'signal-red',
    sceneType: 'ladder',
    motifs: ['Группы по уровню', 'Детские и взрослые форматы', 'Беби-теннис в общей системе'],
    ctaLabel: 'Подобрать группу',
    metric: '02',
    metricLabel: 'системный рост',
    visualImage: assetPath('/media/paddles-photo.jpg'),
    visualAlt: 'Ракетки и мячи у сетки',
  },
  {
    id: 'personal',
    title: 'Персональные тренировки',
    kicker: 'Точечная работа',
    body: 'Формат для тех, кому нужен быстрый прирост в технике, темпе, реакции и понимании розыгрыша.',
    support:
      'Когда нужен не общий фон, а персональная работа над подачей, чтением игры и точностью движений, персоналка становится главной сценой.',
    theme: 'electric-blue',
    sceneType: 'precision',
    motifs: ['Техника и подача', 'Индивидуальный темп прогресса', 'Подготовка к игровым задачам'],
    ctaLabel: 'Выбрать персональный формат',
    metric: '03',
    metricLabel: 'точный фокус',
    visualImage: assetPath('/media/paddles-photo.jpg'),
    visualAlt: 'Ракетки как образ персональной тренировки',
  },
  {
    id: 'tournaments',
    title: 'Турниры и клубный ритм',
    kicker: 'Комьюнити и азарт',
    body: 'Клуб нужен не только для занятий. Он нужен, чтобы возвращаться в среду, где есть люди, встречи, розыгрыши и внутреннее движение.',
    support:
      'Турниры, спарринги, анонсы, совместный ритм и ощущение собственного теннисного круга вместо разрозненных посещений.',
    theme: 'night',
    sceneType: 'arena',
    motifs: ['Внутренние турниры', 'Клубные встречи', 'Среда, куда хочется вернуться'],
    ctaLabel: 'Следить за запуском клуба',
    metric: '04',
    metricLabel: 'ритм сообщества',
    visualImage: assetPath('/media/table-photo.jpg'),
    visualAlt: 'Теннисный стол как сцена для турниров',
  },
]

export const clubContent = {
  brand: {
    name: 'Сфера',
    fullName: 'Клуб настольного тенниса «Сфера»',
    city: 'Казань',
    mark: assetPath('/favicon.svg'),
  },
  navigation: [
    { type: 'section', label: 'Направления', href: '#services' },
    { type: 'page', label: 'IT', href: sitePath('/it-offer/') },
    { type: 'section', label: 'Уровень клуба', href: '#level' },
    { type: 'section', label: 'Ритм клуба', href: '#community' },
    { type: 'section', label: 'Локация', href: '#location' },
    { type: 'section', label: 'FAQ', href: '#faq' },
    { type: 'section', label: 'Контакты', href: '#contacts' },
  ] satisfies NavigationItem[],
  heroScene: {
    status: 'Скоро открытие',
    city: 'Казань',
    headline: 'Сфера. Настольный теннис нового ритма.',
    subcopy:
      'Аренда столов, секции, персональные тренировки и клубные турниры в одном сильном пространстве для тех, кто хочет не просто играть, а остаться в игре надолго.',
    chips: ['Аренда', 'Секции', 'Персоналки', 'Турниры'],
    primaryAction: {
      label: 'Оставить заявку',
      href: '#contacts',
    },
    secondaryAction: {
      label: 'Открыть направления',
      href: '#services',
    },
    ribbonFacts: [
      { value: '01', label: 'пространство для свободной игры' },
      { value: '02', label: 'маршруты роста для детей и взрослых' },
      { value: '03', label: 'персональная работа и турнирный ритм' },
    ],
  } satisfies HeroScene,
  chapterIntro: {
    kicker: 'Направления клуба',
    title: 'Направления клуба работают как отдельные сценарии, а не как список услуг.',
    description:
      'Текст, ритм, цвет и подача меняются вместе со сценой, поэтому блок читается как история клуба, а не как набор карточек.',
  },
  proof: {
    kicker: 'Почему «Сфера»',
    title: '«Сфера» задумана как клубная среда, а не как формальный спорткомплекс.',
    intro:
      'Здесь важны свет, дистанция, качество инвентаря и ощущение спокойного сильного уровня без лишнего пафоса.',
    sceneLabel: 'Клубный стандарт',
    sceneQuote: 'Свет. Ритм. Техника. Среда.',
    items: [
      {
        title: 'Пространство с воздухом',
        description: 'Не тесный зал, а продуманная сцена для игры, движения и спокойной концентрации.',
      },
      {
        title: 'Профессиональное оборудование',
        description: 'Инвентарь и столы под настоящий тренировочный темп, а не под случайный компромисс.',
      },
      {
        title: 'Люди, которые держат планку',
        description: 'От новичков до амбициозных игроков здесь считывается общая культура игры и роста.',
      },
      {
        title: 'Комьюнити, а не одноразовый визит',
        description: 'Клуб строится так, чтобы после первой игры хотелось вернуться уже за своим маршрутом.',
      },
    ],
  },
  journey: {
    kicker: 'Ритм клуба',
    title: 'Регулярная игра начинается с понятного сценария.',
    description:
      'Сначала вход без барьера, затем устойчивый тренировочный ритм и собственное теннисное окружение.',
    quote:
      'Аренда, обучение, персональный прогресс и турниры должны складываться в один живой клубный цикл.',
    steps: [
      {
        title: 'Войти без напряжения',
        description: 'Можно начать с аренды, пробного визита или первого знакомства с секцией и не чувствовать себя чужим.',
      },
      {
        title: 'Поймать свой темп',
        description: 'Дальше включаются персоналки, группы по уровню и более осознанный тренировочный ритм.',
      },
      {
        title: 'Остаться внутри среды',
        description: 'Через встречи, турниры и спарринги клуб превращается в точку собственной игровой привычки.',
      },
    ],
  },
  location: {
    kicker: 'Локация',
    title: 'Точный адрес и финальные контакты откроем ближе к запуску.',
    description:
      'Первый релиз уже собирает интерес и объясняет идею клуба. Адрес, телефон и прямые ссылки подключаются отдельно, без перестройки страницы.',
    features: [
      'Яндекс Карты остаются главным локальным ориентиром',
      'Контакты подключаются отдельно и не ломают композицию',
      'Сайт уже готов к pre-launch коммуникации',
    ],
    badge: 'KZN / launch soon',
  },
  faqIntro: {
    kicker: 'FAQ',
    title: 'Короткий финал отвечает на главные вопросы и спокойно подводит к заявке.',
    description:
      'Внизу остаются только FAQ, контакты и форма без лишнего визуального шума.',
  },
  faq: [
    {
      question: 'Когда откроется клуб?',
      answer:
        'Сейчас «Сфера» находится на финальном этапе подготовки. Мы используем формат pre-launch и сообщим дату сразу после финального подтверждения.',
    },
    {
      question: 'Можно ли будет просто арендовать стол?',
      answer:
        'Да. Аренда столов и инвентаря — один из базовых сценариев клуба для свободной игры, дружеских встреч и самостоятельной практики.',
    },
    {
      question: 'Подходит ли клуб тем, кто только начинает?',
      answer:
        'Да. В клубе предусмотрены мягкий вход, группы по уровню и форматы, в которых новичок не чувствует себя лишним.',
    },
    {
      question: 'Будут ли персональные тренировки и турниры?',
      answer:
        'Да. Персональная работа и клубные турнирные сценарии входят в основу первого релиза и остаются частью клуба после запуска.',
    },
  ],
  finalCta: {
    title: 'Оставьте интерес к открытию. Вернёмся с адресом, расписанием и стартом набора.',
    description:
      'Форма уже готова к pre-launch сбору интереса. Когда подключим реальные контакты, этот блок сразу станет рабочей конверсионной точкой.',
  },
}
