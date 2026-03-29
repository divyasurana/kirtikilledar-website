"""
Cloudinary Storage Integration
Persistent file storage for images and files
"""
import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
    secure=True
)

def init_storage():
    """Initialize storage. Verify Cloudinary configuration."""
    try:
        # Test connection by fetching account details
        cloudinary.api.ping()
        logger.info("✅ Cloudinary storage initialized successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Cloudinary init failed: {e}")
        raise Exception(f"Cloudinary configuration error: {e}")

def put_object(path: str, data: bytes, content_type: str) -> Dict:
    """
    Upload file to Cloudinary.
    
    Args:
        path: Desired path/public_id for the file (e.g., 'kirtikilledar/uploads/image123.jpg')
        data: File content as bytes
        content_type: MIME type of the file
    
    Returns:
        {
            "path": "public_id",
            "url": "https://res.cloudinary.com/...",
            "secure_url": "https://res.cloudinary.com/...",
            "size": 12345,
            "format": "jpg",
            "resource_type": "image"
        }
    """
    try:
        # Extract public_id (remove extension if present)
        public_id = path.rsplit('.', 1)[0] if '.' in path else path
        
        # Determine resource type from content_type
        if content_type.startswith('image/'):
            resource_type = 'image'
        elif content_type.startswith('video/'):
            resource_type = 'video'
        else:
            resource_type = 'raw'
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            data,
            public_id=public_id,
            resource_type=resource_type,
            overwrite=True,
            invalidate=True
        )
        
        logger.info(f"✅ Uploaded to Cloudinary: {result['secure_url']}")
        
        return {
            "path": result.get("public_id"),
            "url": result.get("url"),
            "secure_url": result.get("secure_url"),
            "size": result.get("bytes", 0),
            "format": result.get("format"),
            "resource_type": result.get("resource_type")
        }
    
    except Exception as e:
        logger.error(f"❌ Cloudinary upload failed for {path}: {e}")
        raise Exception(f"Upload to Cloudinary failed: {e}")

def get_object(path: str) -> Tuple[bytes, str]:
    """
    Download file from Cloudinary.
    
    NOTE: With Cloudinary, files are accessed via direct URLs.
    This function is kept for backward compatibility but downloads the file.
    
    Args:
        path: Public ID or full URL of the file
    
    Returns:
        (content_bytes, content_type)
    """
    try:
        import requests
        
        # If path is a full URL, use it directly
        if path.startswith('http'):
            url = path
        else:
            # Construct Cloudinary URL
            cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
            # Assume it's an image by default (can be enhanced)
            url = f"https://res.cloudinary.com/{cloud_name}/image/upload/{path}"
        
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        content_type = response.headers.get('Content-Type', 'application/octet-stream')
        return response.content, content_type
    
    except Exception as e:
        logger.error(f"❌ Cloudinary download failed for {path}: {e}")
        raise Exception(f"Download from Cloudinary failed: {e}")

def delete_object(path: str, resource_type: str = 'image') -> bool:
    """
    Delete file from Cloudinary.
    
    Args:
        path: Public ID of the file
        resource_type: Type of resource ('image', 'video', 'raw')
    
    Returns:
        True if deleted successfully
    """
    try:
        result = cloudinary.uploader.destroy(path, resource_type=resource_type)
        
        if result.get('result') == 'ok':
            logger.info(f"✅ Deleted from Cloudinary: {path}")
            return True
        else:
            logger.warning(f"⚠️ Cloudinary delete returned: {result}")
            return False
    
    except Exception as e:
        logger.error(f"❌ Cloudinary delete failed for {path}: {e}")
        raise Exception(f"Delete from Cloudinary failed: {e}")

def get_cloudinary_url(public_id: str, resource_type: str = 'image', transformation: Dict = None) -> str:
    """
    Generate Cloudinary URL with optional transformations.
    
    Args:
        public_id: Public ID of the file
        resource_type: Type of resource ('image', 'video', 'raw')
        transformation: Optional dict of transformations (e.g., {"width": 300, "crop": "fill"})
    
    Returns:
        Secure HTTPS URL
    """
    return cloudinary.CloudinaryImage(public_id).build_url(
        resource_type=resource_type,
        transformation=transformation,
        secure=True
    )

# Content-Type mapping (kept for compatibility)
MIME_TYPES = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "webp": "image/webp",
    "svg": "image/svg+xml",
    "pdf": "application/pdf",
    "json": "application/json",
    "txt": "text/plain",
    "mp4": "video/mp4",
    "mov": "video/quicktime",
    "avi": "video/x-msvideo"
}

def get_content_type(filename: str) -> str:
    """Get MIME type from filename extension."""
    ext = filename.split(".")[-1].lower() if "." in filename else "bin"
    return MIME_TYPES.get(ext, "application/octet-stream")
