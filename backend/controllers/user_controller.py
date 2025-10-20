from fastapi import HTTPException
import uuid
from models import User, UserResponse
from database import get_users_db

def register_user(user: User) -> UserResponse:
    """Register a new user"""
    users_db = get_users_db()
    
    # Check if user exists
    for u in users_db.values():
        if u["email"] == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    users_db[user_id] = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "password": user.password  # Hash this in production with bcrypt!
    }
    
    return UserResponse(
        id=user_id,
        username=user.username,
        email=user.email
    )

def login_user(email: str, password: str) -> UserResponse:
    """Login an existing user"""
    users_db = get_users_db()
    
    for user in users_db.values():
        if user["email"] == email and user["password"] == password:
            return UserResponse(
                id=user["id"],
                username=user["username"],
                email=user["email"]
            )
    raise HTTPException(status_code=401, detail="Invalid credentials")