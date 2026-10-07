from pydantic import BaseModel, Field


class DiseaseDetectionResponse(BaseModel):
    disease: str
    confidence: float = Field(ge=0, le=1)
