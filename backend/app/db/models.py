from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey, Float, func
from app.db.database import Base
from sqlalchemy.orm import relationship
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserTable(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(250), nullable=False, unique=True, index=True)
    password = Column(String, nullable=False)

    is_active = Column(Boolean, default=True)

    create_date = Column(DateTime, server_default=func.now())
    update_date = Column(DateTime, server_default=func.now(),
                         server_onupdate=func.now())

    profile = relationship("ProfileTable", back_populates="user", uselist=False)  # اضافه شود
    answer = relationship("AnswerTable", back_populates="user")
    locations = relationship("LocationTable", back_populates="user")

    # tasks = relationship("TaskModel", back_populates="user")
    tokens = relationship("TokenModel", back_populates="user")

    def hash_password(self, plain_password: str) -> str:
        return pwd_context.hash(plain_password)

    def verify_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self.password)

    def set_password(self, plain_text: str) -> None:
        self.password = self.hash_password(plain_text)


class TokenModel(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(String, nullable=False, unique=True)
    create_date = Column(DateTime, server_default=func.now())

    user = relationship("UserTable", uselist=False)


class QuestionTable(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(Text)

    answer = relationship("AnswerTable", back_populates="question")


class AnswerTable(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, autoincrement=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"))

    value = Column(String, nullable=False)

    user = relationship("UserTable", back_populates="answer")
    question = relationship("QuestionTable", back_populates="answer")

# app/db/models.py - فقط اضافه کنید، هیچ چیزی را پاک نکنید

class ProfileTable(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    skills = Column(Text)
    objective = Column(Text)
    created_at = Column(DateTime, server_default=func.now())  # ✅ اضافه شود
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())  # ✅ اضافه شود
    
    user = relationship("UserTable", back_populates="profile")

class LocationTable(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(500), nullable=True)  # ✅ اضافه شود

    user = relationship("UserTable", back_populates="locations")

# app/db/models.py - اضافه کنید


class SavedLocationTable(Base):
    __tablename__ = "saved_locations"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(250))  # مثلاً "خانه", "محل کار"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(500))  # آدرس Reverse Geocoding
    is_current = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
