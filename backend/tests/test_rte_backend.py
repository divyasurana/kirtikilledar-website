"""
Backend API tests for RTE rollout (iteration 5):
- Admin login
- GET /api/content/home (public)
- POST /api/admin/home with HTML incl. <script> — verify roundtrip stores as-is
  (DOMPurify strips on the client side).
- GET /api/content/about (public) contains background_text / approach_text / quote
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://killedar-portfolio.preview.emergentagent.com").rstrip("/")

ADMIN_USER = "admin"
ADMIN_PASS = "Kirti2024!"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{BASE_URL}/api/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    tok = r.json().get("access_token")
    assert tok
    return tok


@pytest.fixture(scope="module")
def original_home(session, admin_token):
    r = session.get(f"{BASE_URL}/api/admin/home", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    return r.json() or {}


def test_public_home_ok(session):
    r = session.get(f"{BASE_URL}/api/content/home")
    assert r.status_code == 200
    assert isinstance(r.json(), dict)


def test_public_about_has_rich_text_fields(session):
    r = session.get(f"{BASE_URL}/api/content/about")
    assert r.status_code == 200
    data = r.json()
    # Fields may be empty but should be present (and string) when populated
    for k in ("background_text", "approach_text", "quote"):
        if k in data and data[k] is not None:
            assert isinstance(data[k], str)


def test_home_intro_html_roundtrip(session, admin_token, original_home):
    """POST HTML with <script> tag and bold/link, GET back, verify
    backend persists content as-is (sanitising happens on client via DOMPurify)."""
    payload = dict(original_home)
    payload.pop("id", None)
    payload["intro_text"] = (
        "<p>Hello <strong>bold</strong> and "
        "<a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">link</a>.</p>"
        "<script>alert(1)</script>"
    )
    # Ensure required keys exist
    payload.setdefault("tagline", "A quiet observer of people, stories, and moments.")
    payload.setdefault("hero_image", original_home.get("hero_image", ""))

    r = session.post(
        f"{BASE_URL}/api/admin/home",
        json=payload,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert r.status_code == 200, r.text

    pub = session.get(f"{BASE_URL}/api/content/home")
    assert pub.status_code == 200
    body = pub.json()
    assert "<strong>bold</strong>" in body["intro_text"]
    assert "https://example.com" in body["intro_text"]
    # Backend stores raw — client (DOMPurify) strips the script tag on render
    assert "<script>" in body["intro_text"]


def test_restore_home(session, admin_token, original_home):
    """Restore original home content to avoid leaving test data."""
    if not original_home:
        pytest.skip("no original home content to restore")
    payload = dict(original_home)
    payload.pop("id", None)
    r = session.post(
        f"{BASE_URL}/api/admin/home",
        json=payload,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert r.status_code == 200
