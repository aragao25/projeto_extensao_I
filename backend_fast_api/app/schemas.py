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