from pydantic import BaseModel, Field, field_validator, ConfigDict
from datetime import datetime


class UserLoginSchema(BaseModel):
    username: str = Field(..., max_length=250,
                          description="username of the user")
    password: str = Field(..., description="password of the user")
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "username": "john_doe",
                "password": "secret123"
            }
        }
    )


class UserRegisterSchema(BaseModel):
    username: str = Field(..., max_length=250,
                          description="username of the user")
    password: str = Field(..., min_length=8, max_length=72,
                          description="password of the user")
    password_confirm: str = Field(...,
                                  description="confirm password of the user")

    @field_validator("password_confirm")
    def check_password_match(cls, password_confirm, validation):
        if not password_confirm == validation.data.get("password"):
            raise ValueError("passwords dosent match")
        return password_confirm


class UserResponse(BaseModel):
    id: int
    username: str
    is_active: bool
    create_date: datetime

    model_config = ConfigDict(
        from_attributes=True,  # برای تبدیل SQLAlchemy مدل به Pydantic
        json_schema_extra={
            "example": {
                "id": 1,
                "username": "john_doe",
                "is_active": True,
                "create_date": "2024-01-01T10:00:00"
            }
        }
    )
