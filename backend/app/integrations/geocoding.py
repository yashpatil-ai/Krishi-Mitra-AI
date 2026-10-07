import httpx


async def _search_location(query: str) -> tuple[float, float] | None:
    params = {
        "q": query,
        "format": "json",
        "limit": 1,
    }

    headers = {
        "User-Agent": "KrishiMitra-AI/1.0",
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            "https://nominatim.openstreetmap.org/search",
            params=params,
            headers=headers,
        )

    response.raise_for_status()
    results = response.json()

    if not results:
        return None

    return float(results[0]["lat"]), float(results[0]["lon"])


async def geocode_location(
    village: str,
    taluka: str,
    district: str,
    state: str,
) -> tuple[float, float] | None:

    queries = [
        f"{village}, {taluka}, {district}, {state}, India",
        f"{taluka}, {district}, {state}, India",
        f"{district}, {state}, India",
    ]

    for query in queries:
        coordinates = await _search_location(query)

        if coordinates:
            return coordinates

    return None