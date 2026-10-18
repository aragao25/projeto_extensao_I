import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import usuario_atual
from app.models import Anuncio, Favorito

router = APIRouter(prefix="/favoritos", tags=["favoritos"])


@router.put("/{anuncio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def favoritar(
    anuncio_id: uuid.UUID,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    if not await db.get(Anuncio, anuncio_id):
        raise HTTPException(404, "Anúncio não encontrado")
    # idempotente: favoritar duas vezes não gera erro
    await db.execute(
        insert(Favorito)
        .values(pessoa_id=pessoa_id, anuncio_id=anuncio_id)
        .on_conflict_do_nothing()
    )
    await db.commit()


@router.delete("/{anuncio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def desfavoritar(
    anuncio_id: uuid.UUID,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    await db.execute(
        delete(Favorito).where(
            Favorito.pessoa_id == pessoa_id, Favorito.anuncio_id == anuncio_id
        )
    )
    await db.commit()