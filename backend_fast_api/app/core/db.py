from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from supabase import create_client

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

print(f"DEBUG URL: '{settings.SUPABASE_URL}'")

engine = create_async_engine(
    settings.DATABASE_URL, pool_size=5, max_overflow=5, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_session():
    async with SessionLocal() as session:
        yield session
