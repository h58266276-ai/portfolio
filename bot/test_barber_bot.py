from datetime import datetime

import barber_bot as b


def test_price_list_has_all_services():
    text = b.price_list()
    for name, price in b.SERVICES.values():
        assert f"{name} — {price} ₴" in text


def test_slot_datetime_same_day():
    now = datetime(2026, 11, 11, 10, 0)
    assert b.slot_datetime("16:00", now) == datetime(2026, 11, 11, 16, 0)


def test_keyboard_callback_data_fit_telegram_limit():
    # Telegram обмежує callback_data 64 байтами
    markup = b.kb([[(n, f"s:{k}")] for k, (n, _) in b.SERVICES.items()])
    for row in markup.inline_keyboard:
        for btn in row:
            assert len(btn.callback_data.encode()) <= 64
