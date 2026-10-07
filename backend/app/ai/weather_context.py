from datetime import date, timedelta

from app.models.farm import Farm
from app.services.weather_service import get_farm_weather


async def build_weather_context(farm: Farm) -> str:
    if farm.latitude is None or farm.longitude is None:
        return "Weather information is unavailable because the farm location is not recorded."

    start_date = date.today().isoformat()
    end_date = (date.today() + timedelta(days=4)).isoformat()

    weather = await get_farm_weather(
        latitude=farm.latitude,
        longitude=farm.longitude,
        start_date=start_date,
        end_date=end_date,
    )

    current = weather.get("currentConditions", {})
    days = weather.get("days", [])

    lines = [
        f"Current temperature: {current.get('temp', 'unknown')} C",
        f"Current humidity: {current.get('humidity', 'unknown')}%",
        f"Current precipitation: {current.get('precip', 'unknown')} mm",
        f"Current wind speed: {current.get('windspeed', 'unknown')} km/h",
    ]

    for day in days[:5]:
        lines.append(
            f"{day.get('datetime', 'unknown')}: "
            f"max {day.get('tempmax', 'unknown')} C, "
            f"min {day.get('tempmin', 'unknown')} C, "
            f"precipitation {day.get('precip', 'unknown')} mm, "
            f"conditions {day.get('conditions', 'unknown')}"
        )

    return "\n".join(lines)

