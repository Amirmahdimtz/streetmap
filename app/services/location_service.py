from repositories.location_repository import LocationRepository


class LocationService:

    def __init__(self, location_repo: LocationRepository):
        self.location_repo = location_repo

    def add_location(self, user_id: int, latitude: float, longitude: float):

        if latitude < -90 or latitude > 90:
            raise ValueError("Invalid latitude")

        if longitude < -180 or longitude > 180:
            raise ValueError("Invalid longitude")

        return self.location_repo.create_location(
            user_id=user_id,
            latitude=latitude,
            longitude=longitude
        )

    def list_user_locations(self, user_id: int):
        return self.location_repo.list_locations_by_user(user_id)
