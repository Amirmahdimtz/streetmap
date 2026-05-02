from fastapi import APIRouter, Depends, HTTPException
from schemas.auth_schema import UserRegisterSchema, UserLoginSchema
from services.auth_service import AuthService
from dependencies.services import get_auth_service
from core.security import create_jwt_token, pwd_context  # ✅ اصلاح
from datetime import timedelta

router = APIRouter()


@router.post("/register")
def register(
    data: UserRegisterSchema,
    auth_service: AuthService = Depends(get_auth_service)
):
    return auth_service.register(data)


@router.post("/login")
def login(
    data: UserLoginSchema,
    auth_service: AuthService = Depends(get_auth_service)
):
    # پیدا کردن کاربر
    user = auth_service.user_repo.get_user_by_username(data.username)
    if not user:
        raise HTTPException(
            status_code=400, detail="username or password wrong")

    # بررسی رمز
    if not pwd_context.verify(data.password, user.password):
        raise HTTPException(
            status_code=400, detail="username or password wrong")

    # ساخت توکن واقعی
    access_token = create_jwt_token(
        data={"user_id": user.id},
        expires_delta=timedelta(minutes=30),
        token_type="access"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }
