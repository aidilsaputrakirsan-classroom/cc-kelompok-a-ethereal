from sqlalchemy.orm import Session
from models import Task, User
from schemas import TaskCreate, TaskUpdate
from passlib.context import CryptContext

# ==================== PASSWORD CONFIG ====================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# ==================== USER ====================

def create_user(db: Session, user_data):
    # cek apakah email sudah ada
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        return None

    # buat user baru
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user


# ==================== TASK ====================

def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Task).offset(skip).limit(limit).all()


def get_task(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks_by_user(db: Session, user_id: int):
    return db.query(Task).filter(
        (Task.created_by == user_id) | (Task.assigned_to == user_id)
    ).all()


def create_task(db: Session, task: TaskCreate, user_id: int):
    db_task = Task(**task.model_dump(), created_by=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task: TaskUpdate):
    db_task = get_task(db, task_id)
    if not db_task:
        return None

    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if not db_task:
        return None

    db.delete(db_task)
    db.commit()
    return db_task