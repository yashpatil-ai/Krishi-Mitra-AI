from pydantic import BaseModel, Field


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)
    context: str | None = Field(default=None, max_length=10000)


class AIChatResponse(BaseModel):
    response: str
