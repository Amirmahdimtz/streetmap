# app/services/profile_service.py (فایل جدید)

from app.repositories.profile_repository import ProfileRepository
from fastapi import HTTPException

class ProfileService:
    def __init__(self, profile_repo: ProfileRepository):
        self.profile_repo = profile_repo

    def save_profile(self, user_id: int, first_name: str, last_name: str, skills: str, objective: str):
        return self.profile_repo.create_or_update(
            user_id=user_id,
            first_name=first_name,
            last_name=last_name,
            skills=skills,
            objective=objective
        )

    def get_profile(self, user_id: int):
        profile = self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile