"""Telegram-бот запису в барбершоп (aiogram 3).

Той самий сценарій, що й у демо на сайті:
послуга → майстер → час → підтвердження, повідомлення власнику й нагадування клієнту за годину.

Запуск:
    pip install -r requirements.txt
    set BOT_TOKEN=...        (від @BotFather)
    set OWNER_CHAT_ID=...    (куди слати нові записи)
    python barber_bot.py
"""
from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timedelta

from aiogram import Bot, Dispatcher, F, Router
from aiogram.filters import Command, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup, Message

SERVICES = {"cut": ("Стрижка", 450), "beard": ("Борода", 300), "combo": ("Стрижка + борода", 650)}
MASTERS = ["Олег", "Дмитро", "Будь-хто"]
SLOTS = ["14:30", "16:00", "18:30"]

router = Router()
reminders: dict[int, asyncio.Task] = {}


class Booking(StatesGroup):
    service = State()
    master = State()
    time = State()


def kb(rows: list[list[tuple[str, str]]]) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text=t, callback_data=d) for t, d in row] for row in rows]
    )


START_KB = kb([[("Записатися", "book"), ("Ціни", "prices")]])


def price_list() -> str:
    return "\n".join(f"{name} — {price} ₴" for name, price in SERVICES.values())


def slot_datetime(slot: str, now: datetime | None = None) -> datetime:
    now = now or datetime.now()
    h, m = map(int, slot.split(":"))
    return now.replace(hour=h, minute=m, second=0, microsecond=0)


@router.message(CommandStart())
async def start(msg: Message, state: FSMContext) -> None:
    await state.clear()
    await msg.answer("Вітаю! Я бот барбершопу «Грань». Запишу вас за 20 секунд.", reply_markup=START_KB)


@router.callback_query(F.data == "prices")
async def prices(cb: CallbackQuery) -> None:
    await cb.message.answer(price_list(), reply_markup=START_KB)
    await cb.answer()


@router.callback_query(F.data == "book")
async def ask_service(cb: CallbackQuery, state: FSMContext) -> None:
    await state.set_state(Booking.service)
    await cb.message.answer("Яка послуга?", reply_markup=kb([[(n, f"s:{k}")] for k, (n, _) in SERVICES.items()]))
    await cb.answer()


@router.callback_query(Booking.service, F.data.startswith("s:"))
async def ask_master(cb: CallbackQuery, state: FSMContext) -> None:
    await state.update_data(service=cb.data[2:])
    await state.set_state(Booking.master)
    await cb.message.answer("До якого майстра?", reply_markup=kb([[(m, f"m:{m}") for m in MASTERS]]))
    await cb.answer()


@router.callback_query(Booking.master, F.data.startswith("m:"))
async def ask_time(cb: CallbackQuery, state: FSMContext) -> None:
    await state.update_data(master=cb.data[2:])
    await state.set_state(Booking.time)
    await cb.message.answer("Вільний час на сьогодні:", reply_markup=kb([[(s, f"t:{s}") for s in SLOTS]]))
    await cb.answer()


@router.callback_query(Booking.time, F.data.startswith("t:"))
async def confirm(cb: CallbackQuery, state: FSMContext, bot: Bot) -> None:
    data = await state.get_data()
    slot = cb.data[2:]
    service = SERVICES[data["service"]][0]
    master = data["master"]
    await state.clear()

    await cb.message.answer(
        f"Готово ✅\n{service}, майстер {master}, сьогодні о {slot}.\nНагадаю за годину. Скасувати — /cancel"
    )
    owner = os.getenv("OWNER_CHAT_ID")
    if owner:
        user = cb.from_user
        who = f"@{user.username}" if user.username else user.full_name
        await bot.send_message(owner, f"Новий запис: {service} · {master} · {slot} · {who}")

    delay = (slot_datetime(slot) - timedelta(hours=1) - datetime.now()).total_seconds()
    if delay > 0:
        chat_id = cb.message.chat.id
        old = reminders.pop(chat_id, None)
        if old:
            old.cancel()
        reminders[chat_id] = asyncio.create_task(remind(bot, chat_id, delay, service, slot))
    await cb.answer()


async def remind(bot: Bot, chat_id: int, delay: float, service: str, slot: str) -> None:
    await asyncio.sleep(delay)
    await bot.send_message(chat_id, f"Нагадування: {service} сьогодні о {slot}. Чекаємо на вас!")


@router.message(Command("cancel"))
async def cancel(msg: Message, state: FSMContext) -> None:
    await state.clear()
    task = reminders.pop(msg.chat.id, None)
    if task:
        task.cancel()
    await msg.answer("Запис скасовано.", reply_markup=START_KB)


async def main() -> None:
    logging.basicConfig(level=logging.INFO)
    bot = Bot(os.environ["BOT_TOKEN"])
    dp = Dispatcher()
    dp.include_router(router)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
