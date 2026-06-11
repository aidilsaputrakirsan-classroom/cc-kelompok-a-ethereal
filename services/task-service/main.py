import os
import logging

import httpx

from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from database import Base
from database import engine
from database import get_db

from models import Task

from schemas import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskStatsResponse
)

from auth_client import get_current_user

from logging_config import setup_logging
from logging_middleware import RequestLoggingMiddleware

from metrics import (
    get_metrics,
    record_error,
    check_error_alert
)

logger = logging.getLogger(__name__)

load_dotenv()

Base.metadata.create_all(bind=engine)

setup_logging()

app = FastAPI(
    title="Kelarin Task Service",
    version="1.0.0"
)

app.add_middleware(RequestLoggingMiddleware)

# ================= CORS =================

# Domain di bawah ini mencakup lokal development DAN domain produksi Railway kelompokmu
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://kelarin.up.railway.app"  # <-- LANGSUNG DIKUNCI DI SINI UNTUK PRODUCTION RAILWAY
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
async def health_check():

    auth_status = "healthy"
    
    # Ambil base URL auth-service dari docker-compose. 
    # Jika tidak diset, gunakan default internal docker network 'http://auth-service:8001'
    auth_base_url = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")
    
    # Bersihkan sisa trailing slash jika ada, lalu arahkan pas ke endpoint /health
    auth_health_url = f"{auth_base_url.rstrip('/')}/health"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                auth_health_url,
                timeout=3.0
            )

            if response.status_code != 200:
                auth_status = "unhealthy"

    except Exception:
        auth_status = "unhealthy"

    overall_status = (
        "healthy"
        if auth_status == "healthy"
        else "degraded"
    )

    return {
        "status": overall_status,
        "service": "task-service",
        "dependencies": {
            "auth-service": auth_status
        }
    }
@app.get("/metrics")
async def metrics():

    return get_metrics()

# ================= CREATE TASK =================

@app.post(
    "/tasks",
    response_model=TaskResponse,
    status_code=201
)
async def create_task(
    task_data: TaskCreate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = Task(
        title=task_data.title,
        description=task_data.description,
        category=task_data.category,
        attachment_url=task_data.attachment_url,
        owner_id=user["user_id"]
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task

# ================= GET TASKS =================
@app.get(
    "/tasks/{task_id}",
    response_model=TaskResponse
)
async def get_task(
    task_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == user["user_id"]
    ).first()

    if not task:

        record_error()
        check_error_alert()

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task
# ================= PUBLIC TASKS =================

@app.get(
    "/tasks/public",
    response_model=list[TaskResponse]
)
async def get_public_tasks(
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).all()

    return tasks


# ================= GET TASK DETAIL =================

@app.get(
    "/tasks/{task_id}",
    response_model=TaskResponse
)
async def get_task(
    task_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == user["user_id"]
    ).first()

    

    return task

# ================= UPDATE TASK =================

@app.put(
    "/tasks/{task_id}",
    response_model=TaskResponse
)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == user["user_id"]
    ).first()

    if not task:

        record_error()
        check_error_alert()

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    for key, value in task_data.dict(
        exclude_unset=True
    ).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return task

# ================= DELETE TASK =================

@app.delete("/tasks/{task_id}")
async def delete_task(
    task_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == user["user_id"]
    ).first()

    if not task:

        record_error()
        check_error_alert()

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted"
    }


# ================= TASK STATS =================

@app.get(
    "/tasks/stats",
    response_model=TaskStatsResponse
)
async def task_stats(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).filter(
        Task.owner_id == user["user_id"]
    ).all()

    total_tasks = len(tasks)

    completed_tasks = len([
        task for task in tasks
        if task.completed
    ])

    pending_tasks = total_tasks - completed_tasks

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks
    }