# location_routes.py
from fastapi import APIRouter, Depends
from schemas.location_schema import LocationCreate
from services.location_service import LocationService
from dependencies.services import get_location_service
from dependencies.auth import get_current_user

router = APIRouter()


@router.post("/")
def save_location(
    data: LocationCreate,
    current_user=Depends(get_current_user),
    location_service: LocationService = Depends(get_location_service)
):
    # ✅ اصلاح: استفاده از add_location (همنام با سرویس)
    return location_service.add_location(
        user_id=current_user.id,
        latitude=data.latitude,
        longitude=data.longitude
    )
