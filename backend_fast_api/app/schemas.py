# app/schemas.py
from typing import Literal
from pydantic import BaseModel, Field

class AnuncioCreate(BaseModel):
    titulo: str = Field(min_length=3, max_length=120)
    descricao: str | None = None
    cidade: str
    bairro: str | None = None
    categoria: str
    estado_conservacao: Literal["novo", "bom", "regular"]
    quantidade: int = Field(default=1, ge=1)


class AnuncioUpdate(BaseModel):
    titulo: str | None = Field(default=None, min_length=3, max_length=120)
    descricao: str | None = None
    cidade: str | None = Field(default=None, min_length=1, max_length=80)
    bairro: str | None = Field(default=None, max_length=80)
    categoria: str | None = Field(default=None, max_length=60)
    estado_conservacao: Literal["novo", "bom", "regular"] | None = None
    quantidade: int | None = Field(default=None, ge=1)
    status: Literal["ativo", "concluido", "cancelado"] | None = None