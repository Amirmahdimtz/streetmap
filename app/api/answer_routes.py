from fastapi import APIRouter, Depends
from schemas.answer_schema import AnswerCreate
from services.answer_service import AnswerService
from dependencies.services import get_answer_service
from dependencies.auth import get_current_user

router = APIRouter()


@router.post("/")
def submit_answer(
    data: AnswerCreate,
    current_user=Depends(get_current_user),
    answer_service: AnswerService = Depends(get_answer_service)
):
    return answer_service.submit_answer(current_user.id, data)
