import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
<<<<<<< HEAD
from fastapi import Body
=======
from fastapi.responses import JSONResponse
from sqlalchemy import text
>>>>>>> 4b16ab958e09e02cbcbe328d74605008e3ae8785

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
def health_check(db: Session = Depends(get_db)):
    health = {
        "status": "healthy",
        "service": "backend",
        "version": "1.0.0",
    }

    try:
        db.execute(text("SELECT 1"))
        health["database"] = "connected"
    except Exception as e:
        health["status"] = "unhealthy"
        health["database"] = str(e)

    status_code = 200 if health["status"] == "healthy" else 503
    return JSONResponse(content=health, status_code=status_code)

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

@app.post("/tasks", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
<<<<<<< HEAD
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
=======
    return crud.create_task(db=db, task=task, user_id=current_user.id)
>>>>>>> 4b16ab958e09e02cbcbe328d74605008e3ae8785


@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    category: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if category:
        return crud.get_tasks_by_category(db, current_user.id, category)

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
<<<<<<< HEAD
    task: TaskUpdate = Body(...),
=======
    task: TaskUpdate,
>>>>>>> 4b16ab958e09e02cbcbe328d74605008e3ae8785
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = crud.update_task(db, task_id, task)
<<<<<<< HEAD

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Task tidak ditemukan"
        )

=======
    if not updated:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")
>>>>>>> 4b16ab958e09e02cbcbe328d74605008e3ae8785
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