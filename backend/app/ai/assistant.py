from sqlalchemy.orm import Session

from app.ai.ollama import generate_response
from app.ai.rag import build_farm_context
from app.ai.weather_context import build_weather_context
from app.models.farm import Farm


SYSTEM_PROMPT = """
You are KrishiMitra AI, a helpful agricultural assistant for Indian farmers.

Your role:
- Give practical, easy-to-understand farming guidance.
- Explain agricultural concepts in simple language.
- Help farmers understand crop, soil, irrigation, fertilizer, weather, and plant-disease information.
- Use the farmer's farm and current weather context when available.
- Never invent weather conditions or farm information.
- Clearly distinguish retrieved farm/weather information from general agricultural guidance.
- If important information is missing, say what is missing.
- For serious crop disease or chemical-use decisions, recommend consulting a qualified agricultural expert.
- Prefer concise, actionable answers.
- Use Indian agricultural context and metric units.
"""


async def ask_assistant(
    db: Session,
    user_id: int,
    message: str,
    context: str = "",
) -> str:
    farm_context = build_farm_context(db, user_id)

    farm = (
        db.query(Farm)
        .filter(Farm.user_id == user_id)
        .order_by(Farm.id.desc())
        .first()
    )

    if farm is not None:
        try:
            weather_context = await build_weather_context(farm)
        except Exception:
            weather_context = "Live weather information is currently unavailable."
    else:
        weather_context = "No farm-specific weather information is available."

    combined_context = f"""
Farm information:
{farm_context}

Current weather and forecast:
{weather_context}
""".strip()

    if context.strip():
        combined_context += f"""

Additional farmer-provided context:
{context}
""".strip()

    prompt = f"""
{SYSTEM_PROMPT}

{combined_context}

Farmer's question:
{message}

Answer the farmer directly and practically.
"""

    return await generate_response(prompt)
