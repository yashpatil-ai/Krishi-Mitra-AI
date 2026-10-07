from app.integrations.weather.provider import fetch_weather


async def get_farm_weather(
    latitude: float,
    longitude: float,
    start_date: str | None = None,
    end_date: str | None = None,
) -> dict:
    location = f"{latitude},{longitude}"

    return await fetch_weather(
        location=location,
        start_date=start_date,
        end_date=end_date,
    )
