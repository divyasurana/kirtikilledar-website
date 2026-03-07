from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from typing import List
import jwt
import bcrypt
import os
import uuid
import shutil
from pathlib import Path

router = APIRouter(prefix="/api/admin", tags=["admin"])
security = HTTPBearer()

SECRET_KEY = os.environ.get("JWT_SECRET", "kirti-secret-key-change-in-production-2024")
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
async def login(username: str, password: str):
    from server import db
    
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
    upload_dir = Path("/app/frontend/public/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = upload_dir / unique_filename
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"url": f"/uploads/{unique_filename}"}

@router.get("/home")
async def get_home_content(user: dict = Depends(verify_token)):
    from server import db
    content = await db.home_content.find_one()
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
    content = await db.about_content.find_one()
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
    projects = await db.projects.find().sort("created_at", -1).to_list(100)
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
    images = await db.gallery_images.find().sort("created_at", -1).to_list(200)
    return images

@router.post("/gallery")
async def add_gallery_image(data: dict, user: dict = Depends(verify_token)):
    from server import db
    data["id"] = str(uuid.uuid4())
    data["created_at"] = datetime.utcnow()
    await db.gallery_images.insert_one(data)
    return {"message": "Image added", "id": data["id"]}

@router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, user: dict = Depends(verify_token)):
    from server import db
    result = await db.gallery_images.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted"}

@router.get("/contact")
async def get_contact_info(user: dict = Depends(verify_token)):
    from server import db
    contact = await db.contact_info.find_one()
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
    submissions = await db.contact_submissions.find().sort("created_at", -1).to_list(100)
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
