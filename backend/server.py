from fastapi import FastAPI, APIRouter, HTTPException, Query, Header
from fastapi.staticfiles import StaticFiles
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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create uploads directory if it doesn't exist (in backend, not frontend)
UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

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

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    
    # Initialize Emergent Object Storage
    try:
        from storage import init_storage
        init_storage()
        logging.info("✅ Emergent Object Storage initialized")
    except Exception as e:
        logging.error(f"❌ Storage initialization failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()