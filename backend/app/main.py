from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.farms import router as farms_router
from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.crops import router as crops_router
from app.api.routes.crop_recommendation import router as crop_recommendation_router
from app.api.routes.disease import router as disease_router
from app.api.routes.fertilizer import router as fertilizer_router
from app.api.routes.irrigation import router as irrigation_router
from app.api.routes.ai import router as ai_router
from app.core.config import settings


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    farms_router,
    prefix="/api",
)

app.include_router(
    auth_router,
    prefix="/api",
)

app.include_router(
    users_router,
    prefix="/api",
)

app.include_router(
    crops_router,
    prefix="/api",
)

app.include_router(
    crop_recommendation_router,
    prefix="/api",
)

app.include_router(
    disease_router,
    prefix="/api",
)

app.include_router(
    fertilizer_router,
    prefix="/api",
)

app.include_router(
    irrigation_router,
    prefix="/api",
)


@app.get("/")
def root():
    return {
        "message": "KrishiMitra AI API is running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }
from app.api.routes.irrigation_recommendation import router as irrigation_recommendation_router

app.include_router(
    irrigation_recommendation_router,
    prefix='/api',
)

from app.api.routes.ai import router as ai_router
app.include_router(ai_router, prefix='/api')

from app.api.routes.weather import router as weather_router
app.include_router(weather_router, prefix='/api')

from app.api.routes.market import router as market_router
from app.api.routes.schemes import router as schemes_router
from app.api.routes.notifications import router as notifications_router
app.include_router(market_router, prefix='/api')

app.include_router(schemes_router, prefix='/api')

app.include_router(notifications_router, prefix='/api')
