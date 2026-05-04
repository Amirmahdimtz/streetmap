from sqlalchemy.orm import Session
from app.db.models import QuestionTable


class QuestionRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_questions(self):
        """دریافت لیست همه سوالات"""
        return self.db.query(QuestionTable).all()

    def get_question_by_id(self, question_id: int):
        """دریافت یک سوال با آیدی"""
        # ✅ مشکل اینجا بود: first رو باید با پرانتز صدا بزنی
        return self.db.query(QuestionTable).filter(QuestionTable.id == question_id).first()
