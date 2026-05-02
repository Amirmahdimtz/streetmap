from pydantic import BaseModel, Field


class UserRegisterSchema(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserLoginSchema(BaseModel):  # ✅ اضافه کن
    username: str
    password: str
