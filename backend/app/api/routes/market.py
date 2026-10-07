from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.market import MarketPriceResponse
from app.services.market_provider import fetch_market_prices


router = APIRouter(
    prefix="/market",
    tags=["Market"],
)


@router.get("/prices")
async def get_prices(
    commodity: str | None = Query(default=None),
    state: str = Query(default="Maharashtra"),
    district: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = await fetch_market_prices(
        state=state,
        commodity=commodity,
    )

    if district:
        data = [
            item
            for item in data
            if item.get("district", "").strip().lower() == district.strip().lower()
        ]

    return data
