from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_current_user
from app.ml.fertilizer import fertilizer_engine
from app.schemas.fertilizer import (
    FertilizerRecommendationRequest,
    FertilizerRecommendationResponse,
)


router = APIRouter(prefix="/fertilizer", tags=["Fertilizer"])


@router.post(
    "/recommend",
    response_model=FertilizerRecommendationResponse,
)
def recommend_fertilizer(
    request: FertilizerRecommendationRequest,
    current_user=Depends(get_current_user),
):
    try:
        result = fertilizer_engine.recommend(
            crop=request.crop,
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            ph=request.ph,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    return FertilizerRecommendationResponse(**result)
