from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from PIL import Image
from io import BytesIO

from app.core.dependencies import get_current_user
from app.schemas.disease_detection import DiseaseDetectionResponse
from app.ml.disease_detection import disease_detection_model

router = APIRouter(
    prefix="/disease-detection",
    tags=["Disease Detection"],
)


@router.post(
    "/predict",
    response_model=DiseaseDetectionResponse,
)
async def predict_disease(
    image: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must be an image",
        )

    contents = await image.read()

    try:
        pil_image = Image.open(BytesIO(contents))
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid image file",
        )

    result = disease_detection_model.predict(pil_image)

    return result
