from fastapi import HTTPException
from datetime import datetime
import uuid
from typing import List
from models import Todo, TodoResponse
from database import get_users_db, get_todos_db

def get_user_todos(user_id: str) -> List[TodoResponse]:
    """Get all todos for a specific user"""
    todos_db = get_todos_db()
    user_todos = [todo for todo in todos_db.values() if todo["user_id"] == user_id]
    return user_todos

def create_user_todo(user_id: str, todo: Todo) -> TodoResponse:
    """Create a new todo for a user"""
    users_db = get_users_db()
    todos_db = get_todos_db()
    
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    todo_id = str(uuid.uuid4())
    new_todo = {
        "id": todo_id,
        "title": todo.title,
        "description": todo.description,
        "completed": todo.completed,
        "user_id": user_id,
        "created_at": datetime.now().isoformat()
    }
    todos_db[todo_id] = new_todo
    return TodoResponse(**new_todo)

def update_user_todo(todo_id: str, todo: Todo) -> TodoResponse:
    """Update an existing todo"""
    todos_db = get_todos_db()
    
    if todo_id not in todos_db:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todos_db[todo_id].update({
        "title": todo.title,
        "description": todo.description,
        "completed": todo.completed
    })
    return TodoResponse(**todos_db[todo_id])

def delete_user_todo(todo_id: str) -> dict:
    """Delete a todo"""
    todos_db = get_todos_db()
    
    if todo_id not in todos_db:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    del todos_db[todo_id]
    return {"message": "Todo deleted successfully"}