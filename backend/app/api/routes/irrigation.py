from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.irrigation import (
    IrrigationCreate,
    IrrigationResponse,
    IrrigationUpdate,
)
from app.services.farm_service import get_farm
from app.services.irrigation_service import (
    create_irrigation,
    delete_irrigation,
    get_irrigation,
    get_irrigations,
    update_irrigation,
)

router = APIRouter(
    prefix="/farms/{farm_id}/irrigations",
    tags=["Irrigation"],
)


def get_user_farm(
    db: Session,
    farm_id: int,
    current_user: User,
):
    farm = get_farm(db, farm_id, current_user.id)

    if farm is None or farm.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found",
        )

    return farm


@router.get(
    "",
    response_model=list[IrrigationResponse],
)
def list_irrigations(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(db, farm_id, current_user)
    return get_irrigations(db, farm_id)


@router.get(
    "/{irrigation_id}",
    response_model=IrrigationResponse,
)
def read_irrigation(
    farm_id: int,
    irrigation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(db, farm_id, current_user)

    irrigation = get_irrigation(db, farm_id, irrigation_id)

    if irrigation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Irrigation record not found",
        )

    return irrigation


@router.post(
    "",
    response_model=IrrigationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_irrigation_record(
    farm_id: int,
    data: IrrigationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(db, farm_id, current_user)

    try:
        return create_irrigation(db, farm_id, data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.patch(
    "/{irrigation_id}",
    response_model=IrrigationResponse,
)
def update_irrigation_record(
    farm_id: int,
    irrigation_id: int,
    data: IrrigationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(db, farm_id, current_user)

    irrigation = get_irrigation(db, farm_id, irrigation_id)

    if irrigation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Irrigation record not found",
        )

    return update_irrigation(db, irrigation, data)


@router.delete(
    "/{irrigation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_irrigation_record(
    farm_id: int,
    irrigation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_farm(db, farm_id, current_user)

    irrigation = get_irrigation(db, farm_id, irrigation_id)

    if irrigation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Irrigation record not found",
        )

    delete_irrigation(db, irrigation)
