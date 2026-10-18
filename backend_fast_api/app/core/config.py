from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    DATABASE_URL: str
    SUPABASE_URL: str
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
settings = Settings()