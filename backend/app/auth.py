import os  
# buat ambil data dari file .env (kayak SECRET_KEY)

from datetime import datetime, timedelta, timezone  
# buat waktu sekarang & waktu expired token

from typing import Optional  
# artinya parameter boleh ada / boleh kosong

from dotenv import load_dotenv  
# biar .env bisa dibaca

from jose import JWTError, jwt  
# buat bikin token & baca token

from passlib.context import CryptContext  
# buat hash password (biar aman)

from fastapi import Depends, HTTPException, status  
# Depends = ambil data otomatis
# HTTPException = buat error
# status = kode error

from fastapi.security import OAuth2PasswordBearer  
# buat ambil token dari request (Authorization)

from sqlalchemy.orm import Session  
# buat akses database

from app.database import get_db  
# ambil koneksi database

from app.models import User  
# ambil tabel user

load_dotenv()  
# aktifkan file .env

# ================= KONFIG =================

SECRET_KEY = os.getenv("SECRET_KEY")  
# kunci rahasia buat token

ALGORITHM = os.getenv("ALGORITHM", "HS256")  
# cara encode token

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))  
# token berlaku berapa lama

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  
# setup hash password pakai bcrypt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  
# FastAPI akan ambil token dari header Authorization

# ================= PASSWORD =================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)  
    # ubah password jadi kode acak (biar aman)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)  
    # cek password login cocok atau tidak

# ================= TOKEN =================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()  
    # copy data

    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])  
        # pastikan user_id bentuk string

    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )  
    # hitung waktu expired token

    to_encode.update({"exp": expire})  
    # masukkan expired ke token

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  
    # bikin token JWT

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  
        # baca isi token
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau expired",
        )  
        # kalau token salah → error 401

# ================= USER LOGIN =================

def get_current_user(
    token: str = Depends(oauth2_scheme),  
    # ambil token otomatis dari request

    db: Session = Depends(get_db),  
    # ambil database
) -> User:

    payload = decode_token(token)  
    # buka token

    user_id_str = payload.get("sub")  
    # ambil user_id dari token

    if user_id_str is None:
        raise HTTPException(status_code=401, detail="Token tidak valid")  
        # kalau ga ada user_id

    user_id = int(user_id_str)  
    # ubah ke angka

    user = db.query(User).filter(User.id == user_id).first()  
    # cari user di database

    if user is None:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")  

    return user  
    # kirim user ke endpoint