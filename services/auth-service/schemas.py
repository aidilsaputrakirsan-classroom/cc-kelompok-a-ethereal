from pydantic import BaseModel
from pydantic import EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr = None
    username: str = None
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class VerifyResponse(BaseModel):
    user_id: int
    email: EmailStr
    name: str