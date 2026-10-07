from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.crop import Crop
from app.models.farm import Farm
from app.models.irrigation import Irrigation
from app.schemas.irrigation import IrrigationCreate, IrrigationUpdate
from app.services.weather_service import get_farm_weather


def get_irrigations(
    db: Session,
    farm_id: int,
) -> list[Irrigation]:
    statement = (
        select(Irrigation)
        .where(Irrigation.farm_id == farm_id)
        .order_by(Irrigation.irrigation_date.desc())
    )
    return list(db.scalars(statement).all())


def get_irrigation(
    db: Session,
    farm_id: int,
    irrigation_id: int,
) -> Irrigation | None:
    statement = select(Irrigation).where(
        Irrigation.id == irrigation_id,
        Irrigation.farm_id == farm_id,
    )
    return db.scalar(statement)


def create_irrigation(
    db: Session,
    farm_id: int,
    data: IrrigationCreate,
) -> Irrigation:
    farm = db.get(Farm, farm_id)

    if farm is None:
        raise ValueError("Farm not found")

    crop = db.get(Crop, data.crop_id)

    if crop is None or crop.farm_id != farm_id:
        raise ValueError("Crop not found for this farm")

    irrigation = Irrigation(
        farm_id=farm_id,
        crop_id=data.crop_id,
        irrigation_date=data.irrigation_date,
        water_required_liters=data.water_required_liters,
        duration_minutes=data.duration_minutes,
        method=data.method,
        status=data.status,
        source=data.source,
    )

    db.add(irrigation)
    db.commit()
    db.refresh(irrigation)

    return irrigation


def update_irrigation(
    db: Session,
    irrigation: Irrigation,
    data: IrrigationUpdate,
) -> Irrigation:
    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(irrigation, field, value)

    db.commit()
    db.refresh(irrigation)

    return irrigation


def delete_irrigation(
    db: Session,
    irrigation: Irrigation,
) -> None:
    db.delete(irrigation)
    db.commit()


def calculate_water_requirement(
    area_acres: float,
    temperature: float,
    humidity: float,
    precipitation: float,
) -> float:
    base_requirement = area_acres * 4046.86 * 0.005

    temperature_factor = max(
        0.8,
        min(1.5, 1 + (temperature - 25) * 0.02),
    )

    humidity_factor = max(
        0.7,
        min(1.2, 1 - (humidity - 50) * 0.006),
    )

    rain_factor = max(
        0.0,
        min(1.0, 1 - (precipitation / 10)),
    )

    return round(
        base_requirement
        * temperature_factor
        * humidity_factor
        * rain_factor,
        2,
    )


async def generate_irrigation_recommendation(
    db: Session,
    farm_id: int,
    crop_id: int,
) -> Irrigation:
    farm = db.get(Farm, farm_id)

    if farm is None:
        raise ValueError("Farm not found")

    crop = db.get(Crop, crop_id)

    if crop is None or crop.farm_id != farm_id:
        raise ValueError("Crop not found for this farm")

    if farm.latitude is None or farm.longitude is None:
        raise ValueError(
            "Farm location is required for weather-based irrigation"
        )

    weather = await get_farm_weather(
        latitude=farm.latitude,
        longitude=farm.longitude,
    )

    current = weather.get("currentConditions", {})

    temperature = float(current.get("temp", 25))
    humidity = float(current.get("humidity", 50))
    precipitation = float(current.get("precip", 0))

    water_required = calculate_water_requirement(
        area_acres=crop.area_acres,
        temperature=temperature,
        humidity=humidity,
        precipitation=precipitation,
    )

    irrigation = Irrigation(
        farm_id=farm_id,
        crop_id=crop_id,
        irrigation_date=datetime.utcnow() + timedelta(days=1),
        water_required_liters=water_required,
        method=farm.irrigation_type,
        status="recommended",
        source="weather",
    )

    db.add(irrigation)
    db.commit()
    db.refresh(irrigation)

    return irrigation
