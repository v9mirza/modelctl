from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict
from core.ollama import AsyncOllamaClient

router = APIRouter()

class ChatRequest(BaseModel):
    model: str
    messages: List[Dict[str, str]]

@router.post("/chat")
async def chat(request: ChatRequest):
    client = AsyncOllamaClient()
    return StreamingResponse(
        client.chat(model=request.model, messages=request.messages),
        media_type="application/x-ndjson"
    )
