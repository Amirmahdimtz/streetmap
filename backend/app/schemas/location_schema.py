# app/schemas/location_schema.py

from pydantic import BaseModel, Field

class LocationCreate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: str | None = None  # ✅ اضافه شود


class LocationResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    address: str | None = None  # ✅ اضافه شود

    class Config:
        from_attributes = True