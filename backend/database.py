# In-memory storage (replace with real database in production)
users_db = {}
todos_db = {}

def get_users_db():
    return users_db

def get_todos_db():
    return todos_db