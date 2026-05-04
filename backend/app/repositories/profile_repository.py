# app/repositories/profile_repository.py (فایل جدید)

from sqlalchemy.orm import Session
from app.db.models import ProfileTable

class ProfileRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: int):
        return self.db.query(ProfileTable).filter(ProfileTable.user_id == user_id).first()

    def create_or_update(self, user_id: int, first_name: str, last_name: str, skills: str, objective: str):
        profile = self.get_by_user_id(user_id)
        
        if profile:
            # به‌روزرسانی
            profile.first_name = first_name
            profile.last_name = last_name
            profile.skills = skills
            profile.objective = objective
        else:
            # ایجاد جدید
            profile = ProfileTable(
                user_id=user_id,
                first_name=first_name,
                last_name=last_name,
                skills=skills,
                objective=objective
            )
            self.db.add(profile)
        
        self.db.commit()
        self.db.refresh(profile)
        return profile