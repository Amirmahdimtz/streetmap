from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from passlib.context import CryptContext
from core.config import get_settings
from db.database import get_db
from db.models import UserTable

settings = get_settings()

security = HTTPBearer()

# ✅ درست کردن pwd_context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ========== توابع هش ==========
def hash_password(plain_password: str) -> str:
    """هش کردن رمز عبور"""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """بررسی رمز عبور"""
    return pwd_context.verify(plain_password, hashed_password)


# ========== توابع JWT (مطابق تسک‌ها) ==========
def create_jwt_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
    token_type: str = "access"
) -> str:
    """ساخت JWT token - تابع اصلی"""
    to_encode = data.copy()
    to_encode["type"] = token_type
    to_encode["iat"] = datetime.now(timezone.utc)

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode["exp"] = expire

    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm="HS256")


def decode_jwt(token: str) -> Dict[str, Any]:
    """دیکد و اعتبارسنجی JWT token"""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )


# ========== توابع تولید توکن ==========
def generate_access_token(user_id: int, expires_in: int = 60*15) -> str:
    """تولید توکن دسترسی"""
    return create_jwt_token(
        data={"user_id": user_id},
        expires_delta=timedelta(seconds=expires_in),
        token_type="access"
    )


def generate_refresh_token(user_id: int, expires_in: int = 3600*24) -> str:
    """تولید توکن رفرش"""
    return create_jwt_token(
        data={"user_id": user_id},
        expires_delta=timedelta(seconds=expires_in),
        token_type="refresh"
    )


# ========== تابع اعتبارسنجی کاربر ==========
def get_authenticated_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> UserTable:
    """گرفتن کاربر احراز هویت شده"""
    token = credentials.credentials

    # استفاده از تابع decode_jwt
    try:
        decoded = decode_jwt(token)
    except HTTPException:
        raise

    # بررسی نوع توکن (مهم برای امنیت)
    if decoded.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type. Access token required."
        )

    # استخراج user_id
    user_id = decoded.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing user_id"
        )

    # پیدا کردن کاربر در دیتابیس
    user = db.query(UserTable).filter(UserTable.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # بررسی فعال بودن کاربر
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )

    return user
