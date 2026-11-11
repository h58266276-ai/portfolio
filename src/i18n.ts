export type Lang = 'uk' | 'en'

export type Project = {
  name: string
  kind: string
  text: string
  stack: string
  cta?: string
  img?: string
  href?: string
}

type Dict = {
  nav: { work: string; services: string; contact: string }
  hero: { title: string; lead: string; cta: string; status: string }
  workTitle: string
  botTitle: string
  botLead: string
  botPoints: string[]
  workLead: string
  open: string
  projects: Project[]
  servicesTitle: string
  services: { name: string; text: string; price: string }[]
  stepsTitle: string
  steps: { name: string; text: string }[]
  contactTitle: string
  contactLead: string
  form: {
    name: string
    contact: string
    contactHint: string
    message: string
    send: string
    sending: string
    sent: string
    error: string
    noApi: string
  }
  footer: string
}

const tg = 'https://t.me/iyiny'

export const TG = tg

export const dict: Record<Lang, Dict> = {
  uk: {
    nav: { work: 'Роботи', services: 'Послуги', contact: 'Написати' },
    hero: {
      title: 'Сайти й боти, через які до вас пишуть клієнти',
      lead: 'Я Іван, веброзробник з Дніпра. Роблю лендинги, магазини й Telegram-ботів для малого бізнесу та автоматизую рутину на Python.',
      cta: 'Обговорити проєкт',
      status: 'Беру нові замовлення',
    },
    workTitle: 'Роботи',
    botTitle: 'Спробуйте бота',
    botLead: 'Бот запису в барбершоп: клієнт обирає послугу, майстра й час, а власник одразу отримує повідомлення. Натисніть кнопки в телефоні.',
    botPoints: ['Запис без дзвінків, 24/7', 'Нагадування клієнту за годину', 'Заявка власнику одразу в Telegram'],
    workLead: 'Демо-проєкти, які можна відкрити й покликати: від кав’ярні до магазину з кошиком.',
    open: 'Відкрити сайт',
    projects: [
      {
        name: 'Коло',
        kind: 'Лендинг кав’ярні',
        text: 'Меню, атмосфера й бронювання столика в один екран на телефоні.',
        stack: 'HTML, CSS, JS · Cloudflare',
        img: '/work/kolo-coffee.jpg',
        href: 'https://kolo-coffee.radar-ib7.workers.dev',
      },
      {
        name: 'Грань',
        kind: 'Барбершоп з онлайн-записом',
        text: 'Послуги з цінами, вибір майстра й часу — без дзвінків і черги.',
        stack: 'JS, форма запису · Cloudflare',
        img: '/work/hran-barber.jpg',
        href: 'https://hran-barber.radar-ib7.workers.dev',
      },
      {
        name: 'Пасіка Коваля',
        kind: 'Інтернет-магазин меду',
        text: 'Каталог, кошик і оформлення замовлення з доставкою Новою поштою.',
        stack: 'JS, кошик · Cloudflare',
        img: '/work/pasika-honey.jpg',
        href: 'https://pasika-honey.radar-ib7.workers.dev',
      },
      {
        name: 'Forma',
        kind: 'Сайт студії інтер’єру',
        text: 'Колекції, процес роботи й матеріали з акцентом на фотографії.',
        stack: 'HTML, CSS, JS · Cloudflare',
        img: '/work/forma-workshop.jpg',
        href: 'https://forma-workshop.radar-ib7.workers.dev',
      },
      {
        name: 'Радар',
        kind: 'Збирач замовлень для фрилансера',
        text: 'Chrome-розширення збирає замовлення з восьми бірж, фільтрує їх під навички й готує відгуки. Надіслати можна з телефона одним натиском.',
        stack: 'JS, Chrome Extension, Cloudflare Workers, D1',
      },
      {
        name: 'Відео-конвеєр',
        kind: 'Автоматичні ролики для TikTok',
        text: 'Сценарій → озвучка → анімація → готове відео. Рендер з коду, без ручного монтажу.',
        stack: 'Python, HyperFrames, ElevenLabs, ffmpeg',
        cta: 'Дивитись у TikTok',
        href: 'https://www.tiktok.com/@codexik',
      },
      {
        name: 'Бот запису',
        kind: 'Telegram-бот для барбершопу',
        text: 'Послуга → майстер → час → підтвердження й нагадування. Спробуйте прямо на сторінці.',
        stack: 'Python, aiogram 3 (код у репозиторії)',
        cta: 'Спробувати',
        href: '#bot',
      },
    ],
    servicesTitle: 'Послуги',
    services: [
      { name: 'Лендинг або сайт-візитка', text: 'Адаптивний сайт з формою заявок, базовим SEO і швидким завантаженням.', price: 'від 3 000 грн' },
      { name: 'Інтернет-магазин', text: 'WooCommerce або власний кошик, оплата й доставка, до 50 товарів.', price: 'від 6 000 грн' },
      { name: 'Telegram-бот', text: 'Прийом заявок і замовлень, сповіщення, відповіді клієнтам, Google Таблиці.', price: 'від 4 000 грн' },
      { name: 'Автоматизація на Python', text: 'Парсинг, обробка Excel і файлів, інтеграції з API — замість ручної роботи.', price: 'від 3 000 грн' },
      { name: 'Правки сайту', text: 'Мобільна версія, помилки, швидкість, форми.', price: 'від 800 грн' },
    ],
    stepsTitle: 'Як працюю',
    steps: [
      { name: 'Домовляємось', text: 'Обговорюємо задачу, фіксую ціну й термін письмово.' },
      { name: 'Показую першу версію', text: 'За 2–3 дні — робоча версія. Правки в межах задачі безкоштовні.' },
      { name: 'Запускаю', text: 'Публікую, перевіряю на телефоні й комп’ютері, передаю доступи.' },
    ],
    contactTitle: 'Розкажіть, що потрібно',
    contactLead: 'Відповім протягом дня. Або пишіть одразу в Telegram.',
    form: {
      name: 'Ім’я',
      contact: 'Telegram, телефон або email',
      contactHint: 'Куди вам відповісти',
      message: 'Що потрібно зробити',
      send: 'Надіслати',
      sending: 'Надсилаю…',
      sent: 'Надіслано. Відповім протягом дня.',
      error: 'Не вдалося надіслати. Напишіть, будь ласка, в Telegram.',
      noApi: 'Форма поки не підключена — напишіть у Telegram.',
    },
    footer: 'Іван Бочма · Дніпро · віддалено',
  },
  en: {
    nav: { work: 'Work', services: 'Services', contact: 'Contact' },
    hero: {
      title: 'Websites and bots that bring you customer messages',
      lead: "I'm Ivan, a web developer from Dnipro, Ukraine. I build landing pages, online stores and Telegram bots for small businesses, and automate routine work with Python.",
      cta: 'Discuss a project',
      status: 'Open to new work',
    },
    workTitle: 'Work',
    botTitle: 'Try the bot',
    botLead: 'A barbershop booking bot: the client picks a service, a barber and a time, and the owner gets a message instantly. Tap the buttons on the phone.',
    botPoints: ['Booking without calls, 24/7', 'Reminder to the client an hour before', 'Booking sent to the owner in Telegram instantly'],
    workLead: 'Demo projects you can open and click through — from a coffee shop to a store with a cart.',
    open: 'Open site',
    projects: [
      { name: 'Kolo', kind: 'Coffee shop landing page', text: 'Menu, mood and table booking on one phone screen.', stack: 'HTML, CSS, JS · Cloudflare', img: '/work/kolo-coffee.jpg', href: 'https://kolo-coffee.radar-ib7.workers.dev' },
      { name: 'Hran', kind: 'Barbershop with online booking', text: 'Services with prices, pick a barber and a time — no calls, no queue.', stack: 'JS, booking form · Cloudflare', img: '/work/hran-barber.jpg', href: 'https://hran-barber.radar-ib7.workers.dev' },
      { name: 'Kovalʹ Apiary', kind: 'Honey online store', text: 'Catalog, cart and checkout with Nova Poshta delivery.', stack: 'JS, cart · Cloudflare', img: '/work/pasika-honey.jpg', href: 'https://pasika-honey.radar-ib7.workers.dev' },
      { name: 'Forma', kind: 'Interior studio website', text: 'Collections, process and materials with photography up front.', stack: 'HTML, CSS, JS · Cloudflare', img: '/work/forma-workshop.jpg', href: 'https://forma-workshop.radar-ib7.workers.dev' },
      { name: 'Radar', kind: 'Order finder for freelancers', text: 'A Chrome extension collects jobs from eight marketplaces, filters them by skills and drafts replies. Send from your phone with one tap.', stack: 'JS, Chrome Extension, Cloudflare Workers, D1' },
      { name: 'Video pipeline', kind: 'Automated TikTok videos', text: 'Script → voice → animation → finished video. Rendered from code, no manual editing.', stack: 'Python, HyperFrames, ElevenLabs, ffmpeg', cta: 'Watch on TikTok', href: 'https://www.tiktok.com/@codexik' },
      { name: 'Booking bot', kind: 'Telegram bot for a barbershop', text: 'Service → barber → time → confirmation and reminder. Try it right on this page.', stack: 'Python, aiogram 3 (code in the repo)', cta: 'Try it', href: '#bot' },
    ],
    servicesTitle: 'Services',
    services: [
      { name: 'Landing page or business site', text: 'Responsive site with a lead form, basic SEO and fast loading.', price: 'from $80' },
      { name: 'Online store', text: 'WooCommerce or a custom cart, payments and delivery, up to 50 products.', price: 'from $160' },
      { name: 'Telegram bot', text: 'Orders and leads, notifications, customer replies, Google Sheets.', price: 'from $100' },
      { name: 'Python automation', text: 'Scraping, Excel and file processing, API integrations instead of manual work.', price: 'from $80' },
      { name: 'Website fixes', text: 'Mobile layout, bugs, speed, forms.', price: 'from $25' },
    ],
    stepsTitle: 'How I work',
    steps: [
      { name: 'We agree', text: 'We discuss the task; I fix the price and deadline in writing.' },
      { name: 'I show a first version', text: 'A working version in 2–3 days. Changes within scope are free.' },
      { name: 'I launch', text: 'I publish, test on phone and desktop, and hand over access.' },
    ],
    contactTitle: 'Tell me what you need',
    contactLead: "I reply within a day. Or message me on Telegram right away.",
    form: {
      name: 'Name',
      contact: 'Telegram, phone or email',
      contactHint: 'Where should I reply',
      message: 'What needs to be done',
      send: 'Send',
      sending: 'Sending…',
      sent: "Sent. I'll reply within a day.",
      error: 'Could not send. Please message me on Telegram.',
      noApi: 'The form is not connected yet — please message me on Telegram.',
    },
    footer: 'Ivan Bochma · Dnipro · remote',
  },
}
