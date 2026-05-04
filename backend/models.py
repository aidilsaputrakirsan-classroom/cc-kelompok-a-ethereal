from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Enum, ForeignKey  
# Column = kolom di tabel
# Integer, String, dll = tipe data
# ForeignKey = relasi antar tabel

from sqlalchemy.sql import func  
# buat waktu otomatis (created_at)

from sqlalchemy.orm import relationship  
# buat hubungan antar tabel

from database import Base  
# Base = dasar semua tabel

import enum  
# buat enum (pilihan tetap)

# ================= USER =================

class User(Base):
    __tablename__ = "users"  
    # nama tabel di database

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  
    # id user (unik)

    email = Column(String(255), unique=True, nullable=False, index=True)  
    # email (harus unik & tidak boleh kosong)

    name = Column(String(100), nullable=False)  
    # nama user

    hashed_password = Column(String(255), nullable=False)  
    # password yang sudah di-hash (bukan asli)

    is_active = Column(Boolean, default=True)  
    # status user (aktif / tidak)

    created_at = Column(DateTime(timezone=True), server_default=func.now())  
    # waktu user dibuat otomatis


# ================= TASK =================

class TaskStatus(str, enum.Enum):
    todo = "todo"  
    # belum dikerjakan

    in_progress = "in_progress"  
    # sedang dikerjakan

    done = "done"  
    # sudah selesai


class Task(Base):
    __tablename__ = "tasks"  
    # nama tabel task

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  
    # id task

    title = Column(String(200), nullable=False, index=True)  
    # judul task

    description = Column(Text, nullable=True)  
    # deskripsi (boleh kosong)

    status = Column(Enum(TaskStatus), default=TaskStatus.todo, nullable=False)  
    # status task (todo / progress / done)

    deadline = Column(DateTime(timezone=True), nullable=True)  
    # deadline (boleh kosong)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)  
    # siapa yang buat task (relasi ke user)

    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)  
    # task ditugaskan ke siapa (boleh kosong)

    created_at = Column(DateTime(timezone=True), server_default=func.now())  
    # waktu dibuat otomatis

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  
    # waktu update otomatis

    # relasi ke tabel user
    creator = relationship("User", foreign_keys=[created_by])  
    # user yang membuat task

    assignee = relationship("User", foreign_keys=[assigned_to])  
    # user yang ditugaskan