"""
Emergent Object Storage Integration
Persistent file storage across redeployments
"""
import requests
import os
import logging

logger = logging.getLogger(__name__)

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "kirtikilledar"

# Module-level storage key (reused globally)
storage_key = None

def init_storage():
    """Initialize storage. Call ONCE at startup."""
    global storage_key
    if storage_key:
        return storage_key
    
    try:
        resp = requests.post(
            f"{STORAGE_URL}/init",
            json={"emergent_key": EMERGENT_KEY},
            timeout=30
        )
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("✅ Emergent Object Storage initialized")
        return storage_key
    except Exception as e:
        logger.error(f"❌ Storage init failed: {e}")
        raise

def put_object(path: str, data: bytes, content_type: str) -> dict:
    """
    Upload file to storage.
    Returns: {"path": "...", "size": 123, "etag": "..."}
    """
    key = init_storage()
    
    try:
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={
                "X-Storage-Key": key,
                "Content-Type": content_type
            },
            data=data,
            timeout=120
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Upload failed for {path}: {e}")
        raise

def get_object(path: str) -> tuple[bytes, str]:
    """
    Download file from storage.
    Returns: (content_bytes, content_type)
    """
    key = init_storage()
    
    try:
        resp = requests.get(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key},
            timeout=60
        )
        resp.raise_for_status()
        return resp.content, resp.headers.get("Content-Type", "application/octet-stream")
    except Exception as e:
        logger.error(f"Download failed for {path}: {e}")
        raise

# Content-Type mapping
MIME_TYPES = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "webp": "image/webp",
    "svg": "image/svg+xml",
    "pdf": "application/pdf",
    "json": "application/json",
    "txt": "text/plain"
}

def get_content_type(filename: str) -> str:
    """Get MIME type from filename extension."""
    ext = filename.split(".")[-1].lower() if "." in filename else "bin"
    return MIME_TYPES.get(ext, "application/octet-stream")
