from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FarmBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    area_acres: float = Field(gt=0)

    village: str = Field(min_length=1, max_length=100)
    taluka: str = Field(min_length=1, max_length=100)
    district: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)

    pincode: str | None = Field(
        default=None,
        max_length=10,
    )

    latitude: float | None = None
    longitude: float | None = None

    soil_type: str | None = Field(
        default=None,
        max_length=100,
    )

    irrigation_type: str | None = Field(
        default=None,
        max_length=100,
    )

    water_source: str | None = Field(
        default=None,
        max_length=100,
    )


class FarmCreate(FarmBase):
    pass


class FarmUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    area_acres: float | None = Field(
        default=None,
        gt=0,
    )

    village: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    taluka: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    district: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    state: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    pincode: str | None = Field(
        default=None,
        max_length=10,
    )

    latitude: float | None = None
    longitude: float | None = None

    soil_type: str | None = Field(
        default=None,
        max_length=100,
    )

    irrigation_type: str | None = Field(
        default=None,
        max_length=100,
    )

    water_source: str | None = Field(
        default=None,
        max_length=100,
    )


class FarmResponse(FarmBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)