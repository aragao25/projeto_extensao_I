from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from supabase import create_client, Client

# print(f"DEBUG URL: '{settings.SUPABASE_URL}'")
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

engine = create_async_engine(
    settings.DATABASE_URL, pool_size=5, max_overflow=5, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_session():
    async with SessionLocal() as session:
        yield session
