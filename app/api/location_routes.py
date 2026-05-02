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
    return location_service.save_location(current_user.id, data)
