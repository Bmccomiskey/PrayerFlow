from fastapi import APIRouter
from models import User, UserResponse
from controllers import register_user, login_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user: User):
    """Register a new user"""
    return register_user(user)

@router.post("/login", response_model=UserResponse)
def login(email: str, password: str):
    """Login with email and password"""
    return login_user(email, password)