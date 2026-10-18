import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.core.security import usuario_atual
from app.models import Anuncio, Item, Interesse

router = APIRouter(prefix="/interesses", tags=["interesses"])

@router.post("/{interesse_id}/aceitar")
async def aceitar(interesse_id: uuid.UUID,
                  pessoa_id: uuid.UUID = Depends(usuario_atual),
                  db: AsyncSession = Depends(get_session)):
    interesse = await db.get(Interesse, interesse_id)
    if not interesse:
        raise HTTPException(404, "Interesse não encontrado")
    anuncio = await db.get(Anuncio, interesse.anuncio_id)
    if anuncio.doador_id != pessoa_id:
        raise HTTPException(403, "Apenas o doador pode aceitar")
    if interesse.status != "pendente" or anuncio.status != "ativo":
        raise HTTPException(409, "Pedido não pode mais ser aceito")

    item = await db.get(Item, anuncio.item_id)
    interesse.status = "aceito"
    item.recebedor_id = interesse.solicitante_id
    item.disponivel = False
    anuncio.status = "reservado"
    await db.commit()         