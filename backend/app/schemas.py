from pydantic import BaseModel, Field, EmailStr, field_validator  
# BaseModel = dasar schema
# Field = validasi tambahan (min, max, dll)
# EmailStr = otomatis cek format email
# field_validator = buat validasi custom

from typing import Optional  
# Optional = boleh kosong
# List = list data

from datetime import datetime  
# buat tipe tanggal

from enum import Enum as PyEnum  
# buat pilihan tetap (enum)

import re  
# buat cek pola (dipakai untuk password)

# ============================================================
# AUTH SCHEMAS
# ============================================================

class UserCreate(BaseModel):
    email: EmailStr  
    # email harus format valid

    name: str = Field(..., min_length=2, max_length=100)  
    # nama wajib diisi, min 2 karakter

    password: str = Field(..., min_length=8)  
    # password minimal 8 karakter

    @field_validator("password")
    def validate_password(cls, value):
        # cek panjang password
        if len(value) < 8:
            raise ValueError("Password minimal 8 karakter")

        # harus ada huruf besar
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password harus mengandung huruf besar")

        # harus ada huruf kecil
        if not re.search(r"[a-z]", value):
            raise ValueError("Password harus mengandung huruf kecil")

        # harus ada angka
        if not re.search(r"[0-9]", value):
            raise ValueError("Password harus mengandung angka")

        return value  
        # kalau lolos semua → password valid


class UserResponse(BaseModel):
    id: int  
    email: EmailStr  
    name: str  
    is_active: bool  
    created_at: datetime  

    class Config:
        from_attributes = True  
        # supaya bisa ambil data langsung dari database model


class LoginRequest(BaseModel):
    email: str  
    password: str  
    # data login


class TokenResponse(BaseModel):
    access_token: str  
    token_type: str = "bearer"  
    user: Optional[UserResponse] = None  
    # response setelah login


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

    # 🔥 TAMBAHAN
    category: Optional[str] = None


class TaskCreate(TaskBase):
    pass
    # sudah otomatis punya category dari TaskBase


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    deadline: Optional[datetime] = None
    assigned_to: Optional[int] = None

    # 🔥 TAMBAHAN
    category: Optional[str] = None


class TaskResponse(TaskBase):
    id: int
    status: TaskStatus
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True