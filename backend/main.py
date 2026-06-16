from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse

from sqlalchemy.orm import Session
from sqlalchemy import text

from database import engine, get_db
from models import Base, User
from schemas import (
    UserCreate,
    UserResponse,
    TaskCreate,
    TaskUpdate,
    TaskResponse
)

from auth import create_access_token, get_current_user
from config import settings

import crud
import httpx

load_dotenv()

# ================= INIT =================

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kelarin API",
    version="1.0.0",
)

# ================= CORS =================

# Domain di bawah ini langsung mencakup lokal development DAN domain produksi Railway kelompokmu
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://kelarin.up.railway.app"  # <-- LANGSUNG DIKUNCI DI SINI UNTUK RAILWAY
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        
    allow_credentials=True,
    allow_methods=["*"],          
    allow_headers=["*"],          
)

# ================= HEALTH =================

@app.get("/health")
def health_check(db: Session = Depends(get_db)):

    health = {
        "status": "healthy",
        "service": "backend",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
    }

    try:
        db.execute(text("SELECT 1"))
        health["database"] = "connected"

    except Exception as e:
        health["status"] = "unhealthy"
        health["database"] = str(e)

    status_code = 200 if health["status"] == "healthy" else 503

    return JSONResponse(
        content=health,
        status_code=status_code
    )

# ================= AUTH =================

@app.post("/auth/register", response_model=UserResponse, status_code=201)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    user = crud.create_user(
        db=db,
        user_data=user_data
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Email sudah terdaftar"
        )

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
        raise HTTPException(
            status_code=401,
            detail="Email atau password salah"
        )

    token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/auth/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user

# ================= TASK =================

@app.post("/tasks", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return crud.create_task(
        db=db,
        task=task,
        user_id=current_user.id
    )

# ================= MICROSERVICE HEALTH =================

@app.get("/auth/health")
async def auth_service_health():

    try:
        async with httpx.AsyncClient() as client:

            response = await client.get(
                "http://localhost:8001/health",
                timeout=5.0
            )

            return response.json()

    except Exception as e:

        raise HTTPException(
            status_code=503,
            detail=f"Auth Service unavailable: {str(e)}"
        )


@app.get("/tasks/health")
async def task_service_health():

    try:
        async with httpx.AsyncClient() as client:

            response = await client.get(
                "http://localhost:8002/health",
                timeout=5.0
            )

            return response.json()

    except Exception as e:

        raise HTTPException(
            status_code=503,
            detail=f"Task Service unavailable: {str(e)}"
        )


@app.get("/tasks/metrics")
async def task_service_metrics():

    try:
        async with httpx.AsyncClient() as client:

            response = await client.get(
                "http://localhost:8002/metrics",
                timeout=5.0
            )

            return response.json()

    except Exception as e:

        raise HTTPException(
            status_code=503,
            detail=f"Metrics Service unavailable: {str(e)}"
        )

@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    category: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if category:
        return crud.get_tasks_by_category(
            db,
            current_user.id,
            category
        )

    return crud.get_tasks_by_user(
        db=db,
        user_id=current_user.id
    )


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    task = crud.get_task(db, task_id)

    if not task or (task.created_by != current_user.id and task.assigned_to != current_user.id):
        raise HTTPException(
            status_code=404,
            detail="Task tidak ditemukan"
        )

    return task


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # Check ownership first
    db_task = crud.get_task(db, task_id)
    if not db_task or db_task.created_by != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Task tidak ditemukan"
        )

    updated = crud.update_task(
        db,
        task_id,
        task
    )

    return updated


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # Check ownership first
    db_task = crud.get_task(db, task_id)
    if not db_task or db_task.created_by != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Task tidak ditemukan"
        )

    deleted = crud.delete_task(db, task_id)

    return None