from fastapi.testclient import TestClient

import main

client = TestClient(main.app)

GOOD = {"name": "Олена", "contact": "@olena", "message": "Потрібен лендинг для кав'ярні", "lang": "uk"}


def setup_function():
    main._hits.clear()


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["ok"] is True


def test_contact_sends_to_telegram(monkeypatch):
    sent = []

    async def fake_send(text):
        sent.append(text)

    monkeypatch.setattr(main, "send_to_telegram", fake_send)
    r = client.post("/api/contact", json=GOOD)
    assert r.status_code == 201
    assert "Олена" in sent[0] and "кав&#x27;ярні" in sent[0]


def test_html_is_escaped(monkeypatch):
    sent = []

    async def fake_send(text):
        sent.append(text)

    monkeypatch.setattr(main, "send_to_telegram", fake_send)
    client.post("/api/contact", json={**GOOD, "name": "<b>x</b>"})
    assert "&lt;b&gt;x&lt;/b&gt;" in sent[0]


def test_validation():
    assert client.post("/api/contact", json={**GOOD, "message": "коротко"}).status_code == 422
    assert client.post("/api/contact", json={**GOOD, "name": "   "}).status_code == 422
    assert client.post("/api/contact", json={**GOOD, "lang": "de"}).status_code == 422


def test_honeypot_skips_sending(monkeypatch):
    called = []

    async def fake_send(text):
        called.append(text)

    monkeypatch.setattr(main, "send_to_telegram", fake_send)
    r = client.post("/api/contact", json={**GOOD, "website": "spam.com"})
    assert r.status_code == 201 and called == []


def test_rate_limit():
    for i in range(main.RATE_LIMIT):
        assert main.rate_limited("1.2.3.4", now=100 + i) is False
    assert main.rate_limited("1.2.3.4", now=110) is True
    assert main.rate_limited("1.2.3.4", now=100 + main.RATE_WINDOW + 10) is False


def test_not_configured(monkeypatch):
    monkeypatch.setattr(main, "BOT_TOKEN", "")
    r = client.post("/api/contact", json=GOOD)
    assert r.status_code == 503
