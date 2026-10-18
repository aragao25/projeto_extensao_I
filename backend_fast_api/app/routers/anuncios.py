import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import usuario_atual
from app.models import Anuncio, Interesse, Item
from app.schemas import AnuncioCreate, AnuncioUpdate

router = APIRouter(prefix="/anuncios", tags=["anúncios"])

CAMPOS_ANUNCIO = {"titulo", "descricao", "cidade", "bairro"}

# status atual -> status para os quais o doador pode mudar
TRANSICOES = {
    "ativo": {"cancelado"},
    "reservado": {"concluido", "ativo", "cancelado"},
    "concluido": set(),
    "cancelado": set(),
}


async def _anuncio_do_doador(anuncio_id: uuid.UUID, pessoa_id: uuid.UUID, db: AsyncSession) -> Anuncio:
    anuncio = await db.get(Anuncio, anuncio_id)
    if not anuncio:
        raise HTTPException(404, "Anúncio não encontrado")
    if anuncio.doador_id != pessoa_id:
        raise HTTPException(403, "Apenas o doador pode alterar este anúncio")
    return anuncio


async def _aplicar_status(anuncio: Anuncio, novo: str, db: AsyncSession) -> None:
    if novo == anuncio.status:
        return
    if novo not in TRANSICOES[anuncio.status]:
        raise HTTPException(409, f"Não é possível mudar de '{anuncio.status}' para '{novo}'")

    if novo in ("ativo", "cancelado"):
        item = await db.get(Item, anuncio.item_id)
        item.recebedor_id = None
        item.disponivel = novo == "ativo"
        # encerra pedidos pendentes ou já aceitos
        await db.execute(
            update(Interesse)
            .where(
                Interesse.anuncio_id == anuncio.id,
                Interesse.status.in_(["pendente", "aceito"]),
            )
            .values(status="recusado")
        )
    anuncio.status = novo


@router.post("", status_code=201)
async def criar_anuncio(
    dados: AnuncioCreate,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    item = Item(
        doador_id=pessoa_id, categoria=dados.categoria,
        estado_conservacao=dados.estado_conservacao, quantidade=dados.quantidade,
    )
    db.add(item)
    await db.flush()                      # gera item.id
    anuncio = Anuncio(
        doador_id=pessoa_id, item_id=item.id, titulo=dados.titulo,
        descricao=dados.descricao, cidade=dados.cidade, bairro=dados.bairro,
    )
    db.add(anuncio)
    await db.commit()
    return {"id": anuncio.id}


@router.patch("/{anuncio_id}")
async def editar_anuncio(
    anuncio_id: uuid.UUID,
    dados: AnuncioUpdate,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    anuncio = await _anuncio_do_doador(anuncio_id, pessoa_id, db)
    if anuncio.status in ("concluido", "cancelado"):
        raise HTTPException(409, "Anúncio encerrado não pode ser editado")

    campos = dados.model_dump(exclude_none=True)
    novo_status = campos.pop("status", None)

    item = await db.get(Item, anuncio.item_id)
    for nome, valor in campos.items():
        alvo = anuncio if nome in CAMPOS_ANUNCIO else item
        setattr(alvo, nome, valor)

    if novo_status:
        await _aplicar_status(anuncio, novo_status, db)

    await db.commit()
    return {"id": anuncio.id, "status": anuncio.status}


@router.delete("/{anuncio_id}", status_code=204)
async def cancelar_anuncio(
    anuncio_id: uuid.UUID,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    anuncio = await _anuncio_do_doador(anuncio_id, pessoa_id, db)
    if anuncio.status == "concluido":
        raise HTTPException(409, "Doação concluída não pode ser cancelada")
    await _aplicar_status(anuncio, "cancelado", db)
    await db.commit()