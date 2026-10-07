from app.integrations.weather.client import get_weather


async def fetch_weather(
    location: str,
    start_date: str | None = None,
    end_date: str | None = None,
) -> dict:
    """
    Fetch weather data through the configured weather provider.
    """

    return await get_weather(
        location=location,
        start_date=start_date,
        end_date=end_date,
    )