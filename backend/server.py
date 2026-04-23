from fastapi import FastAPI, APIRouter, HTTPException, Query, Header
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection - support both Atlas and local MongoDB
# Use MONGODB_URI for production (MongoDB Atlas)
# Falls back to MONGO_URL + DB_NAME for local development
mongodb_uri = os.environ.get('MONGODB_URI')
if mongodb_uri:
    # MongoDB Atlas or full connection string
    client = AsyncIOMotorClient(mongodb_uri)
    # Extract database name from URI or use default
    db_name = os.environ.get('DB_NAME', 'kirti_portfolio')
    db = client[db_name]
    logging.info("✅ Connected to MongoDB using MONGODB_URI")
else:
    # Local MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
    db_name = os.environ.get('DB_NAME', 'kirti_portfolio')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    logging.info(f"✅ Connected to local MongoDB: {mongo_url}{db_name}")

# Create the main app without a prefix
app = FastAPI()

# Note: File uploads handled by Cloudinary (no local storage needed)
# All uploaded files are stored in cloud and accessed via Cloudinary URLs

# CORS Configuration
# Get allowed origins from environment variable
cors_origins_str = os.environ.get('CORS_ORIGINS', '*')

# Parse CORS origins - handle both comma-separated and wildcard
if cors_origins_str == '*':
    allowed_origins = ['*']
else:
    # Split by comma and strip whitespace
    allowed_origins = [origin.strip() for origin in cors_origins_str.split(',') if origin.strip()]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Log CORS configuration
logging.info(f"CORS enabled for origins: {allowed_origins}")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Import admin routes
from admin_routes import router as admin_router

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Public Events Endpoint
@api_router.get("/events")
async def get_public_events():
    from datetime import datetime
    # Get upcoming events only, exclude MongoDB _id
    events = await db.events.find(
        {"event_date": {"$gte": datetime.utcnow().isoformat()}},
        {"_id": 0}
    ).sort("event_date", 1).to_list(50)
    return events

# Public Content Endpoints
@api_router.get("/content/home")
async def get_home_content():
    content = await db.home_content.find_one({}, {"_id": 0})
    return content or {}

@api_router.get("/content/about")
async def get_about_content():
    content = await db.about_content.find_one({}, {"_id": 0})
    return content or {}

@api_router.get("/content/projects")
async def get_projects():
    projects = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return projects

@api_router.get("/content/gallery")
async def get_gallery():
    images = await db.gallery_images.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    # Guarantee resource_type is present for backward compatibility
    for item in images:
        if not item.get("resource_type"):
            item["resource_type"] = "image"
        if "instagram_url" not in item:
            item["instagram_url"] = ""
    return images

@api_router.get("/content/contact")
async def get_contact_info():
    contact = await db.contact_info.find_one({}, {"_id": 0})
    return contact or {"email": "contact@kirtikilledar.com", "instagram_url": "https://www.instagram.com/kirti.killedar/"}

# Contact Form Submission
@api_router.post("/contact/submit")
async def submit_contact_form(name: str, email: str, message: str):
    submission = {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "message": message,
        "created_at": datetime.utcnow(),
        "read": False
    }
    await db.contact_submissions.insert_one(submission)
    return {"message": "Message sent successfully"}

# File download endpoint (kept for backward compatibility with old URLs)
@api_router.get("/files/{file_id}")
async def download_file(file_id: str):
    """
    Legacy endpoint for files stored before Cloudinary migration.
    New uploads return Cloudinary URLs directly.
    """
    # Find file in database
    file_record = await db.uploaded_files.find_one(
        {"id": file_id, "is_deleted": False},
        {"_id": 0}
    )
    
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    # If file has Cloudinary URL, redirect to it
    if "cloudinary_url" in file_record and file_record["cloudinary_url"]:
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url=file_record["cloudinary_url"], status_code=301)
    
    # Fallback: try to fetch from old storage (for backward compatibility)
    try:
        from storage import get_object
        data, content_type = get_object(file_record["storage_path"])
        
        return Response(
            content=data,
            media_type=file_record.get("content_type", content_type),
            headers={
                "Content-Disposition": f'inline; filename="{file_record["original_filename"]}"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File retrieval failed: {str(e)}")

# Include the routers in the main app
app.include_router(api_router)
app.include_router(admin_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    """Initialize database and storage on startup"""
    global db
    db = client[os.environ['DB_NAME']]
    logging.info("Database connection established")
    
    # Initialize Cloudinary Storage
    try:
        from storage import init_storage
        init_storage()
        logging.info("✅ Cloudinary storage initialized")
    except Exception as e:
        logging.error(f"❌ Storage initialization failed: {e}")

    # One-time migrations (idempotent)
    try:
        # Drop deprecated project fields from all documents
        drop_result = await db.projects.update_many(
            {"$or": [
                {"creative_process": {"$exists": True}},
                {"behind_scenes": {"$exists": True}},
            ]},
            {"$unset": {"creative_process": "", "behind_scenes": ""}},
        )
        if drop_result.modified_count:
            logging.info(
                f"🧹 Removed creative_process/behind_scenes from "
                f"{drop_result.modified_count} project(s)"
            )

        # Backfill missing resource_type on gallery items (default "image")
        gallery_backfill = await db.gallery_images.update_many(
            {"resource_type": {"$exists": False}},
            {"$set": {"resource_type": "image"}},
        )
        if gallery_backfill.modified_count:
            logging.info(
                f"🧹 Backfilled resource_type='image' on "
                f"{gallery_backfill.modified_count} gallery item(s)"
            )
    except Exception as e:
        logging.warning(f"⚠️ Startup migrations skipped: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()