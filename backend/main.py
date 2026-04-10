import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from database import engine, get_db
from models import Base, User
from schemas import (
    ItemCreate, ItemUpdate, ItemResponse, ItemListResponse,
    UserCreate, UserResponse
)
from auth import create_access_token, get_current_user
import crud

load_dotenv()

# ==================== INIT ====================

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kelarin API",
    description="REST API untuk aplikasi manajemen tugas Kelarin",
    version="1.0.0",
)

# ==================== CORS (FIX TOTAL) ====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 sementara bebas biar gak error
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== HEALTH ====================

@app.get("/health")
def health_check():
    return {"status": "healthy", "app": "Kelarin"}

# ==================== AUTH ====================

@app.post("/auth/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = crud.create_user(db=db, user_data=user_data)
    if not user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    return user


@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password
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


# ==================== TASKS (RENAME DARI ITEMS) ====================

@app.post("/tasks", response_model=ItemResponse, status_code=201)
def create_task(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.create_item(db=db, item_data=item)


@app.get("/tasks", response_model=ItemListResponse)
def list_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.get_items(db=db, skip=skip, limit=limit, search=search)


@app.get("/tasks/{task_id}", response_model=ItemResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = crud.get_item(db=db, item_id=task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")
    return task


@app.put("/tasks/{task_id}", response_model=ItemResponse)
def update_task(
    task_id: int,
    item: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = crud.update_item(db=db, item_id=task_id, item_data=item)
    if not updated:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")
    return updated


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = crud.delete_item(db=db, item_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")
    return None


# ==================== TEAM ====================

@app.get("/team")
def team_info():
    return {
        "team": "cloud-team-Ethereal",
        "members": [
            {"name": "Amazia Devid Saputra", "nim": "10231013", "role": "Frontend"},
            {"name": "Alsha Dwi Cahya", "nim": "10231011", "role": "DevOps"},
            {"name": "Andini Permata Sari", "nim": "10231015", "role": "QA & Docs"},
            {"name": "Ansellma Tita Pakartiwuri P", "nim": "10231017", "role": "CI/CD"},
            {"name": "Tiya Mitra Ayu", "nim": "10231088", "role": "Backend"},
        ],
    }