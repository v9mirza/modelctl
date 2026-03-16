from fastapi import APIRouter, HTTPException
from core.ollama import AsyncOllamaClient

router = APIRouter()

@router.get("/models")
async def list_models():
    client = AsyncOllamaClient()
    try:
        return await client.get_tags()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch models from Ollama: {str(e)}")
