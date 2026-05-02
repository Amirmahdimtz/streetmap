from sqlalchemy.orm import Session
from db.models import AnswerTable


class AnswerRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_answer(self, user_id: int, question_id: int, value: str):
        answer = AnswerTable(
            user_id=user_id,
            question_id=question_id,
            value=value)
        self.db.add(answer)
        self.db.commit()
        self.db.refresh(answer)
        return answer

    def list_user_answer(self, user_id: int):
        return self.db.query(AnswerTable).filter(AnswerTable.user_id == user_id).all()
