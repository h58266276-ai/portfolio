import { useEffect, useRef, useState } from 'react'
import type { Lang } from './i18n'

// Інтерактивна демонстрація Telegram-бота запису в барбершоп.
// Логіка — проста скінченна машина станів, як у справжньому боті на aiogram.

type Msg = { from: 'bot' | 'me'; text: string }
type Step = 'start' | 'service' | 'master' | 'time' | 'done'

const T = {
  uk: {
    hello: 'Вітаю! Я бот барбершопу «Грань». Запишу вас за 20 секунд.',
    start: 'Записатися',
    prices: 'Ціни',
    pricesText: 'Чоловіча стрижка — 450 ₴\nБорода — 300 ₴\nСтрижка + борода — 650 ₴',
    chooseService: 'Яка послуга?',
    services: ['Стрижка', 'Борода', 'Стрижка + борода'],
    chooseMaster: 'До якого майстра?',
    masters: ['Олег', 'Дмитро', 'Будь-хто'],
    chooseTime: 'Вільний час на сьогодні:',
    times: ['14:30', '16:00', '18:30'],
    done: (s: string, m: string, t: string) =>
      `Готово ✅\n${s}, майстер ${m}, сьогодні о ${t}.\nНагадаю за годину. Скасувати — /cancel`,
    admin: 'Повідомлення адміну',
    adminText: (s: string, m: string, t: string) => `Новий запис: ${s} · ${m} · ${t}`,
    again: 'Почати знову',
    typing: 'друкує…',
    note: 'Демо інтерфейсу: так виглядає бот, який я роблю для бізнесу. Записи нікуди не надсилаються.',
  },
  en: {
    hello: "Hi! I'm the Hran barbershop bot. I'll book you in 20 seconds.",
    start: 'Book a visit',
    prices: 'Prices',
    pricesText: 'Haircut — 450 ₴\nBeard — 300 ₴\nHaircut + beard — 650 ₴',
    chooseService: 'Which service?',
    services: ['Haircut', 'Beard', 'Haircut + beard'],
    chooseMaster: 'Which barber?',
    masters: ['Oleh', 'Dmytro', 'Anyone'],
    chooseTime: 'Free slots today:',
    times: ['14:30', '16:00', '18:30'],
    done: (s: string, m: string, t: string) =>
      `Done ✅\n${s}, barber ${m}, today at ${t}.\nI'll remind you an hour before. Cancel — /cancel`,
    admin: 'Message to the owner',
    adminText: (s: string, m: string, t: string) => `New booking: ${s} · ${m} · ${t}`,
    again: 'Start over',
    typing: 'typing…',
    note: 'Interface demo: this is how the bots I build for businesses look. Bookings are not sent anywhere.',
  },
}

export default function BotDemo({ lang }: { lang: Lang }) {
  const t = T[lang]
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: t.hello }])
  const [step, setStep] = useState<Step>('start')
  const [typing, setTyping] = useState(false)
  const [pick, setPick] = useState<{ s?: string; m?: string; t?: string }>({})
  const [admin, setAdmin] = useState<string | null>(null)
  const box = useRef<HTMLDivElement>(null)

  // при зміні мови починаємо діалог заново
  useEffect(() => {
    setMsgs([{ from: 'bot', text: T[lang].hello }])
    setStep('start')
    setPick({})
    setAdmin(null)
  }, [lang])

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  function reply(me: string, bot: string, next: Step) {
    setMsgs((m) => [...m, { from: 'me', text: me }])
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', text: bot }])
      setStep(next)
    }, 650)
  }

  function choose(value: string) {
    if (step === 'start') {
      if (value === t.prices) return reply(value, t.pricesText, 'start')
      return reply(value, t.chooseService, 'service')
    }
    if (step === 'service') {
      setPick({ s: value })
      return reply(value, t.chooseMaster, 'master')
    }
    if (step === 'master') {
      setPick((p) => ({ ...p, m: value }))
      return reply(value, t.chooseTime, 'time')
    }
    if (step === 'time') {
      const s = pick.s ?? '', m = pick.m ?? ''
      reply(value, t.done(s, m, value), 'done')
      window.setTimeout(() => setAdmin(t.adminText(s, m, value)), 900)
      return
    }
    // done → почати знову
    setMsgs([{ from: 'bot', text: t.hello }])
    setPick({})
    setAdmin(null)
    setStep('start')
  }

  const options: Record<Step, string[]> = {
    start: [t.start, t.prices],
    service: t.services,
    master: t.masters,
    time: t.times,
    done: [t.again],
  }

  return (
    <div className="bot">
      <div className="phone">
        <div className="phone__bar">
          <span className="ava" aria-hidden="true">Г</span>
          <div>
            <strong>Грань · bot</strong>
            <small>{typing ? t.typing : 'online'}</small>
          </div>
        </div>
        <div className="chat" ref={box} aria-live="polite">
          {msgs.map((m, i) => (
            <p key={i} className={`bubble bubble--${m.from}`}>
              {m.text}
            </p>
          ))}
          {typing && <p className="bubble bubble--bot bubble--typing" aria-hidden="true"><span /><span /><span /></p>}
        </div>
        <div className="keys">
          {options[step].map((o) => (
            <button key={o} type="button" disabled={typing} onClick={() => choose(o)}>
              {o}
            </button>
          ))}
        </div>
      </div>
      <div className={`admin ${admin ? 'admin--on' : ''}`} aria-live="polite">
        <small>{t.admin}</small>
        <p>{admin ?? '—'}</p>
      </div>
      <p className="bot__note">{t.note}</p>
    </div>
  )
}
