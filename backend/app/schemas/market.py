from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MarketPriceBase(BaseModel):
    commodity: str = Field(min_length=1, max_length=100)
    market: str = Field(min_length=1, max_length=150)
    district: str | None = Field(default=None, max_length=100)
    state: str | None = Field(default=None, max_length=100)
    min_price: float | None = Field(default=None, ge=0)
    max_price: float | None = Field(default=None, ge=0)
    modal_price: float | None = Field(default=None, ge=0)
    price_unit: str = Field(default="quintal", max_length=50)
    price_date: datetime
    source: str = Field(default="manual", max_length=100)


class MarketPriceCreate(MarketPriceBase):
    pass


class MarketPriceResponse(MarketPriceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
