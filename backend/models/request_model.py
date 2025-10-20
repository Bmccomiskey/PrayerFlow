from pydantic import BaseModel
from typing import Optional

class Todo(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TodoResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: str