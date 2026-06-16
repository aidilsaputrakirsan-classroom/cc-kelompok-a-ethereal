from pydantic import BaseModel
from pydantic import EmailStr


from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Optional[str] = "member"


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class VerifyResponse(BaseModel):
    user_id: int
    email: EmailStr
    name: str
    role: str


class UpgradeRoleRequest(BaseModel):
    new_role: str
    
    class Config:
        from_attributes = True


class UserUpdateAdmin(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None

    class Config:
        from_attributes = True