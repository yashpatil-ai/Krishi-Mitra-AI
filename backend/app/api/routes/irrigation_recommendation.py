from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.irrigation import IrrigationResponse
from app.services.farm_service import get_farm
from app.services.irrigation_service import (
    generate_irrigation_recommendation,
)

router = APIRouter(
    prefix="/farms/{farm_id}/irrigation",
    tags=["Irrigation"],
)


@router.post(
    "/recommend/{crop_id}",
    response_model=IrrigationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def recommend_irrigation(
    farm_id: int,
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = get_farm(db, farm_id, current_user.id)

    if farm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found",
        )

    try:
        return await generate_irrigation_recommendation(
            db=db,
            farm_id=farm_id,
            crop_id=crop_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
