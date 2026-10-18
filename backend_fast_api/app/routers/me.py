import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import usuario_atual
from app.models import Pessoa
from app.schemas import PessoaUpdate


router = APIRouter(tags=["perfil"])

@router.get("/me")
async def meu_perfil(
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    pessoa = await db.get(Pessoa, pessoa_id)
    if not pessoa:
        raise HTTPException(404, "Perfil não encontrado")
    return {"id": pessoa.id, "nome": pessoa.nome, "email": pessoa.email, "telefone": pessoa.telefone}

# app/routers/me.py (acrescente PessoaUpdate ao import de app.schemas)
@router.patch("/me")
async def atualizar_perfil(
    dados: PessoaUpdate,
    pessoa_id: uuid.UUID = Depends(usuario_atual),
    db: AsyncSession = Depends(get_session),
):
    pessoa = await db.get(Pessoa, pessoa_id)
    if not pessoa:
        raise HTTPException(404, "Perfil não encontrado")
    for campo, valor in dados.model_dump(exclude_none=True).items():
        setattr(pessoa, campo, valor)
    await db.commit()
    return {"id": pessoa.id, "nome": pessoa.nome, "email": pessoa.email, "telefone": pessoa.telefone}