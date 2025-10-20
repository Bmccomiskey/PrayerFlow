from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user_router, todo_router

app = FastAPI(title="PrayerFlow API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router)
app.include_router(todo_router)

# Root route
@app.get("/")
def read_root():
    return {
        "message": "Welcome to PrayerFlow API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)