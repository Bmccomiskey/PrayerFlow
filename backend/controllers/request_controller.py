from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from typing import List
from models import Todo, TodoResponse
from database import get_db, UserDB, TodoDB

def get_user_todos(user_id: str, db: Session = Depends(get_db)) -> List[TodoResponse]:
    """Get all todos for a specific user"""
    todos = db.query(TodoDB).filter(TodoDB.user_id == user_id).all()
    
    return [
        TodoResponse(
            id=todo.id,
            title=todo.title,
            description=todo.description,
            completed=todo.completed,
            user_id=todo.user_id,
            created_at=todo.created_at.isoformat()
        )
        for todo in todos
    ]

def create_user_todo(user_id: str, todo: Todo, db: Session = Depends(get_db)) -> TodoResponse:
    """Create a new todo for a user"""
    # Check if user exists
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create new todo
    todo_id = str(uuid.uuid4())
    db_todo = TodoDB(
        id=todo_id,
        title=todo.title,
        description=todo.description,
        completed=todo.completed,
        user_id=user_id
    )
    
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    
    return TodoResponse(
        id=db_todo.id,
        title=db_todo.title,
        description=db_todo.description,
        completed=db_todo.completed,
        user_id=db_todo.user_id,
        created_at=db_todo.created_at.isoformat()
    )

def update_user_todo(todo_id: str, todo: Todo, db: Session = Depends(get_db)) -> TodoResponse:
    """Update an existing todo"""
    db_todo = db.query(TodoDB).filter(TodoDB.id == todo_id).first()
    
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Update fields
    db_todo.title = todo.title
    db_todo.description = todo.description
    db_todo.completed = todo.completed
    
    db.commit()
    db.refresh(db_todo)
    
    return TodoResponse(
        id=db_todo.id,
        title=db_todo.title,
        description=db_todo.description,
        completed=db_todo.completed,
        user_id=db_todo.user_id,
        created_at=db_todo.created_at.isoformat()
    )

def delete_user_todo(todo_id: str, db: Session = Depends(get_db)) -> dict:
    """Delete a todo"""
    db_todo = db.query(TodoDB).filter(TodoDB.id == todo_id).first()
    
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(db_todo)
    db.commit()
    
    return {"message": "Todo deleted successfully"}