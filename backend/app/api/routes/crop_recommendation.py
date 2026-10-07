from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.ml.crop_recommendation import crop_recommendation_model
from app.schemas.crop_recommendation import (
    CropRecommendationRequest,
    CropRecommendationResponse,
)


router = APIRouter(prefix="/crop-recommendation", tags=["Crop Recommendation"])


@router.post(
    "/predict",
    response_model=CropRecommendationResponse,
)
def predict_crop(
    request: CropRecommendationRequest,
    current_user=Depends(get_current_user),
):
    recommended_crop = crop_recommendation_model.predict(
        nitrogen=request.nitrogen,
        phosphorus=request.phosphorus,
        potassium=request.potassium,
        temperature=request.temperature,
        humidity=request.humidity,
        ph=request.ph,
        rainfall=request.rainfall,
    )

    return CropRecommendationResponse(
        recommended_crop=recommended_crop
    )
