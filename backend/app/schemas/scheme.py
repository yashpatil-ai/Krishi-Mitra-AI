from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class SchemeBase(BaseModel):
    name: str
    short_name: str | None = None
    description: str

    category: str
    level: str = "central"

    state: str | None = None
    target_beneficiaries: str | None = None
    eligible_crops: str | None = None

    benefits: str | None = None
    eligibility: str | None = None
    required_documents: str | None = None
    application_process: str | None = None

    official_url: str | None = None
    source_name: str | None = None

    application_start: date | None = None
    application_end: date | None = None

    is_active: bool = True


class SchemeCreate(SchemeBase):
    pass


class SchemeResponse(SchemeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    last_verified_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
