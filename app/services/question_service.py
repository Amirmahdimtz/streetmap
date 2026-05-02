from repositories.question_repository import QuestionRepository
from fastapi import HTTPException  # ✅ اضافه شد


class QuestionService:

    def __init__(self, question_repo: QuestionRepository):
        self.question_repo = question_repo

    # ✅ متد لیست کردن همه سوالات
    def list_questions(self):
        """دریافت لیست همه سوالات"""
        return self.question_repo.list_questions()

    # ✅ متد گرفتن یک سوال
    def get_question(self, question_id: int):
        """دریافت یک سوال با آیدی"""
        question = self.question_repo.get_question_by_id(question_id)

        if not question:
            raise HTTPException(  # ✅ بهتره از HTTPException استفاده کنی نه ValueError
                status_code=404,
                detail="Question not found"
            )

        return question

    # ✅ این متد رو اضافه کردم برای هماهنگی با route
    def get_all_questions(self):
        """alias برای list_questions (برای هماهنگی با route)"""
        return self.list_questions()
