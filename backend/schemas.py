from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re


# ============================================================
# ITEM SCHEMAS
# ============================================================

class ItemBase(BaseModel):
    """Base schema — field yang dipakai untuk create & update."""
    name: str = Field(..., min_length=1, max_length=100, examples=["Laptop"])
    description: Optional[str] = Field(None, examples=["Laptop untuk cloud computing"])
    price: float = Field(..., gt=0, examples=[15000000])
    quantity: int = Field(0, ge=0, examples=[10])


class ItemCreate(ItemBase):
    """Schema untuk membuat item baru."""
    pass


class ItemUpdate(BaseModel):
    """Schema untuk update item (semua field optional)."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)


class ItemResponse(ItemBase):
    """Schema untuk response item."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ItemListResponse(BaseModel):
    """Schema untuk list items."""
    total: int
    items: list[ItemResponse]


# ============================================================
# AUTH SCHEMAS
# ============================================================

class UserCreate(BaseModel):
    """Schema untuk registrasi user baru."""
    email: EmailStr = Field(..., examples=["user@student.itk.ac.id"])
    name: str = Field(..., min_length=2, max_length=100, examples=["Tiya Mitra"])
    password: str = Field(..., min_length=8, examples=["Password123"])

    @field_validator("password")
    def validate_password(cls, value):
        """
        Password harus:
        - minimal 8 karakter
        - ada huruf besar
        - ada huruf kecil
        - ada angka
        """
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
    """Schema untuk response user (tanpa password)."""
    id: int
    email: EmailStr
    name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Schema login (opsional, karena sekarang pakai OAuth2 form)."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema response token."""
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None