from fastapi import Depends
from sqlalchemy.orm import Session

from db.database import get_db

from repositories.user_repository import UserRepository
from repositories.question_repository import QuestionRepository
from repositories.answer_repository import AnswerRepository
from repositories.location_repository import LocationRepository


def get_user_repository(db: Session = Depends(get_db)):
    return UserRepository(db)


def get_question_repository(db: Session = Depends(get_db)):
    return QuestionRepository(db)


def get_answer_repository(db: Session = Depends(get_db)):
    return AnswerRepository(db)


def get_location_repository(db: Session = Depends(get_db)):
    return LocationRepository(db)
