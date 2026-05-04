from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.repositories.user_repository import UserRepository
from app.repositories.question_repository import QuestionRepository
from app.repositories.answer_repository import AnswerRepository
from app.repositories.location_repository import LocationRepository

from app.services.auth_service import AuthService
from app.services.question_service import QuestionService
from app.services.answer_service import AnswerService
from app.services.location_service import LocationService
# app/dependencies/services.py

from app.repositories.profile_repository import ProfileRepository
from app.services.profile_service import ProfileService

# اضافه کنید
def get_profile_service(db: Session = Depends(get_db)):
    repo = ProfileRepository(db)
    return ProfileService(repo)

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    user_repo = UserRepository(db)
    return AuthService(user_repo)


def get_question_service(db: Session = Depends(get_db)) -> QuestionService:
    repo = QuestionRepository(db)
    return QuestionService(repo)


def get_answer_service(db: Session = Depends(get_db)) -> AnswerService:
    repo = AnswerRepository(db)
    return AnswerService(repo)


def get_location_service(db: Session = Depends(get_db)) -> LocationService:
    repo = LocationRepository(db)
    return LocationService(repo)
