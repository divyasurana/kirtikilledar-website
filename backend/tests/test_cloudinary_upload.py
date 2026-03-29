"""
Cloudinary Upload Integration Tests
Tests for:
- File upload to Cloudinary via /api/admin/upload endpoint
- Verify returned URLs are Cloudinary URLs (https://res.cloudinary.com/...)
- Verify uploaded images are accessible
"""

import pytest
import requests
import os
import io
from PIL import Image

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
CLOUDINARY_CLOUD_NAME = "dh1sjguhz"


@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token for tests"""
    response = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"username": "admin", "password": "Kirti2024!"}
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    pytest.skip("Authentication failed - cannot test upload")


@pytest.fixture
def auth_headers(auth_token):
    """Create authorization headers"""
    return {"Authorization": f"Bearer {auth_token}"}


def create_test_image(width=100, height=100, color=(255, 0, 0)):
    """Create a simple test image in memory"""
    img = Image.new('RGB', (width, height), color=color)
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes


class TestCloudinaryUpload:
    """Tests for Cloudinary file upload integration"""

    def test_upload_image_returns_cloudinary_url(self, auth_headers):
        """Test that uploading an image returns a Cloudinary URL"""
        # Create a test image
        test_image = create_test_image()
        
        files = {
            'file': ('test_image.png', test_image, 'image/png')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "url" in data, "Response should contain 'url' field"
        assert "id" in data, "Response should contain 'id' field"
        
        # CRITICAL: Verify URL is a Cloudinary URL
        url = data["url"]
        assert url.startswith(f"https://res.cloudinary.com/{CLOUDINARY_CLOUD_NAME}/"), \
            f"URL should be a Cloudinary URL, got: {url}"
        
        print(f"✓ Upload returned Cloudinary URL: {url}")
        
        # Verify the image is accessible
        img_response = requests.get(url)
        assert img_response.status_code == 200, f"Uploaded image not accessible at {url}"
        print("✓ Uploaded image is accessible via Cloudinary URL")

    def test_upload_jpeg_image(self, auth_headers):
        """Test uploading a JPEG image"""
        # Create a test JPEG image
        img = Image.new('RGB', (150, 150), color=(0, 255, 0))
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        files = {
            'file': ('test_jpeg.jpg', img_bytes, 'image/jpeg')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"JPEG upload failed: {response.text}"
        data = response.json()
        
        url = data["url"]
        assert f"res.cloudinary.com/{CLOUDINARY_CLOUD_NAME}" in url, \
            f"JPEG URL should be Cloudinary URL, got: {url}"
        
        print(f"✓ JPEG upload returned Cloudinary URL: {url}")

    def test_upload_without_auth_fails(self):
        """Test that upload without authentication fails"""
        test_image = create_test_image()
        
        files = {
            'file': ('test_no_auth.png', test_image, 'image/png')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload",
            files=files
        )
        
        assert response.status_code in [401, 403], \
            f"Upload without auth should fail, got status {response.status_code}"
        print("✓ Upload without authentication correctly rejected")

    def test_upload_returns_correct_metadata(self, auth_headers):
        """Test that upload returns correct file metadata"""
        test_image = create_test_image(200, 200, (0, 0, 255))
        
        files = {
            'file': ('metadata_test.png', test_image, 'image/png')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify metadata fields
        assert "filename" in data, "Response should contain 'filename'"
        assert data["filename"] == "metadata_test.png", f"Filename mismatch: {data['filename']}"
        
        # Size should be present and positive
        if "size" in data:
            assert data["size"] > 0, "File size should be positive"
            print(f"✓ File size reported: {data['size']} bytes")
        
        print(f"✓ Upload metadata correct: {data}")


class TestCloudinaryURLFormat:
    """Tests to verify Cloudinary URL format in responses"""

    def test_cloudinary_url_format(self, auth_headers):
        """Test that Cloudinary URLs follow expected format"""
        test_image = create_test_image()
        
        files = {
            'file': ('format_test.png', test_image, 'image/png')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        url = response.json()["url"]
        
        # Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{format}
        assert "res.cloudinary.com" in url, "URL should contain res.cloudinary.com"
        assert CLOUDINARY_CLOUD_NAME in url, f"URL should contain cloud name {CLOUDINARY_CLOUD_NAME}"
        assert url.startswith("https://"), "URL should use HTTPS"
        
        print(f"✓ Cloudinary URL format verified: {url}")


class TestStorageNotEmergent:
    """Verify that Emergent Object Store is NOT being used"""

    def test_no_emergent_url_in_response(self, auth_headers):
        """Verify upload does not return Emergent Object Store URLs"""
        test_image = create_test_image()
        
        files = {
            'file': ('emergent_check.png', test_image, 'image/png')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        url = response.json()["url"]
        
        # Ensure NOT using Emergent Object Store
        assert "emergent" not in url.lower(), \
            f"URL should NOT contain 'emergent', got: {url}"
        assert "object-store" not in url.lower(), \
            f"URL should NOT contain 'object-store', got: {url}"
        
        # Confirm it IS Cloudinary
        assert "cloudinary" in url.lower(), \
            f"URL should contain 'cloudinary', got: {url}"
        
        print("✓ Confirmed: Using Cloudinary, NOT Emergent Object Store")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
