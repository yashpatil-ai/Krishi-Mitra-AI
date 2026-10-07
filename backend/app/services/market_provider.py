import httpx


MANDI_API_URL = "https://mandi-api.onrender.com/v1/prices"


async def fetch_market_prices(
    state: str = "Maharashtra",
    commodity: str | None = None,
):
    params = {
        "state": state,
    }

    if commodity:
        params["commodity"] = commodity

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(MANDI_API_URL, params=params)
        response.raise_for_status()

        payload = response.json()

    return payload.get("data", [])
