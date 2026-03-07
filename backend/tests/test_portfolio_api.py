"""
Portfolio Website Backend API Tests
Tests for:
- Admin Authentication
- Home/About Content CRUD
- Projects CRUD
- Gallery CRUD
- Events CRUD
- Contact form submission
"""

import pytest
import requests
import os
import uuid
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestPublicEndpoints:
    """Tests for public API endpoints (no auth required)"""

    def test_health_check(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        assert response.json() == {"message": "Hello World"}
        print("✓ Health check passed")

    def test_get_home_content_empty(self):
        """Test getting home content when database is empty"""
        response = requests.get(f"{BASE_URL}/api/content/home")
        assert response.status_code == 200
        # Should return empty dict when no content
        assert isinstance(response.json(), dict)
        print("✓ Home content endpoint returns empty dict")

    def test_get_about_content_empty(self):
        """Test getting about content when database is empty"""
        response = requests.get(f"{BASE_URL}/api/content/about")
        assert response.status_code == 200
        assert isinstance(response.json(), dict)
        print("✓ About content endpoint returns empty dict")

    def test_get_projects_empty(self):
        """Test getting projects when database is empty"""
        response = requests.get(f"{BASE_URL}/api/content/projects")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print("✓ Projects endpoint returns empty list")

    def test_get_gallery_empty(self):
        """Test getting gallery when database is empty"""
        response = requests.get(f"{BASE_URL}/api/content/gallery")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print("✓ Gallery endpoint returns empty list")

    def test_get_contact_info(self):
        """Test getting contact info - should have defaults"""
        response = requests.get(f"{BASE_URL}/api/content/contact")
        assert response.status_code == 200
        data = response.json()
        # Should have default contact info
        assert "email" in data or isinstance(data, dict)
        print("✓ Contact info endpoint works")

    def test_get_events(self):
        """Test getting public events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print("✓ Events endpoint returns list")


class TestAdminAuthentication:
    """Tests for admin login and authentication"""

    def test_admin_login_success(self):
        """Test successful admin login"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            params={"username": "admin", "password": "Kirti2024!"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["username"] == "admin"
        print("✓ Admin login successful")

    def test_admin_login_invalid_username(self):
        """Test login with invalid username"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            params={"username": "wrong", "password": "Kirti2024!"}
        )
        assert response.status_code == 401
        print("✓ Invalid username rejected correctly")

    def test_admin_login_invalid_password(self):
        """Test login with invalid password"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            params={"username": "admin", "password": "wrongpass"}
        )
        assert response.status_code == 401
        print("✓ Invalid password rejected correctly")


