import os  
# buat ambil data dari file .env (misalnya DATABASE_URL)

from dotenv import load_dotenv  
# supaya file .env bisa dibaca oleh Python

from sqlalchemy import create_engine  
# buat koneksi ke database

from sqlalchemy.ext.declarative import declarative_base  
# buat base class untuk semua model (tabel)

from sqlalchemy.orm import sessionmaker  
# buat session (jalan buat ngobrol ke database) pintu masukk

# ================= LOAD ENV =================

load_dotenv()  
# aktifkan file .env supaya bisa dipakai

# ================= DATABASE URL =================

DATABASE_URL = os.getenv("DATABASE_URL")  
# ambil link database dari .env

if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan di .env!")  
    # kalau tidak ada → error (biar ga bingung)

# ================= ENGINE =================

engine = create_engine(DATABASE_URL)  
# bikin koneksi ke database (ibarat jalan ke gudang)

# ================= SESSION =================

SessionLocal = sessionmaker(
    autocommit=False,  # tidak langsung simpan (harus commit dulu)
    autoflush=False,   # tidak otomatis kirim perubahan
    bind=engine        # hubungkan ke database
)
# ini dipakai untuk buka koneksi ke database saat dibutuhkan

# ================= BASE MODEL =================

Base = declarative_base()  
# ini dipakai di models.py
# semua tabel akan turunan dari Base

# ================= GET DB =================

def get_db():
    """
    fungsi ini dipakai FastAPI untuk ambil database
    setiap request akan:
    - buka koneksi
    - pakai
    - lalu ditutup
    """

    db = SessionLocal()  
    # buka koneksi database

    try:
        yield db  
        # kasih database ke endpoint (dipakai di CRUD)

    finally:
        db.close()  
        # setelah selesai → tutup koneksi (biar tidak bocor)