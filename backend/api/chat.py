from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict
from backend.core.ollama import AsyncOllamaClient

router = APIRouter()

class ChatRequest(BaseModel):
    model: str
    messages: List[Dict[str, str]]

@router.post("/chat")
async def chat(request: ChatRequest):
    client = AsyncOllamaClient()
    
    # Create the generator for streaming response
    # output includes logic to handle potential errors during stream setup if needed, 
    # but for now we rely on exceptions bubbling up or being handled in the gen.
    
    return StreamingResponse(
        client.chat(model=request.model, messages=request.messages),
        media_type="application/x-ndjson"
    )
