from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class CropBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    variety: str | None = Field(default=None, max_length=100)
    area_acres: float = Field(gt=0)
    sowing_date: date | None = None
    expected_harvest_date: date | None = None
    season: str | None = Field(default=None, max_length=50)


class CropCreate(CropBase):
    pass


class CropUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    variety: str | None = Field(default=None, max_length=100)
    area_acres: float | None = Field(default=None, gt=0)
    sowing_date: date | None = None
    expected_harvest_date: date | None = None
    season: str | None = Field(default=None, max_length=50)
    status: str | None = Field(default=None, max_length=50)


class CropResponse(CropBase):
    id: int
    farm_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)