from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.crop import Crop
from app.models.farm import Farm


def build_farm_context(db: Session, user_id: int) -> str:
    farms = list(
        db.scalars(
            select(Farm)
            .where(Farm.user_id == user_id)
            .order_by(Farm.id.desc())
        ).all()
    )

    if not farms:
        return "No farm information is available for this farmer."

    sections = []

    for farm in farms:
        crops = list(
            db.scalars(
                select(Crop)
                .where(
                    Crop.farm_id == farm.id,
                    Crop.status == "active",
                )
                .order_by(Crop.id.desc())
            ).all()
        )

        crop_lines = []

        for crop in crops:
            crop_lines.append(
                f"- {crop.name}"
                f"{f' ({crop.variety})' if crop.variety else ''}"
                f", area: {crop.area_acres} acres"
                f"{f', season: {crop.season}' if crop.season else ''}"
                f"{f', sowing date: {crop.sowing_date}' if crop.sowing_date else ''}"
            )

        crops_text = (
            "\n".join(crop_lines)
            if crop_lines
            else "No active crops recorded."
        )

        sections.append(
            f"""
Farm: {farm.name}
Area: {farm.area_acres} acres
Location: {farm.village}, {farm.taluka}, {farm.district}, {farm.state}
Soil type: {farm.soil_type or "Not recorded"}
Irrigation type: {farm.irrigation_type or "Not recorded"}
Water source: {farm.water_source or "Not recorded"}
Active crops:
{crops_text}
""".strip()
        )

    return "\n\n".join(sections)
