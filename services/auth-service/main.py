import os
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import jwt


from database import engine, get_db, Base
from models import User
from schemas import (
    UserCreate,
    UserResponse,
    LoginRequest,
    TokenResponse,
    VerifyResponse,
    UpgradeRoleRequest,
    UserUpdateAdmin
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Auth Service",
    description="Authentication microservice — register, login, verify tokens",
    version="2.0.0",
)

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

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT config
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = int(os.getenv("TOKEN_EXPIRE_MINUTES", "30"))


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.split("Bearer ")[1]

    payload = decode_token(token)

    return payload

# =====================
# ENDPOINTS
# =====================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "auth-service",
        "version": "2.0.0",
    }

@app.post("/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register user baru."""
    # Check duplicate email
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=pwd_context.hash(user_data.password),
        role=user_data.role or "member",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Support JSON for login
@app.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login user dan return JWT token."""
    email = login_data.email
    password = login_data.password

    if not email or not password:
        raise HTTPException(
            status_code=422,
            detail="Email and password are required"
        )

    user = db.query(User).filter(User.email == email).first()

    if not user or not pwd_context.verify(password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Email atau password salah"
        )

    token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role,
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer"
    )

@app.get("/verify", response_model=VerifyResponse)
def verify_token(authorization: str = Header(...)):
    """
    Verifikasi JWT token — dipanggil oleh service lain.
    Service lain mengirim header:
    Authorization: Bearer <token>
    """

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.split("Bearer ")[1]

    payload = decode_token(token)

    return VerifyResponse(
        user_id=int(payload["sub"]),
        email=payload["email"],
        name=payload["name"],
        role=payload.get("role", "member"),
    )

@app.patch("/users/{user_id}/upgrade-role")
def upgrade_user_role(
    user_id: int,
    role_request: UpgradeRoleRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upgrade user role — only admin can do this."""
    
    if not current_user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )

    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can upgrade user roles"
        )

    new_role = role_request.new_role
    
    if new_role not in ["admin", "member"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Must be 'admin' or 'member'"
        )

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.role = new_role

    db.commit()
    db.refresh(user)

    return {
        "message": f"User role successfully updated to {new_role}",
        "user_id": user.id,
        "role": user.role
    }


@app.get("/users", response_model=list[UserResponse])
def get_all_users(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all users — admin only."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Hanya administrator yang dapat melihat daftar pengguna."
        )
    users = db.query(User).all()
    return users


@app.put("/users/{user_id}", response_model=UserResponse)
def update_user_by_admin(
    user_id: int,
    update_data: UserUpdateAdmin,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user details by admin (name, role, password)."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Hanya administrator yang dapat mengubah data pengguna."
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Pengguna tidak ditemukan."
        )
    
    if update_data.name is not None:
        user.name = update_data.name
    
    if update_data.role is not None:
        if update_data.role not in ["admin", "member"]:
            raise HTTPException(
                status_code=400,
                detail="Peran tidak valid. Harus 'admin' atau 'member'."
            )
        user.role = update_data.role
    
    if update_data.password is not None:
        if len(update_data.password) < 8:
            raise HTTPException(
                status_code=400,
                detail="Kata sandi minimal harus 8 karakter."
            )
        user.hashed_password = pwd_context.hash(update_data.password)
    
    db.commit()
    db.refresh(user)
    return user