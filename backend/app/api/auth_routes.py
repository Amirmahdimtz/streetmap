from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth_schema import UserRegisterSchema, UserLoginSchema
from app.services.auth_service import AuthService
from app.dependencies.services import get_auth_service
from app.core.security import pwd_context  # فقط برای verify استفاده می‌شود

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

    # ✅ استفاده از سرویس برای ساخت توکن
    access_token = auth_service.create_access_token(
        user_id=user.id,
        expires_minutes=30
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }
