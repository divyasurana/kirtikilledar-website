"""Iteration 6 backend tests: project media fields, startup migration, gallery PUT edit."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://killedar-portfolio.preview.emergentagent.com").rstrip("/")
ADMIN_USER = "admin"
ADMIN_PASS = "Kirti2024!"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=30)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    return data["access_token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------------- Public projects endpoint ----------------
class TestPublicProjects:
    def test_projects_list_no_deprecated_fields(self):
        r = requests.get(f"{BASE_URL}/api/content/projects", timeout=30)
        assert r.status_code == 200
        projects = r.json()
        assert isinstance(projects, list)
        for p in projects:
            assert "creative_process" not in p, f"project {p.get('id')} still has creative_process"
            assert "behind_scenes" not in p, f"project {p.get('id')} still has behind_scenes"

    def test_projects_media_fields_shape(self):
        r = requests.get(f"{BASE_URL}/api/content/projects", timeout=30)
        assert r.status_code == 200
        projects = r.json()
        # At least validate keys are snake_case if present
        for p in projects:
            # Neither camelCase variant should exist
            assert "mediaType" not in p
            assert "mediaUrl" not in p


class TestAdminProjectsMigration:
    def test_admin_projects_no_deprecated_fields(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/admin/projects", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        projects = r.json()
        assert isinstance(projects, list)
        for p in projects:
            assert "creative_process" not in p, f"admin project {p.get('id')} retains creative_process"
            assert "behind_scenes" not in p, f"admin project {p.get('id')} retains behind_scenes"


# ---------------- Public gallery ----------------
class TestPublicGallery:
    def test_gallery_has_resource_type_and_instagram(self):
        r = requests.get(f"{BASE_URL}/api/content/gallery", timeout=30)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for it in items:
            assert "resource_type" in it, f"gallery item missing resource_type: {it.get('id')}"
            assert it["resource_type"] in ("image", "video")
            assert "instagram_url" in it, f"gallery item missing instagram_url: {it.get('id')}"


# ---------------- Admin gallery PUT ----------------
class TestAdminGalleryEdit:
    @pytest.fixture(scope="class")
    def seed_items(self, auth_headers):
        """Create 2 test gallery items: a YouTube-style image link and an image."""
        created = []
        # Image item
        payload_img = {
            "caption": "TEST_iter6_image",
            "category": "test",
            "image_url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            "resource_type": "image",
            "instagram_url": "",
        }
        r = requests.post(f"{BASE_URL}/api/admin/gallery", headers=auth_headers, json=payload_img, timeout=30)
        assert r.status_code == 200, r.text
        created.append(r.json()["id"])

        # YouTube item stored as image (frontend interprets youtube URL)
        payload_yt = {
            "caption": "TEST_iter6_youtube",
            "category": "test",
            "image_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "resource_type": "image",
            "instagram_url": "",
        }
        r = requests.post(f"{BASE_URL}/api/admin/gallery", headers=auth_headers, json=payload_yt, timeout=30)
        assert r.status_code == 200, r.text
        created.append(r.json()["id"])

        yield created

        # Cleanup
        for gid in created:
            requests.delete(f"{BASE_URL}/api/admin/gallery/{gid}", headers=auth_headers, timeout=30)

    def test_update_caption_and_instagram(self, auth_headers, seed_items):
        gid = seed_items[0]
        payload = {"caption": "TEST_iter6_image_updated", "instagram_url": "https://instagram.com/p/abc123/"}
        r = requests.put(f"{BASE_URL}/api/admin/gallery/{gid}", headers=auth_headers, json=payload, timeout=30)
        assert r.status_code == 200, r.text

        # Verify via public GET
        r = requests.get(f"{BASE_URL}/api/content/gallery", timeout=30)
        assert r.status_code == 200
        item = next((x for x in r.json() if x["id"] == gid), None)
        assert item is not None
        assert item["caption"] == "TEST_iter6_image_updated"
        assert item["instagram_url"] == "https://instagram.com/p/abc123/"

    def test_clear_instagram_url(self, auth_headers, seed_items):
        gid = seed_items[0]
        # first set it
        requests.put(f"{BASE_URL}/api/admin/gallery/{gid}", headers=auth_headers,
                     json={"instagram_url": "https://instagram.com/p/xyz/"}, timeout=30)
        # now clear
        r = requests.put(f"{BASE_URL}/api/admin/gallery/{gid}", headers=auth_headers,
                         json={"instagram_url": ""}, timeout=30)
        assert r.status_code == 200

        r = requests.get(f"{BASE_URL}/api/content/gallery", timeout=30)
        item = next((x for x in r.json() if x["id"] == gid), None)
        assert item is not None
        assert item["instagram_url"] == ""

    def test_update_unknown_id_returns_404(self, auth_headers):
        r = requests.put(f"{BASE_URL}/api/admin/gallery/nonexistent-id-xyz", headers=auth_headers,
                         json={"caption": "x"}, timeout=30)
        assert r.status_code == 404

    def test_update_category_and_resource_type(self, auth_headers, seed_items):
        gid = seed_items[1]
        r = requests.put(f"{BASE_URL}/api/admin/gallery/{gid}", headers=auth_headers,
                         json={"category": "updated_cat", "resource_type": "image"}, timeout=30)
        assert r.status_code == 200

        r = requests.get(f"{BASE_URL}/api/content/gallery", timeout=30)
        item = next((x for x in r.json() if x["id"] == gid), None)
        assert item is not None
        assert item["category"] == "updated_cat"
        assert item["resource_type"] == "image"


# ---------------- Regression: admin login ----------------
class TestAdminLoginRegression:
    def test_admin_login_works(self):
        r = requests.post(f"{BASE_URL}/api/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
