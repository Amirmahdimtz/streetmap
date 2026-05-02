from fastapi import Depends
from sqlalchemy.orm import Session

from db.database import get_db

from repositories.user_repository import UserRepository
from repositories.question_repository import QuestionRepository
from repositories.answer_repository import AnswerRepository
from repositories.location_repository import LocationRepository

from services.auth_service import AuthService
from services.question_service import QuestionService
from services.answer_service import AnswerService
from services.location_service import LocationService


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
