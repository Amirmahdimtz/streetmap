from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List
from app.schemas.location_schema import LocationCreate, LocationResponse
from app.services.location_service import LocationService
from app.dependencies.services import get_location_service
from app.dependencies.auth import get_current_user
from app.db.models import UserTable

router = APIRouter()


@router.get("/map", response_class=HTMLResponse)
async def get_location_map():
    """صفحه انتخاب موقعیت مکانی با نقشه"""
    try:
        with open("templates/map.html", "r", encoding="utf-8") as f:
            html_content = f.read()
        return HTMLResponse(content=html_content)
    except FileNotFoundError:
        return HTMLResponse(
            content="<h1>خطا</h1><p>فایل map.html پیدا نشد. لطفاً فایل را در پوشه templates قرار دهید.</p>",
            status_code=404
        )


@router.post("/", response_model=LocationResponse)
def save_location(
    data: LocationCreate,
    current_user: UserTable = Depends(get_current_user),
    location_service: LocationService = Depends(get_location_service)
):
    """ذخیره موقعیت مکانی کاربر"""
    return location_service.add_location(
        user_id=current_user.id,
        latitude=data.latitude,
        longitude=data.longitude,
        address=data.address  # ✅ اضافه شد
    )


@router.get("/", response_model=List[LocationResponse])
def get_user_locations(
    current_user: UserTable = Depends(get_current_user),
    location_service: LocationService = Depends(get_location_service)
):
    """دریافت تمام موقعیت‌های ذخیره شده کاربر"""
    return location_service.list_user_locations(current_user.id)


@router.post("/save-named")
def save_named_location(
    data: LocationCreate,
    name: str,
    current_user: UserTable = Depends(get_current_user),
    location_service: LocationService = Depends(get_location_service)
):
    """ذخیره موقعیت با نام (خانه، محل کار و...) - در صورت نیاز"""
    # این تابع را اگر در سرویس پیاده کردید استفاده کنید
    return {"message": "قابلیت ذخیره با نام در حال توسعه است"}
