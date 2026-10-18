import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.core.security import usuario_atual
from app.models import Anuncio, Item
from app.schemas import AnuncioCreate

router = APIRouter(prefix="/anuncios", tags=["anúncios"])

@router.post("", status_code=201)
async def criar_anuncio(
    dados: AnuncioCreate,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    item = Item(doador_id=pessoa_id, categoria=dados.categoria,
                estado_conservacao=dados.estado_conservacao, quantidade=dados.quantidade)
    db.add(item)
    await db.flush()                      # gera item.id
    anuncio = Anuncio(doador_id=pessoa_id, item_id=item.id, titulo=dados.titulo,
                      descricao=dados.descricao, cidade=dados.cidade, bairro=dados.bairro)
    db.add(anuncio)
    await db.commit()
    return {"id": anuncio.id}