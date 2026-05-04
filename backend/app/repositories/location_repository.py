from sqlalchemy.orm import Session
from app.db.models import LocationTable


class LocationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_location(self, user_id: int, latitude: float, longitude: float, address: str = None):
        loc = LocationTable(
            user_id=user_id,
            latitude=latitude,
            longitude=longitude,
            address=address  # ✅ اضافه شد
        )
        self.db.add(loc)
        self.db.commit()
        self.db.refresh(loc)
        return loc

    def list_locations_by_user(self, user_id: int):
        return (
            self.db.query(LocationTable)
            .filter(LocationTable.user_id == user_id)
            .all()
        )
