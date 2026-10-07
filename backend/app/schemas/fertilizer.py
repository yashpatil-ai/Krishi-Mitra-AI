from pydantic import BaseModel, Field


class FertilizerRecommendationRequest(BaseModel):
    crop: str = Field(min_length=1)
    nitrogen: float = Field(ge=0)
    phosphorus: float = Field(ge=0)
    potassium: float = Field(ge=0)
    ph: float = Field(ge=0, le=14)


class FertilizerRecommendationResponse(BaseModel):
    crop: str
    nitrogen_required: float
    phosphorus_required: float
    potassium_required: float
    nitrogen_status: str
    phosphorus_status: str
    potassium_status: str
    ph_status: str
    recommendations: list[str]