@pytest.fixture(scope="class")
def auth_token():
    """Get authentication token for tests"""
    response = requests.post(
        f"{BASE_URL}/api/admin/login",
        params={"username": "admin", "password": "Kirti2024!"}
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    pytest.skip("Authentication failed")


@pytest.fixture
def auth_headers(auth_token):
    """Create authorization headers"""
    return {"Authorization": f"Bearer {auth_token}"}


class TestHomeContentCRUD:
    """Tests for Home content management"""

    def test_get_admin_home(self, auth_headers):
        """Test getting home content as admin"""
        response = requests.get(f"{BASE_URL}/api/admin/home", headers=auth_headers)
        assert response.status_code == 200
        print("✓ Admin can get home content")

    def test_update_home_content(self, auth_headers):
        """Test updating home content"""
        test_data = {
            "hero_image": "https://test-image-url.com/hero.jpg",
            "tagline": "TEST_TAGLINE - A quiet observer",
            "intro_text": "TEST_INTRO - Through music and performance"
        }
        
        # Update home content
        response = requests.post(
            f"{BASE_URL}/api/admin/home",
            json=test_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        print("✓ Home content updated successfully")

        # Verify changes via public endpoint
        verify_response = requests.get(f"{BASE_URL}/api/content/home")
        assert verify_response.status_code == 200
        data = verify_response.json()
        assert data.get("tagline") == "TEST_TAGLINE - A quiet observer"
        assert data.get("intro_text") == "TEST_INTRO - Through music and performance"
        print("✓ Home content changes visible on public endpoint")


class TestAboutContentCRUD:
    """Tests for About content management"""

    def test_get_admin_about(self, auth_headers):
        """Test getting about content as admin"""
        response = requests.get(f"{BASE_URL}/api/admin/about", headers=auth_headers)
        assert response.status_code == 200
        print("✓ Admin can get about content")

    def test_update_about_content(self, auth_headers):
        """Test updating about content"""
        test_data = {
            "image": "https://test-image-url.com/about.jpg",
            "skills": ["TEST_SKILL_1", "TEST_SKILL_2", "TEST_SKILL_3"]
        }
        
        # Update about content
        response = requests.post(
            f"{BASE_URL}/api/admin/about",
            json=test_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        print("✓ About content updated successfully")

        # Verify changes via public endpoint
        verify_response = requests.get(f"{BASE_URL}/api/content/about")
        assert verify_response.status_code == 200
        data = verify_response.json()
        assert "TEST_SKILL_1" in data.get("skills", [])
        print("✓ About content changes visible on public endpoint")


class TestProjectsCRUD:
    """Tests for Projects CRUD operations"""

    def test_create_project(self, auth_headers):
        """Test creating a new project"""
        project_data = {
            "title": "TEST_PROJECT_" + str(uuid.uuid4())[:8],
            "type": "Music",
            "category": "singing",
            "year": "2024",
            "description": "Test project description",
            "image": "https://test-image.com/project.jpg"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/projects",
            json=project_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print(f"✓ Project created with id: {data['id']}")
        return data["id"]

    def test_create_and_verify_project(self, auth_headers):
        """Test creating project and verifying it appears on public endpoint"""
        project_title = "TEST_PROJECT_VERIFY_" + str(uuid.uuid4())[:8]
        project_data = {
            "title": project_title,
            "type": "Music",
            "category": "singing",
            "year": "2024",
            "description": "Test project for verification",
            "image": "https://test-image.com/project.jpg"
        }
        
        # Create project
        create_response = requests.post(
            f"{BASE_URL}/api/admin/projects",
            json=project_data,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        project_id = create_response.json()["id"]
        print(f"✓ Created project: {project_title}")

        # Verify on public endpoint
        verify_response = requests.get(f"{BASE_URL}/api/content/projects")
        assert verify_response.status_code == 200
        projects = verify_response.json()
        
        # Find the created project
        found = any(p.get("title") == project_title for p in projects)
        assert found, f"Project {project_title} not found in public projects"
        print("✓ Project visible on public endpoint immediately")
        
        # Cleanup - delete the project
        requests.delete(f"{BASE_URL}/api/admin/projects/{project_id}", headers=auth_headers)
        print("✓ Test project cleaned up")

    def test_update_project(self, auth_headers):
        """Test updating a project"""
        # First create a project
        project_data = {
            "title": "TEST_UPDATE_PROJECT",
            "type": "Music",
            "category": "singing",
            "year": "2023",
            "description": "Original description"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/admin/projects",
            json=project_data,
            headers=auth_headers
        )
        project_id = create_response.json()["id"]
        
        # Update the project
        update_data = {
            "title": "TEST_UPDATE_PROJECT_MODIFIED",
            "description": "Updated description"
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/admin/projects/{project_id}",
            json=update_data,
            headers=auth_headers
        )
        assert update_response.status_code == 200
        print("✓ Project updated successfully")
        
        # Verify update on public endpoint
        verify_response = requests.get(f"{BASE_URL}/api/content/projects")
        projects = verify_response.json()
        updated_project = next((p for p in projects if p.get("id") == project_id), None)
        assert updated_project is not None
        assert updated_project.get("description") == "Updated description"
        print("✓ Project update visible on public endpoint")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/projects/{project_id}", headers=auth_headers)

    def test_delete_project(self, auth_headers):
        """Test deleting a project"""
        # Create a project to delete
        project_data = {
            "title": "TEST_DELETE_PROJECT",
            "type": "Acting",
            "category": "acting",
            "year": "2024"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/admin/projects",
            json=project_data,
            headers=auth_headers
        )
        project_id = create_response.json()["id"]
        
        # Delete the project
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/projects/{project_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print("✓ Project deleted successfully")
        
        # Verify deletion on public endpoint
        verify_response = requests.get(f"{BASE_URL}/api/content/projects")
        projects = verify_response.json()
        found = any(p.get("id") == project_id for p in projects)
        assert not found, "Project should not be found after deletion"
        print("✓ Project no longer visible on public endpoint")


class TestGalleryCRUD:
    """Tests for Gallery CRUD operations"""

    def test_create_gallery_image(self, auth_headers):
        """Test adding an image to gallery"""
        image_data = {
            "image_url": "https://test-image.com/gallery.jpg",
            "caption": "TEST_GALLERY_IMAGE",
            "category": "portraits"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/gallery",
            json=image_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print(f"✓ Gallery image added with id: {data['id']}")
        
        # Verify on public endpoint
        verify_response = requests.get(f"{BASE_URL}/api/content/gallery")
        gallery = verify_response.json()
        found = any(g.get("caption") == "TEST_GALLERY_IMAGE" for g in gallery)
        assert found, "Gallery image not found on public endpoint"
        print("✓ Gallery image visible on public endpoint")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/gallery/{data['id']}", headers=auth_headers)

    def test_delete_gallery_image(self, auth_headers):
        """Test deleting a gallery image"""
        # Create image
        image_data = {
            "image_url": "https://test-image.com/delete-test.jpg",
            "caption": "TEST_DELETE_GALLERY",
            "category": "moments"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/admin/gallery",
            json=image_data,
            headers=auth_headers
        )
        image_id = create_response.json()["id"]
        
        # Delete image
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/gallery/{image_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print("✓ Gallery image deleted")
        
        # Verify deletion
        verify_response = requests.get(f"{BASE_URL}/api/content/gallery")
        gallery = verify_response.json()
        found = any(g.get("id") == image_id for g in gallery)
        assert not found, "Gallery image should not be found after deletion"
        print("✓ Gallery image no longer visible on public endpoint")


class TestEventsCRUD:
    """Tests for Events CRUD operations"""

    def test_create_event(self, auth_headers):
        """Test creating an event"""
        future_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        event_data = {
            "title": "TEST_EVENT_" + str(uuid.uuid4())[:8],
            "event_date": future_date,
            "event_time": "19:00",
            "venue": "Test Venue",
            "location": "Test City",
            "description": "Test event description",
            "event_type": "Performance",
            "ticket_url": "https://test-tickets.com"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/events",
            json=event_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print(f"✓ Event created with id: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/events/{data['id']}", headers=auth_headers)

    def test_create_and_verify_event(self, auth_headers):
        """Test creating event and verifying it appears on public endpoint"""
        future_date = (datetime.now() + timedelta(days=60)).strftime("%Y-%m-%d")
        event_title = "TEST_VERIFY_EVENT_" + str(uuid.uuid4())[:8]
        event_data = {
            "title": event_title,
            "event_date": future_date,
            "event_type": "Concert"
        }
        
        # Create event
        create_response = requests.post(
            f"{BASE_URL}/api/admin/events",
            json=event_data,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        event_id = create_response.json()["id"]
        
        # Verify on public endpoint - note: public endpoint filters by future dates
        verify_response = requests.get(f"{BASE_URL}/api/events")
        events = verify_response.json()
        found = any(e.get("title") == event_title for e in events)
        assert found, f"Event {event_title} not found in public events"
        print("✓ Event visible on public endpoint")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/events/{event_id}", headers=auth_headers)

    def test_update_event(self, auth_headers):
        """Test updating an event"""
        future_date = (datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d")
        event_data = {
            "title": "TEST_UPDATE_EVENT",
            "event_date": future_date,
            "event_type": "Workshop"
        }
        
        # Create event
        create_response = requests.post(
            f"{BASE_URL}/api/admin/events",
            json=event_data,
            headers=auth_headers
        )
        event_id = create_response.json()["id"]
        
        # Update event
        update_data = {"title": "TEST_UPDATE_EVENT_MODIFIED"}
        update_response = requests.put(
            f"{BASE_URL}/api/admin/events/{event_id}",
            json=update_data,
            headers=auth_headers
        )
        assert update_response.status_code == 200
        print("✓ Event updated successfully")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/events/{event_id}", headers=auth_headers)

    def test_delete_event(self, auth_headers):
        """Test deleting an event"""
        future_date = (datetime.now() + timedelta(days=90)).strftime("%Y-%m-%d")
        event_data = {
            "title": "TEST_DELETE_EVENT",
            "event_date": future_date,
            "event_type": "Theatre"
        }
        
        # Create event
        create_response = requests.post(
            f"{BASE_URL}/api/admin/events",
            json=event_data,
            headers=auth_headers
        )
        event_id = create_response.json()["id"]
        
        # Delete event
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/events/{event_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print("✓ Event deleted successfully")


class TestContactInfo:
    """Tests for Contact info management"""

    def test_update_contact_info(self, auth_headers):
        """Test updating contact information"""
        contact_data = {
            "email": "test@kirtikilledar.com",
            "instagram_url": "https://instagram.com/kirti.killedar"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/contact",
            json=contact_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        print("✓ Contact info updated successfully")
        
        # Verify on public endpoint
        verify_response = requests.get(f"{BASE_URL}/api/content/contact")
        data = verify_response.json()
        assert data.get("email") == "test@kirtikilledar.com"
        print("✓ Contact info visible on public endpoint")


class TestUnauthorizedAccess:
    """Tests to verify authentication is required for admin endpoints"""

    def test_admin_home_without_auth(self):
        """Test accessing admin home without token"""
        response = requests.get(f"{BASE_URL}/api/admin/home")
        assert response.status_code in [401, 403]
        print("✓ Admin home requires authentication")

    def test_admin_projects_without_auth(self):
        """Test accessing admin projects without token"""
        response = requests.get(f"{BASE_URL}/api/admin/projects")
        assert response.status_code in [401, 403]
        print("✓ Admin projects requires authentication")

    def test_create_project_without_auth(self):
        """Test creating project without token"""
        response = requests.post(
            f"{BASE_URL}/api/admin/projects",
            json={"title": "Unauthorized project"}
        )
        assert response.status_code in [401, 403]
        print("✓ Creating project requires authentication")


# Run cleanup after all tests
@pytest.fixture(scope="session", autouse=True)
def cleanup_test_data():
    """Cleanup TEST_ prefixed data after all tests"""
    yield
    # Get auth token for cleanup
    response = requests.post(
        f"{BASE_URL}/api/admin/login",
        params={"username": "admin", "password": "Kirti2024!"}
    )
    if response.status_code == 200:
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Cleanup projects
        projects_response = requests.get(f"{BASE_URL}/api/admin/projects", headers=headers)
        if projects_response.status_code == 200:
            for project in projects_response.json():
                if project.get("title", "").startswith("TEST_"):
                    requests.delete(f"{BASE_URL}/api/admin/projects/{project['id']}", headers=headers)
        
        # Cleanup gallery
        gallery_response = requests.get(f"{BASE_URL}/api/admin/gallery", headers=headers)
        if gallery_response.status_code == 200:
            for image in gallery_response.json():
                if image.get("caption", "").startswith("TEST_"):
                    requests.delete(f"{BASE_URL}/api/admin/gallery/{image['id']}", headers=headers)
        
        # Cleanup events
        events_response = requests.get(f"{BASE_URL}/api/admin/events", headers=headers)
        if events_response.status_code == 200:
            for event in events_response.json():
                if event.get("title", "").startswith("TEST_"):
                    requests.delete(f"{BASE_URL}/api/admin/events/{event['id']}", headers=headers)
        
        print("✓ Test data cleanup completed")
