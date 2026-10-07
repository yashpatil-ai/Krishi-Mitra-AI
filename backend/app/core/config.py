from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str

    jwt_secret_key: str

    weather_api_key: str
    weather_api_base_url: str = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"   

    app_name: str = "KrishiMitra AI"
    debug: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()