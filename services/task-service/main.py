import os
import logging
from contextlib import asynccontextmanager

import httpx

from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from database import Base, engine, get_db, run_migrations
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
from metrics import get_metrics, record_error, check_error_alert

logger = logging.getLogger(__name__)
load_dotenv()
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB
    logger.info("Initializing database...")
    try:
        Base.metadata.create_all(bind=engine)
        run_migrations()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    yield
    # Shutdown logic (if any) can go here

app = FastAPI(
    title="Kelarin Task Service",
    version="1.0.0",
    lifespan=lifespan
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error handler caught: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"}
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
    # Jika tidak diset, gunakan default internal docker network 'http://localhost:8001'
    auth_base_url = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")

    # Bersihkan sisa trailing slash jika ada, lalu arahkan pas ke endpoint /health
    auth_health_url = f"{auth_base_url.rstrip('/')}/health"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                auth_health_url,
                timeout=1.0
            )

            if response.status_code != 200:
                auth_status = "unhealthy"

    except Exception:
        auth_status = "unreachable"

    # Overall status reflects only this service's own health.
    # AUTH-SERVICE reachability is reported separately for monitoring
    # purposes but does not affect the top-level status field.
    return {
        "status": "healthy",
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
        deadline=task_data.deadline,
        owner_id=user["user_id"]
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task

# ================= GET ALL USER TASKS =================
@app.get(
    "/tasks",
    response_model=list[TaskResponse]
)
async def get_tasks(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = user["user_id"]
    tasks = db.query(Task).filter(
        ((Task.owner_id == user_id) | (Task.assigned_to == user_id)) &
        (Task.completed.is_(False))
    ).all()

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
