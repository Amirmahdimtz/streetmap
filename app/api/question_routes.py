from fastapi import APIRouter, Depends
from services.question_service import QuestionService
from dependencies.services import get_question_service
from dependencies.auth import get_current_user
from db.models import UserTable  # ✅ تغییر: UserModel -> UserTable

router = APIRouter()


@router.get("/")
def get_questions(
    current_user: UserTable = Depends(get_current_user),  # ✅ تغییر
    question_service: QuestionService = Depends(get_question_service)
):
    """دریافت لیست همه سوالات - نیاز به احراز هویت"""
    return question_service.get_all_questions()


@router.get("/{question_id}")
def get_question(
    question_id: int,
    current_user: UserTable = Depends(get_current_user),  # ✅ تغییر
    question_service: QuestionService = Depends(get_question_service)
):
    """دریافت یک سوال با آیدی - نیاز به احراز هویت"""
    return question_service.get_question(question_id)
