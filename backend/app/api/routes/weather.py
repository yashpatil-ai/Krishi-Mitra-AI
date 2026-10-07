from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.farm import Farm
from app.services.weather_service import get_farm_weather

router = APIRouter(prefix="/farms", tags=["Weather"])


@router.get("/{farm_id}/weather")
async def farm_weather(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    farm = (
        db.query(Farm)
        .filter(
            Farm.id == farm_id,
            Farm.user_id == current_user.id,
        )
        .first()
    )

    if farm is None:
        raise HTTPException(status_code=404, detail="Farm not found")

    if farm.latitude is None or farm.longitude is None:
        raise HTTPException(
            status_code=400,
            detail="Farm location is not configured",
        )

    start_date = date.today().isoformat()
    end_date = (date.today() + timedelta(days=4)).isoformat()

    try:
        return await get_farm_weather(
            latitude=farm.latitude,
            longitude=farm.longitude,
            start_date=start_date,
            end_date=end_date,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Weather service unavailable: {exc}",
        )
