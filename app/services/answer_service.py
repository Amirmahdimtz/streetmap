from repositories.answer_repository import AnswerRepository
from repositories.question_repository import QuestionRepository


class AnswerService:

    def __init__(
        self,
        answer_repo: AnswerRepository,
        question_repo: QuestionRepository
    ):
        self.answer_repo = answer_repo
        self.question_repo = question_repo

    def submit_answer(self, user_id: int, question_id: int, value: str):

        question = self.question_repo.get_question_by_id(question_id)

        if not question:
            raise ValueError("Question not found")

        return self.answer_repo.create_answer(
            user_id=user_id,
            question_id=question_id,
            value=value
        )

    def get_user_answers(self, user_id: int):
        return self.answer_repo.list_user_answers(user_id)
