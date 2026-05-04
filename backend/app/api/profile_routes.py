# app/api/profile_routes.py (فایل جدید)

from fastapi import APIRouter, Depends
from app.schemas.profile_schema import ProfileCreate, ProfileResponse
from app.services.profile_service import ProfileService
from app.dependencies.services import get_profile_service
from app.dependencies.auth import get_current_user
from app.db.models import UserTable

router = APIRouter()

@router.post("/", response_model=ProfileResponse)
def save_profile(
    data: ProfileCreate,
    current_user: UserTable = Depends(get_current_user),
    profile_service: ProfileService = Depends(get_profile_service)
):
    """ذخیره یا به‌روزرسانی پروفایل کاربر"""
    return profile_service.save_profile(
        user_id=current_user.id,
        first_name=data.first_name,
        last_name=data.last_name,
        skills=data.skills,
        objective=data.objective
    )

@router.get("/", response_model=ProfileResponse)
def get_profile(
    current_user: UserTable = Depends(get_current_user),
    profile_service: ProfileService = Depends(get_profile_service)
):
    """دریافت پروفایل کاربر"""
    return profile_service.get_profile(current_user.id)