from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum as PyEnum
import re


# ============================================================
# AUTH SCHEMAS
# ============================================================

class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8)

    @field_validator("password")
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password minimal 8 karakter")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password harus mengandung huruf besar")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password harus mengandung huruf kecil")
        if not re.search(r"[0-9]", value):
            raise ValueError("Password harus mengandung angka")
        return value


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None


# ============================================================
# TASK SCHEMAS
# ============================================================

class TaskStatus(str, PyEnum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    assigned_to: Optional[int] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    deadline: Optional[datetime] = None
    assigned_to: Optional[int] = None


class TaskResponse(TaskBase):
    id: int
    status: TaskStatus
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True