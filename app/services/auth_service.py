from fastapi import HTTPException
from passlib.context import CryptContext
from repositories.user_repository import UserRepository
from schemas.auth_schema import UserRegisterSchema
import jwt
from datetime import datetime, timedelta, timezone
from core.config import get_settings

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
        self.pwd_context = pwd_context

    def register(self, data: UserRegisterSchema):
        user = self.user_repo.get_user_by_username(data.username)
        if user:
            raise HTTPException(
                status_code=400, detail="username already exists")

        hashed_password = pwd_context.hash(data.password)

        new_user = self.user_repo.create_user(
            username=data.username,
            password=hashed_password
        )

        return {
            "id": new_user.id,
            "username": new_user.username
        }

    def decode_token(self, token: str):
        """دیکد کردن توکن JWT - همیشه کار می‌کند"""
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=["HS256"]
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

    def get_user_by_id(self, user_id: int):
        """گرفتن کاربر با آیدی"""
        return self.user_repo.get_user_by_id(user_id)
