import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm  # 🔥 penting

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

# ================= CORS =================

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

# ================= AUTH =================

@app.post("/auth/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = crud.create_user(db=db, user_data=user_data)
    if not user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    return user


# 🔥 LOGIN FIX (OAuth2 compatible Swagger)
@app.post("/auth/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
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

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ================= TASK =================

@app.post("/tasks", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.create_task(db=db, task=task, user_id=current_user.id)


@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
    return None