from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
import uuid
from models import User, UserResponse
from database import get_db, UserDB
from utils import hash_password, verify_password

def register_user(user: User, db: Session = Depends(get_db)) -> UserResponse:
    """Register a new user"""
    # Check if user exists
    existing_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = db.query(UserDB).filter(UserDB.username == user.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user with hashed password
    user_id = str(uuid.uuid4())
    db_user = UserDB(
        id=user_id,
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return UserResponse(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email
    )

def login_user(email: str, password: str, db: Session = Depends(get_db)) -> UserResponse:
    """Login an existing user"""
    user = db.query(UserDB).filter(UserDB.email == email).first()
    
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email
    )