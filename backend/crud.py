from sqlalchemy.orm import Session  # buat koneksi ke database
from models import Task, User  # ambil tabel Task & User
from schemas import TaskCreate, TaskUpdate  # format data task
from passlib.context import CryptContext  # buat hash password

# ==================== PASSWORD CONFIG ====================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  
# setup hashing password pakai bcrypt (biar aman)

def hash_password(password: str):
    return pwd_context.hash(password)  
    # ubah password jadi kode acak (biar ga disimpan asli)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)  
    # cek password login cocok atau tidak


# ==================== USER ====================

def create_user(db: Session, user_data):
    # cek apakah email sudah dipakai
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        return None  
        # kalau sudah ada → tidak boleh register

    # buat user baru
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)  # password langsung di-hash
    )

    db.add(new_user)      # masukkan ke database
    db.commit()           # simpan perubahan
    db.refresh(new_user)  # ambil data terbaru

    return new_user  # kirim user yang sudah dibuat


def authenticate_user(db: Session, email: str, password: str):
    # cari user berdasarkan email
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None  # kalau tidak ditemukan

    # cek password cocok atau tidak
    if not verify_password(password, user.hashed_password):
        return None

    return user  # kalau benar → login berhasil


# ==================== TASK ====================

def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    # ambil semua task (bisa di skip & limit)
    return db.query(Task).offset(skip).limit(limit).all()


def get_task(db: Session, task_id: int):
    # ambil 1 task berdasarkan ID
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks_by_user(db: Session, user_id: int):

    return db.query(Task).filter(
        ((Task.created_by == user_id) | (Task.assigned_to == user_id)) &
        (Task.status != "done")
    ).all()

def get_tasks_by_category(db: Session, user_id: int, category: str):
    return db.query(Task).filter(
        ((Task.created_by == user_id) | (Task.assigned_to == user_id)) &
        (Task.category == category)
    ).all()

def create_task(db: Session, task: TaskCreate, user_id: int):
    # buat task baru dari data yang dikirim
    db_task = Task(**task.model_dump(), created_by=user_id)

    db.add(db_task)      # simpan ke database
    db.commit()          # commit perubahan
    db.refresh(db_task)  # ambil data terbaru

    return db_task  # kirim task yang sudah dibuat


def update_task(db: Session, task_id: int, task: TaskUpdate):
    # ambil task berdasarkan ID
    db_task = get_task(db, task_id)

    if not db_task:
        return None  # kalau task tidak ada

    # update hanya field yang dikirim (tidak semua)
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)

    db.commit()          # simpan perubahan
    db.refresh(db_task)  # ambil data terbaru

    return db_task


def delete_task(db: Session, task_id: int):
    # ambil task
    db_task = get_task(db, task_id)

    if not db_task:
        return None  # kalau tidak ada

    db.delete(db_task)  # hapus dari database
    db.commit()         # simpan perubahan

    return db_task