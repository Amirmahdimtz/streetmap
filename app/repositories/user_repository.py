from sqlalchemy.orm import Session
from db.models import UserTable


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, username: str, password: str):
        user = UserTable(username=username, password=password)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_user_by_id(self, user_id: int):
        return self.db.query(UserTable).filter(UserTable.id == user_id).first()

    def get_user_by_username(self, username: str):
        return self.db.query(UserTable).filter(UserTable.username == username).first()
