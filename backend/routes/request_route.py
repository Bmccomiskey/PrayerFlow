from fastapi import APIRouter
from typing import List
from models import Todo, TodoResponse
from controllers import (
    get_user_todos,
    create_user_todo,
    update_user_todo,
    delete_user_todo
)

router = APIRouter(prefix="/api/todos", tags=["Todos"])

@router.get("/{user_id}", response_model=List[TodoResponse])
def get_todos(user_id: str):
    """Get all todos for a user"""
    return get_user_todos(user_id)

@router.post("/{user_id}", response_model=TodoResponse)
def create_todo(user_id: str, todo: Todo):
    """Create a new todo for a user"""
    return create_user_todo(user_id, todo)

@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: str, todo: Todo):
    """Update an existing todo"""
    return update_user_todo(todo_id, todo)

@router.delete("/{todo_id}")
def delete_todo(todo_id: str):
    """Delete a todo"""
    return delete_user_todo(todo_id)