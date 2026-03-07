from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

# Admin User Model
class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminLogin(BaseModel):
    username: str
    password: str

# Home Page Content
class HomeContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hero_image: str
    tagline: str
    intro_text: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# About Page Content
class AboutContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    portrait_image: str
    background_text: str
    approach_text: str
    influences_text: str
    skills: List[str]
    quote: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Project Model
class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    type: str
    category: str
    year: str
    description: str
    image: str
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    duration: Optional[str] = None
    summary: str
    creative_process: str
    behind_scenes: str
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    type: str
    category: str
    year: str
    description: str
    image: str
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    duration: Optional[str] = None
    summary: str
    creative_process: str
    behind_scenes: str

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    year: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    duration: Optional[str] = None
    summary: Optional[str] = None
    creative_process: Optional[str] = None
    behind_scenes: Optional[str] = None

# Gallery Image Model
class GalleryImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_url: str
    caption: str
    category: str
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GalleryImageCreate(BaseModel):
    image_url: str
    caption: str
    category: str

# Contact Info Model
class ContactInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    instagram_url: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Contact Form Submission
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False
