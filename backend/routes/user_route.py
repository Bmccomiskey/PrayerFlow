from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import User, UserResponse
from controllers import register_user, login_user
from database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user: User, db: Session = Depends(get_db)):
    """Register a new user"""
    return register_user(user, db)

@router.post("/login", response_model=UserResponse)
def login(email: str, password: str, db: Session = Depends(get_db)):
    """Login with email and password"""
    return login_user(email, password, db)