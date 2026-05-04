import os  
# buat ambil data dari .env

from dotenv import load_dotenv  
# biar file .env bisa dipakai

from fastapi import FastAPI, Depends, HTTPException  
# FastAPI = bikin API
# Depends = ambil data otomatis (db, user)
# HTTPException = error response

from fastapi.middleware.cors import CORSMiddleware  
# supaya frontend bisa akses backend

from sqlalchemy.orm import Session  
# buat koneksi database

from fastapi.security import OAuth2PasswordRequestForm  
# 🔥 penting buat login (Swagger pakai username & password form)

from database import engine, get_db  
# engine = koneksi database
# get_db = ambil database

from models import Base, User  
# Base = semua tabel
# User = tabel user

from schemas import (
    UserCreate, UserResponse,
    TaskCreate, TaskUpdate, TaskResponse
)
# schema = format data (input & output)

from auth import create_access_token, get_current_user  
# create_access_token = buat token
# get_current_user = ambil user dari token

import crud  
# semua logic database ada di sini

load_dotenv()  
# aktifkan .env

# ================= INIT =================

Base.metadata.create_all(bind=engine)  
# bikin tabel di database kalau belum ada

app = FastAPI(
    title="Kelarin API",
    version="1.0.0",
)
# bikin aplikasi FastAPI

# ================= CORS =================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # semua boleh akses (sementara)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# supaya frontend bisa request ke backend

# ================= HEALTH =================

@app.get("/health")
def health_check():
    return {"status": "healthy"}  
    # cek apakah server hidup

# ================= AUTH =================

@app.post("/auth/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # buat user baru
    user = crud.create_user(db=db, user_data=user_data)

    if not user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    return user


# 🔥 LOGIN (pakai form, bukan JSON)
@app.post("/auth/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),  
    # ambil username & password dari form (Swagger)

    db: Session = Depends(get_db)
):
    user = crud.authenticate_user(
        db,
        form_data.username,  # email dikirim sebagai "username"
        form_data.password
    )

    if not user:
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = create_access_token(data={"sub": str(user.id)})  
    # bikin JWT token

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    # ambil data user yang sedang login (pakai token)
    return current_user


# ================= TASK =================

@app.post("/tasks", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  
    # harus login dulu
):
    return crud.create_task(db=db, task=task, user_id=current_user.id)


@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ambil task milik user
    return crud.get_tasks_by_user(db=db, user_id=current_user.id)


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = crud.get_task(db, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")

    return task


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = crud.update_task(db, task_id, task)

    if not updated:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")

    return updated


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = crud.delete_task(db, task_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")

    return None  # tidak ada response (204)