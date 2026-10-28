from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.db import engine
from app.routers import anuncios, favoritos, interesses, me


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()          # fecha o pool de conexões ao desligar


app = FastAPI(title="API de Doações", version="0.1.0",
              lifespan=lifespan)   # <- a variável "app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(me.router)
app.include_router(anuncios.router)
app.include_router(favoritos.router)
app.include_router(interesses.router)


@app.get("/health", tags=["infra"])
async def health():
    return {"status": "ok"}
