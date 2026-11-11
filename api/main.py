"""Бекенд форми контактів: приймає заявку з сайту й пересилає її в Telegram.

Запуск локально:
    pip install -r requirements.txt
    set TELEGRAM_BOT_TOKEN=...   (токен від @BotFather)
    set TELEGRAM_CHAT_ID=...     (ваш chat id)
    uvicorn main:app --reload
"""
from __future__ import annotations

import html
import os
import time
from collections import defaultdict, deque

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
ALLOWED_ORIGINS = [o for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",") if o]

RATE_LIMIT = 5          # заявок
RATE_WINDOW = 10 * 60   # за 10 хвилин з однієї IP

app = FastAPI(title="Portfolio contact API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

_hits: dict[str, deque[float]] = defaultdict(deque)


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    contact: str = Field(min_length=3, max_length=120)
    message: str = Field(min_length=10, max_length=2000)
    lang: str = Field(default="uk", pattern="^(uk|en)$")
    website: str = ""  # honeypot: люди його не бачать

    @field_validator("name", "contact", "message")
    @classmethod
    def strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("empty")
        return v


def rate_limited(ip: str, now: float | None = None) -> bool:
    now = time.time() if now is None else now
    q = _hits[ip]
    while q and now - q[0] > RATE_WINDOW:
        q.popleft()
    if len(q) >= RATE_LIMIT:
        return True
    q.append(now)
    return False


def format_message(c: ContactIn) -> str:
    e = html.escape
    return (
        "<b>Нова заявка з портфоліо</b>\n"
        f"<b>Ім'я:</b> {e(c.name)}\n"
        f"<b>Контакт:</b> {e(c.contact)}\n"
        f"<b>Мова:</b> {c.lang}\n\n"
        f"{e(c.message)}"
    )


async def send_to_telegram(text: str) -> None:
    if not BOT_TOKEN or not CHAT_ID:
        raise HTTPException(503, "Telegram is not configured")
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(url, json={"chat_id": CHAT_ID, "text": text, "parse_mode": "HTML"})
    if r.status_code != 200:
        raise HTTPException(502, "Telegram error")


@app.get("/api/health")
def health() -> dict:
    return {"ok": True, "telegram": bool(BOT_TOKEN and CHAT_ID)}


@app.post("/api/contact", status_code=201)
async def contact(data: ContactIn, request: Request) -> dict:
    if data.website:  # бот заповнив приховане поле — мовчки приймаємо й нічого не шлемо
        return {"ok": True}
    ip = request.client.host if request.client else "unknown"
    if rate_limited(ip):
        raise HTTPException(429, "Too many requests, try later")
    await send_to_telegram(format_message(data))
    return {"ok": True}
