import os
import httpx

from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from database import Base
from database import engine
from database import get_db

from models import Task

from schemas import TaskCreate
from schemas import TaskUpdate
from schemas import TaskResponse
from schemas import TaskStatsResponse

from auth_client import get_current_user

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kelarin Task Service",
    version="1.0.0"
)

# ================= CORS =================

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= HEALTH =================

@app.get("/health")
async def health_check():

    auth_status = "healthy"

    try:

        async with httpx.AsyncClient() as client:

            response = await client.get(
                "http://localhost:8001/health",
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
    "/tasks",
    response_model=list[TaskResponse]
)
async def get_tasks(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).filter(
        Task.owner_id == user["user_id"]
    ).all()

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