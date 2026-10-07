import httpx

from app.core.config import settings


class WeatherAPIError(Exception):
    """Raised when the weather provider returns an error."""


async def get_weather(
    location: str,
    start_date: str | None = None,
    end_date: str | None = None,
) -> dict:
    """
    Fetch weather data from Visual Crossing.

    Args:
        location: City, village, coordinates, or other location supported
                  by Visual Crossing.
        start_date: Optional start date in YYYY-MM-DD format.
        end_date: Optional end date in YYYY-MM-DD format.
    """

    endpoint = f"{settings.weather_api_base_url}/{location}"

    if start_date and end_date:
        endpoint = f"{endpoint}/{start_date}/{end_date}"
    elif start_date:
        endpoint = f"{endpoint}/{start_date}"

    params = {
        "key": settings.weather_api_key,
        "unitGroup": "metric",
        "include": "current,days,hours",
        "contentType": "json",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(endpoint, params=params)

        if response.status_code != 200:
            raise WeatherAPIError(
                f"Weather provider returned status {response.status_code}"
            )

        return response.json()

    except httpx.HTTPError as exc:
        raise WeatherAPIError(
            f"Failed to connect to weather provider: {exc}"
        ) from exc