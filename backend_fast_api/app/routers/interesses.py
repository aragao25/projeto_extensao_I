import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import usuario_atual
from app.models import Anuncio, Interesse, Item, Pessoa
from app.schemas import InteresseCreate

router = APIRouter(tags=["interesses"])


@router.post("/anuncios/{anuncio_id}/interesses", status_code=201)
async def pedir(
    anuncio_id: uuid.UUID,
    dados: InteresseCreate,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    anuncio = await db.get(Anuncio, anuncio_id)
    if not anuncio:
        raise HTTPException(404, "Anúncio não encontrado")
    if anuncio.status != "ativo":
        raise HTTPException(409, "Este anúncio não está mais disponível")
    if anuncio.doador_id == pessoa_id:
        raise HTTPException(400, "Você não pode pedir o próprio item")

    interesse = Interesse(
        anuncio_id=anuncio_id, solicitante_id=pessoa_id, mensagem=dados.mensagem
    )
    db.add(interesse)
    try:
        await db.commit()
    except IntegrityError:          # unique (anuncio_id, solicitante_id)
        await db.rollback()
        raise HTTPException(409, "Você já pediu este item")
    return {"id": interesse.id}


@router.get("/interesses/recebidos")
async def recebidos(
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    q = (
        select(Interesse, Anuncio.titulo, Pessoa.nome)
        .join(Anuncio, Anuncio.id == Interesse.anuncio_id)
        .join(Pessoa, Pessoa.id == Interesse.solicitante_id)
        .where(Anuncio.doador_id == pessoa_id)
        .order_by(Interesse.criado_em.desc())
    )
    linhas = (await db.execute(q)).all()
    return [
        {
            "id": i.id, "anuncio_id": i.anuncio_id, "anuncio_titulo": titulo,
            "solicitante_nome": nome, "mensagem": i.mensagem,
            "status": i.status, "criado_em": i.criado_em,
        }
        for i, titulo, nome in linhas
    ]


@router.get("/interesses/enviados")
async def enviados(
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    q = (
        select(Interesse, Anuncio.titulo)
        .join(Anuncio, Anuncio.id == Interesse.anuncio_id)
        .where(Interesse.solicitante_id == pessoa_id)
        .order_by(Interesse.criado_em.desc())
    )
    linhas = (await db.execute(q)).all()
    return [
        {
            "id": i.id, "anuncio_id": i.anuncio_id, "anuncio_titulo": titulo,
            "mensagem": i.mensagem, "status": i.status, "criado_em": i.criado_em,
        }
        for i, titulo in linhas
    ]


async def _pedido_do_doador(interesse_id: uuid.UUID, pessoa_id: uuid.UUID, db: AsyncSession):
    interesse = await db.get(Interesse, interesse_id)
    if not interesse:
        raise HTTPException(404, "Interesse não encontrado")
    anuncio = await db.get(Anuncio, interesse.anuncio_id)
    if anuncio.doador_id != pessoa_id:
        raise HTTPException(403, "Apenas o doador pode decidir")
    if interesse.status != "pendente":
        raise HTTPException(409, "Este pedido já foi decidido")
    return interesse, anuncio


@router.post("/interesses/{interesse_id}/aceitar")
async def aceitar(
    interesse_id: uuid.UUID,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    interesse, anuncio = await _pedido_do_doador(interesse_id, pessoa_id, db)
    if anuncio.status != "ativo":
        raise HTTPException(409, "O anúncio não está mais ativo")

    item = await db.get(Item, anuncio.item_id)
    interesse.status = "aceito"
    item.recebedor_id = interesse.solicitante_id
    item.disponivel = False
    anuncio.status = "reservado"
    # os outros pedidos pendentes do mesmo anúncio são recusados
    await db.execute(
        update(Interesse)
        .where(
            Interesse.anuncio_id == anuncio.id,
            Interesse.id != interesse.id,
            Interesse.status == "pendente",
        )
        .values(status="recusado")
    )
    await db.commit()                # tudo ou nada
    return {"status": "aceito"}


@router.post("/interesses/{interesse_id}/recusar")
async def recusar(
    interesse_id: uuid.UUID,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    interesse, _ = await _pedido_do_doador(interesse_id, pessoa_id, db)
    interesse.status = "recusado"
    await db.commit()
    return {"status": "recusado"}