from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.farm import Farm
from app.models.user import User
from app.schemas.crop import CropCreate, CropResponse, CropUpdate
from app.services.crop_service import (
    create_crop,
    delete_crop,
    get_crop,
    get_crops,
    update_crop,
)

router = APIRouter(
    prefix="/farms/{farm_id}/crops",
    tags=["Crops"],
)


def get_user_farm(
    farm_id: int,
    db: Session,
    current_user: User,
) -> Farm:
    farm = db.query(Farm).filter(
        Farm.id == farm_id,
        Farm.user_id == current_user.id,
    ).first()

    if farm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found",
        )

    return farm


@router.get(
    "",
    response_model=list[CropResponse],
)
def list_crops(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(farm_id, db, current_user)

    return get_crops(db, farm_id)


@router.get(
    "/{crop_id}",
    response_model=CropResponse,
)
def read_crop(
    farm_id: int,
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(farm_id, db, current_user)

    crop = get_crop(db, crop_id, farm_id)

    if crop is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found",
        )

    return crop


@router.post(
    "",
    response_model=CropResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_crop(
    farm_id: int,
    crop_data: CropCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(farm_id, db, current_user)

    return create_crop(
        db,
        crop_data,
        farm_id,
    )


@router.put(
    "/{crop_id}",
    response_model=CropResponse,
)
def update_existing_crop(
    farm_id: int,
    crop_id: int,
    crop_data: CropUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(farm_id, db, current_user)

    crop = get_crop(db, crop_id, farm_id)

    if crop is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found",
        )

    return update_crop(
        db,
        crop,
        crop_data,
    )


@router.delete(
    "/{crop_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_crop(
    farm_id: int,
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(farm_id, db, current_user)

    crop = get_crop(db, crop_id, farm_id)

    if crop is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found",
        )

    delete_crop(db, crop)