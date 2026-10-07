from sqlalchemy import select
from sqlalchemy.orm import Session
from app.integrations.geocoding import geocode_location
from app.models.farm import Farm
from app.schemas.farm import FarmCreate, FarmUpdate


def get_farms(db: Session, user_id: int) -> list[Farm]:
    statement = (
        select(Farm)
        .where(Farm.user_id == user_id)
        .order_by(Farm.id.desc())
    )

    return list(db.scalars(statement).all())


def get_farm(
    db: Session,
    farm_id: int,
    user_id: int,
) -> Farm | None:
    statement = select(Farm).where(
        Farm.id == farm_id,
        Farm.user_id == user_id,
    )

    return db.scalar(statement)


async def create_farm(
    db: Session,
    farm_data: FarmCreate,
    user_id: int,
) -> Farm:
    coordinates = await geocode_location(
        village=farm_data.village,
        taluka=farm_data.taluka,
        district=farm_data.district,
        state=farm_data.state,
    )

    farm_data_dict = farm_data.model_dump()

    if coordinates:
        farm_data_dict["latitude"] = coordinates[0]
        farm_data_dict["longitude"] = coordinates[1]

    farm = Farm(
        **farm_data_dict,
        user_id=user_id,
    )

    db.add(farm)
    db.commit()
    db.refresh(farm)

    return farm


async def update_farm(
    db: Session,
    farm: Farm,
    farm_data: FarmUpdate,
) -> Farm:
    location_fields = {"village", "taluka", "district", "state"}

    if location_fields.intersection(farm_data.model_dump(exclude_unset=True)):
        coordinates = await geocode_location(
            village=farm_data.village or farm.village,
            taluka=farm_data.taluka or farm.taluka,
            district=farm_data.district or farm.district,
            state=farm_data.state or farm.state,
        )

        if coordinates:
            farm.latitude = coordinates[0]
            farm.longitude = coordinates[1]

    update_data = farm_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(farm, field, value)

    db.commit()
    db.refresh(farm)

    return farm


def delete_farm(db: Session, farm: Farm) -> None:
    db.delete(farm)
    db.commit()