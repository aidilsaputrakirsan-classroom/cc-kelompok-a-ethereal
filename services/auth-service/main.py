import os
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Depends, HTTPException, Header, Request
from fastapi.security import OAuth2PasswordRequestForm
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
    VerifyResponse
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
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Support both JSON and Form Data for login
@app.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    db: Session = Depends(get_db)
):
    content_type = request.headers.get("content-type", "")
    email = None
    password = None

    if "application/json" in content_type:
        try:
            data = await request.json()
            email = data.get("email") or data.get("username")
            password = data.get("password")
        except:
            raise HTTPException(status_code=422, detail="Invalid JSON")
    else:
        # Fallback to Form Data
        try:
            form = await request.form()
            email = form.get("username") or form.get("email")
            password = form.get("password")
        except:
            raise HTTPException(status_code=422, detail="Invalid Form Data")

    if not email or not password:
        raise HTTPException(
            status_code=422,
            detail="Email/username and password are required"
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
    })

    return TokenResponse(access_token=token)

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
    )