# app/schemas/profile_schema.py (فایل جدید)

from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ProfileCreate(BaseModel):
    first_name: str
    last_name: str
    skills: str
    objective: str

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    skills: str
    objective: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ProfileUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    skills: str | None = None
    objective: str | None = None