from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.farm import FarmCreate, FarmResponse, FarmUpdate
from app.services.farm_service import (
    create_farm,
    delete_farm,
    get_farm,
    get_farms,
    update_farm,
)

router = APIRouter(
    prefix="/farms",
    tags=["Farms"],
)


@router.get(
    "",
    response_model=list[FarmResponse],
)
def list_farms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_farms(db, current_user.id)


@router.get(
    "/{farm_id}",
    response_model=FarmResponse,
)
def read_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = get_farm(db, farm_id, current_user.id)

    if farm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found",
        )

    return farm


@router.post(
    "",
    response_model=FarmResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_farm(
    farm_data: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await create_farm(db, farm_data, current_user.id)


@router.put(
    "/{farm_id}",
    response_model=FarmResponse,
)
async def update_existing_farm(
    farm_id: int,
    farm_data: FarmUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = get_farm(db, farm_id, current_user.id)

    if farm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found",
        )

    return await update_farm(db, farm, farm_data)


@router.delete(
    "/{farm_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = get_farm(db, farm_id, current_user.id)

    if farm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found",
        )

    delete_farm(db, farm)