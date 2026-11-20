from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173", "http://localhost:3000"]


settings = Settings()
