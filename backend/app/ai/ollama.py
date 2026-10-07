import httpx
from app.core.config import settings

OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama3.1:8b"


class OllamaError(Exception):
    """Raised when the Ollama service returns an error."""


async def generate_response(prompt: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                },
            )

        if response.status_code != 200:
            raise OllamaError(
                f"Ollama returned status {response.status_code}"
            )

        data = response.json()
        return str(data.get("response", "")).strip()

    except httpx.HTTPError as exc:
        raise OllamaError(
            f"Failed to connect to Ollama: {exc}"
        ) from exc
