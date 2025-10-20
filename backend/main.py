from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (use a real database in production)
users_db = {}
todos_db = {}

# Models
class User(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str

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

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}

@app.post("/api/auth/register", response_model=UserResponse)
def register(user: User):
    # Check if user exists
    for u in users_db.values():
        if u["email"] == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    users_db[user_id] = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "password": user.password  # Hash this in production!
    }
    
    return UserResponse(
        id=user_id,
        username=user.username,
        email=user.email
    )

@app.post("/api/auth/login", response_model=UserResponse)
def login(email: str, password: str):
    for user in users_db.values():
        if user["email"] == email and user["password"] == password:
            return UserResponse(
                id=user["id"],
                username=user["username"],
                email=user["email"]
            )
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/todos/{user_id}", response_model=List[TodoResponse])
def get_todos(user_id: str):
    user_todos = [todo for todo in todos_db.values() if todo["user_id"] == user_id]
    return user_todos

@app.post("/api/todos/{user_id}", response_model=TodoResponse)
def create_todo(user_id: str, todo: Todo):
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

@app.put("/api/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: str, todo: Todo):
    if todo_id not in todos_db:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todos_db[todo_id].update({
        "title": todo.title,
        "description": todo.description,
        "completed": todo.completed
    })
    return TodoResponse(**todos_db[todo_id])

@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: str):
    if todo_id not in todos_db:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    del todos_db[todo_id]
    return {"message": "Todo deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)