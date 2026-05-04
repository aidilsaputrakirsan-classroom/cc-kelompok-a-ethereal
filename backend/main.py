import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from database import engine, get_db
from models import Base, User
from schemas import (
    UserCreate, UserResponse,
    TaskCreate, TaskUpdate, TaskResponse
)
from auth import create_access_token, get_current_user
import crud

load_dotenv()

# ================= INIT =================

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kelarin API",
    version="1.0.0",
)

# ================= CORS (FIX ERROR FETCH) =================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # 🔥 WAJIB untuk Vite
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= FILE STORAGE =================

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ================= HEALTH =================

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# ================= AUTH =================

@app.post("/auth/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = crud.create_user(db=db, user_data=user_data)
    if not user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    return user


@app.post("/auth/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = crud.authenticate_user(
        db,
        form_data.username,
        form_data.password
    )

    if not user:
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
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
    file_path = None

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

    updated = crud.update_task(db, task_id, task_data)
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
    return None