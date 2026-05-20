import os

from datetime import datetime
from datetime import timedelta
from datetime import timezone

import jwt

from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Header

from fastapi.middleware.cors import CORSMiddleware

from passlib.context import CryptContext

from sqlalchemy.orm import Session

from database import engine
from database import get_db
from database import Base

from models import User

from schemas import UserCreate
from schemas import UserResponse
from schemas import LoginRequest
from schemas import TokenResponse
from schemas import VerifyResponse

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kelarin Auth Service",
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

# ================= SECURITY =================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "dev-secret-key"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "60"
    )
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# ================= JWT =================

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decode_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

# ================= HEALTH =================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "auth-service"
    }

# ================= REGISTER =================

@app.post(
    "/register",
    response_model=UserResponse,
    status_code=201
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=pwd_context.hash(
            user_data.password
        )
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return user

# ================= LOGIN =================

@app.post(
    "/login",
    response_model=TokenResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == login_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not pwd_context.verify(
        login_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "name": user.name
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# ================= VERIFY =================

@app.get(
    "/verify",
    response_model=VerifyResponse
)
def verify_token(
    authorization: str = Header(...)
):

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.split(
        "Bearer "
    )[1]

    payload = decode_token(token)

    return {
        "user_id": int(payload["sub"]),
        "email": payload["email"],
        "name": payload["name"]
    }