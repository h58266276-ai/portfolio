# Ivan Bochma — portfolio

Live: **https://portfolio.radar-ib7.workers.dev** (UA / EN)

Personal portfolio of a junior web developer from Dnipro, Ukraine: websites, Telegram bots and Python automation.

## What's inside

| Part | Stack | Folder |
|---|---|---|
| Website | React 19, TypeScript, Vite, Three.js (react-three-fiber) | `src/` |
| Hero | Custom GLSL shader "river" + glass pebble (MeshTransmissionMaterial) | `src/River.tsx` |
| Bot demo on the page | React state machine that mirrors the real bot | `src/BotDemo.tsx` |
| Contact API | Python, FastAPI, Pydantic, httpx → Telegram Bot API; validation, honeypot, rate limit | `api/` |
| Booking bot | Python, aiogram 3 (FSM), owner notification, reminder an hour before | `bot/` |

## Run

```bash
npm install
npm run dev
```

Contact API:

```bash
cd api
pip install -r requirements.txt
set TELEGRAM_BOT_TOKEN=...
set TELEGRAM_CHAT_ID=...
uvicorn main:app --reload
pytest
```

Booking bot:

```bash
cd bot
pip install -r requirements.txt
set BOT_TOKEN=...
set OWNER_CHAT_ID=...
python barber_bot.py
pytest
```

Set `VITE_API_URL` when building the site to connect the contact form to the API.

## Contact

Telegram: [@iyiny](https://t.me/iyiny)
