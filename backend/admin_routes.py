from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta, timezone
from typing import List
import jwt
import bcrypt
import os
import uuid
import shutil
from pathlib import Path

router = APIRouter(prefix="/api/admin", tags=["admin"])
security = HTTPBearer()

SECRET_KEY = os.environ.get("JWT_SECRET")
if not SECRET_KEY:
    raise ValueError("JWT_SECRET environment variable must be set")
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/login")
async def login(credentials: dict):
    from server import db
    
    username = credentials.get("username")
    password = credentials.get("password")
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")
    
    user = await db.admin_users.find_one({"username": username})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user["username"], "id": user["id"]})
    
    return {"access_token": token, "token_type": "bearer", "username": user["username"]}

@router.post("/initialize")
async def initialize_admin(username: str = "admin", password: str = "Kirti2024!"):
    from server import db
    
    existing = await db.admin_users.find_one({"username": username})
    if existing:
        return {"message": "Admin user already exists"}
    
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    
    admin_user = {
        "id": str(uuid.uuid4()),
        "username": username,
        "password_hash": password_hash,
        "created_at": datetime.utcnow()
    }
    
    await db.admin_users.insert_one(admin_user)
    return {"message": f"Admin created! Username: {username}, Password: {password}"}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), user: dict = Depends(verify_token)):
    from storage import put_object, get_content_type
    from server import db
    
    # Read file data
    file_data = await file.read()
    
    # Generate unique path
    file_ext = Path(file.filename).suffix.lstrip('.') if '.' in file.filename else 'bin'
    unique_id = str(uuid.uuid4())
    storage_path = f"kirtikilledar/uploads/{unique_id}.{file_ext}"
    
    # Get content type
    content_type = file.content_type or get_content_type(file.filename)
    
    try:
        # Upload to Cloudinary
        result = put_object(storage_path, file_data, content_type)
        
        # Store metadata in MongoDB
        file_record = {
            "id": unique_id,
            "storage_path": result["path"],
            "cloudinary_url": result["secure_url"],
            "original_filename": file.filename,
            "content_type": content_type,
            "size": result["size"],
            "resource_type": result.get("resource_type", "image"),
            "public_id": result.get("path"),  # Cloudinary public ID
            "is_deleted": False,
            "uploaded_by": user.get("id"),
            "created_at": datetime.now(timezone.utc)
        }
        await db.uploaded_files.insert_one(file_record)
        
        # Return Cloudinary URL directly (no need for backend proxy)
        return {
            "url": result["secure_url"],
            "id": unique_id,
            "filename": file.filename,
            "size": result["size"],
            "resource_type": result.get("resource_type", "image"),
            "public_id": result.get("path")  # Return public_id for deletion
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/home")
async def get_home_content(user: dict = Depends(verify_token)):
    from server import db
    content = await db.home_content.find_one({}, {"_id": 0})
    return content or {}

@router.post("/home")
async def update_home_content(data: dict, user: dict = Depends(verify_token)):
    from server import db
    data["updated_at"] = datetime.utcnow()
    await db.home_content.replace_one({}, data, upsert=True)
    return {"message": "Home content updated"}

@router.get("/about")
async def get_about_content(user: dict = Depends(verify_token)):
    from server import db
    content = await db.about_content.find_one({}, {"_id": 0})
    return content or {}

@router.post("/about")
async def update_about_content(data: dict, user: dict = Depends(verify_token)):
    from server import db
    data["updated_at"] = datetime.utcnow()
    await db.about_content.replace_one({}, data, upsert=True)
    return {"message": "About content updated"}

@router.get("/projects")
async def get_projects(user: dict = Depends(verify_token)):
    from server import db
    projects = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return projects

@router.post("/projects")
async def create_project(data: dict, user: dict = Depends(verify_token)):
    from server import db
    data["id"] = str(uuid.uuid4())
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()
    await db.projects.insert_one(data)
    return {"message": "Project created", "id": data["id"]}

@router.put("/projects/{project_id}")
async def update_project(project_id: str, data: dict, user: dict = Depends(verify_token)):
    from server import db
    data["updated_at"] = datetime.utcnow()
    result = await db.projects.update_one({"id": project_id}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project updated"}

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str, user: dict = Depends(verify_token)):
    from server import db
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

@router.get("/gallery")
async def get_gallery(user: dict = Depends(verify_token)):
    from server import db
    images = await db.gallery_images.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return images

@router.post("/gallery")
async def add_gallery_image(data: dict, user: dict = Depends(verify_token)):
    from server import db
    data["id"] = str(uuid.uuid4())
    data["created_at"] = datetime.utcnow()
    await db.gallery_images.insert_one(data)
    return {"message": "Image added", "id": data["id"]}

@router.put("/gallery/{image_id}")
async def update_gallery_image(image_id: str, data: dict, user: dict = Depends(verify_token)):
    """
    Update a gallery item.

    If `data["image_url"]` has changed and the old item has a `public_id`,
    the old Cloudinary asset is deleted (best-effort — DB write still succeeds).
    Allowed fields: caption, category, resource_type, image_url, public_id, instagram_url.
    Unknown fields are dropped.
    """
    from server import db
    from storage import delete_object
    import logging

    existing = await db.gallery_images.find_one({"id": image_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Gallery item not found")

    allowed = {"caption", "category", "resource_type", "image_url", "public_id", "instagram_url"}
    update = {k: v for k, v in (data or {}).items() if k in allowed}

    # If the image_url is being replaced, delete the old Cloudinary asset
    new_url = update.get("image_url")
    old_url = existing.get("image_url")
    old_public_id = existing.get("public_id")
    if new_url and old_url and new_url != old_url and old_public_id:
        try:
            old_resource_type = existing.get("resource_type", "image")
            delete_object(old_public_id, resource_type=old_resource_type)
            logging.info(f"✅ Replaced — old Cloudinary asset deleted: {old_public_id}")
        except Exception as e:
            logging.warning(f"⚠️ Could not delete old Cloudinary asset: {e}")

    update["updated_at"] = datetime.utcnow()
    await db.gallery_images.update_one({"id": image_id}, {"$set": update})
    return {"message": "Gallery item updated"}

@router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, user: dict = Depends(verify_token)):
    from server import db
    from storage import delete_object
    import logging
    
    # Get the gallery item to find its public_id
    item = await db.gallery_images.find_one({"id": image_id}, {"_id": 0})
    
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    
    # Delete from Cloudinary if public_id exists
    if item.get("public_id"):
        try:
            resource_type = item.get("resource_type", "image")
            delete_object(item["public_id"], resource_type=resource_type)
            logging.info(f"✅ Deleted from Cloudinary: {item['public_id']}")
        except Exception as e:
            logging.warning(f"⚠️ Could not delete from Cloudinary: {e}")
            # Continue with database deletion even if Cloudinary delete fails
    
    # Delete from database
    result = await db.gallery_images.delete_one({"id": image_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    
    return {"message": "Gallery item deleted", "cloudinary_deleted": bool(item.get("public_id"))}

@router.get("/contact")
async def get_contact_info(user: dict = Depends(verify_token)):
    from server import db
    contact = await db.contact_info.find_one({}, {"_id": 0})
    return contact or {}

@router.post("/contact")
async def update_contact_info(data: dict, user: dict = Depends(verify_token)):
    from server import db
    data["updated_at"] = datetime.utcnow()
    await db.contact_info.replace_one({}, data, upsert=True)
    return {"message": "Contact info updated"}

@router.get("/submissions")
async def get_submissions(user: dict = Depends(verify_token)):
    from server import db
    submissions = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return submissions

@router.put("/submissions/{submission_id}/read")
async def mark_read(submission_id: str, user: dict = Depends(verify_token)):
    from server import db
    result = await db.contact_submissions.update_one(
        {"id": submission_id},
        {"$set": {"read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"message": "Marked as read"}

# Events Management
@router.get("/events")
async def get_events(user: dict = Depends(verify_token)):
    from server import db
    events = await db.events.find({}, {"_id": 0}).sort("event_date", 1).to_list(100)
    return events

@router.post("/events")
async def create_event(data: dict, user: dict = Depends(verify_token)):
    from server import db
    data["id"] = str(uuid.uuid4())
    data["created_at"] = datetime.utcnow()
    await db.events.insert_one(data)
    return {"message": "Event created", "id": data["id"]}

@router.put("/events/{event_id}")
async def update_event(event_id: str, data: dict, user: dict = Depends(verify_token)):
    from server import db
    result = await db.events.update_one({"id": event_id}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated"}

@router.delete("/events/{event_id}")
async def delete_event(event_id: str, user: dict = Depends(verify_token)):
    from server import db
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}
