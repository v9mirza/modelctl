import httpx
import json
from typing import AsyncGenerator, Dict, List, Any

class AsyncOllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.timeout = httpx.Timeout(timeout=60.0, connect=10.0)

    async def get_tags(self) -> Dict[str, Any]:
        """Fetch available models from Ollama."""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout) as client:
            response = await client.get("/api/tags")
            response.raise_for_status()
            return response.json()

    async def chat(
        self, 
        model: str, 
        messages: List[Dict[str, str]], 
        stream: bool = True
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat responses from Ollama token-by-token.
        Yields raw bytes/strings as received from the stream.
        """
        payload = {
            "model": model,
            "messages": messages,
            "stream": stream
        }
        
        async with httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout) as client:
            async with client.stream("POST", "/api/chat", json=payload) as response:
                response.raise_for_status()
                async for chunk in response.aiter_text():
                    yield chunk
