from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class IrrigationBase(BaseModel):
    crop_id: int = Field(gt=0)
    irrigation_date: datetime
    water_required_liters: float = Field(gt=0)
    duration_minutes: float | None = Field(default=None, gt=0)
    method: str | None = Field(default=None, max_length=50)
    status: str = Field(default="recommended", max_length=50)
    source: str = Field(default="weather", max_length=50)


class IrrigationCreate(IrrigationBase):
    pass


class IrrigationUpdate(BaseModel):
    irrigation_date: datetime | None = None
    water_required_liters: float | None = Field(default=None, gt=0)
    duration_minutes: float | None = Field(default=None, gt=0)
    method: str | None = Field(default=None, max_length=50)
    status: str | None = Field(default=None, max_length=50)
    source: str | None = Field(default=None, max_length=50)


class IrrigationResponse(IrrigationBase):
    id: int
    farm_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
