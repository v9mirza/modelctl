from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import models, chat

app = FastAPI(title="modelctl backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(models.router, prefix="/api", tags=["models"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
