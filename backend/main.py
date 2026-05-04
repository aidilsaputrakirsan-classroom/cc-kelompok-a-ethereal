import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm  # 🔥 penting

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

# ================= CORS (FIX ERROR FETCH) =================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


# 🔥 LOGIN FIX (OAuth2 compatible Swagger)
@app.post("/auth/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),  
    # ambil username & password dari form (Swagger)

    db: Session = Depends(get_db)
):
    user = crud.authenticate_user(
        db,
        form_data.username,  # Swagger kirim "username"
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

# 🔥 CREATE TASK + FILE UPLOAD
@app.post("/tasks", response_model=TaskResponse)
async def create_task(
    title: str = Form(...),
    description: str = Form(...),
    deadline: str = Form(...),
    file: UploadFile = File(None),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  
    # harus login dulu
):
    file_path = None

    # 👉 kalau ada file
    if file:
        file_location = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
        file_path = file_location

    task_data = {
        "title": title,
        "description": description,
        "deadline": deadline,
        "file_path": file_path
    }

    task_obj = TaskCreate(
    title=title,
    description=description,
    deadline=deadline
)

return crud.create_task(db=db, task=task_obj, user_id=current_user.id)


# 🔥 GET TASKS
@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ambil task milik user
    return crud.get_tasks_by_user(db=db, user_id=current_user.id)


# 🔥 GET DETAIL
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


# 🔥 UPDATE TASK + FILE
@app.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    title: str = Form(...),
    description: str = Form(...),
    deadline: str = Form(...),
    file: UploadFile = File(None),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = crud.update_task(db, task_id, task)
    if not updated:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")

    return updated


# 🔥 DELETE TASK
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